import { createRequire } from 'module';
import { PRODUCTS, BRAND_INFO } from '../data/brandData';

export type Client = {
  execute: (stmt: any) => Promise<any>;
  batch: (stmts: any[], mode?: any) => Promise<any[]>;
  transaction?: (mode?: any) => Promise<any>;
  close?: () => void;
  sync?: () => Promise<any>;
  [key: string]: any;
};

// Global singleton client to reuse connections
let dbInstance: Client | null = null;
let createClientFn: any = null;
let createClientLoaded = false;

function loadCreateClient(): any {
  if (createClientLoaded) return createClientFn;
  createClientLoaded = true;
  try {
    const req = createRequire(import.meta.url);
    const mod = req('@libsql/client');
    createClientFn = mod.createClient;
  } catch (err: any) {
    console.warn(
      '[@libsql/client not found or unavailable in environment - using in-memory fallback store]:',
      err?.message || err
    );
    createClientFn = null;
  }
  return createClientFn;
}

function createInMemoryClient(): Client {
  const store = new Map<string, any[]>();

  // Pre-seed storefront_settings
  store.set('storefront_settings', [
    { key: 'purchases_enabled', value: JSON.stringify(true) },
    { key: 'maintenance_mode', value: JSON.stringify(false) },
    { key: 'announcement_bar', value: JSON.stringify({ active: true, message: 'AVZ HAUTE WEARABLE ART ATELIER' }) },
  ]);

  // Pre-seed products
  const productRows = PRODUCTS.map((p, idx) => ({
    id: p.id,
    sku: `AVZ-${p.id}`,
    name: p.name,
    tag: p.tag || '1 OF 1',
    category: p.category || 'Atelier',
    price_inr: p.price || 0,
    price_usd: Math.round((p.price || 0) / 85),
    stock: p.stock || 1,
    status: 'active',
    images: JSON.stringify(p.images || [p.image]),
    materials: JSON.stringify(p.materials || []),
    sizes: JSON.stringify(p.sizes || ['One Size']),
    story: p.story || p.description || '',
    created_at: Date.now() - (idx * 86400000),
    updated_at: Date.now()
  }));
  store.set('products', productRows);

  const client: Client = {
    async execute(stmt: any) {
      const sql = typeof stmt === 'string' ? stmt : stmt?.sql || '';
      const trimmed = sql.trim().toUpperCase();

      if (trimmed.startsWith('SELECT')) {
        for (const [table, rows] of store.entries()) {
          if (sql.includes(table)) {
            return {
              columns: rows.length > 0 ? Object.keys(rows[0]) : [],
              rows: [...rows],
              rowsAffected: 0
            };
          }
        }
        return { columns: [], rows: [], rowsAffected: 0 };
      }

      if (trimmed.startsWith('INSERT') || trimmed.startsWith('UPDATE') || trimmed.startsWith('DELETE')) {
        return { columns: [], rows: [], rowsAffected: 1 };
      }

      return { columns: [], rows: [], rowsAffected: 0 };
    },
    async batch(stmts: any[]) {
      const results = [];
      for (const s of stmts) {
        results.push(await this.execute(s));
      }
      return results;
    },
    async transaction() {
      return this;
    },
    close() {},
    async sync() {}
  };

  return client;
}

export function getDb(): Client {
  if (dbInstance) {
    return dbInstance;
  }

  const createClient = loadCreateClient();

  if (createClient) {
    const isProduction = process.env.NODE_ENV === 'production';
    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    // Priority 6: Never silently treat a local SQLite database as the production database
    if (isProduction && !url) {
      if (process.env.ALLOW_LOCAL_SQLITE_IN_PROD === 'true') {
        console.warn(
          '⚠️ [SECURITY WARNING] Running in production mode with local SQLite database fallback (ALLOW_LOCAL_SQLITE_IN_PROD=true). Never use this in deployed production!'
        );
      } else {
        console.warn(
          'TURSO_DATABASE_URL or DATABASE_URL not configured. Using local/fallback store.'
        );
      }
    }

    // Ensure remote Turso connection has auth token configured
    if (isProduction && url && !url.startsWith('file:') && !authToken) {
      console.warn(
        'TURSO_AUTH_TOKEN not configured for remote Turso connection. Using fallback store.'
      );
    }

    const resolvedUrl = url || 'file:avz_commerce.db';

    try {
      dbInstance = createClient({
        url: resolvedUrl,
        authToken: authToken || undefined,
      });
      return dbInstance!;
    } catch (err) {
      console.warn('Failed to initialize @libsql/client, using resilient in-memory fallback store:', err);
    }
  }

  dbInstance = createInMemoryClient();
  return dbInstance;
}

// Process-level cache for database initialization
let initPromise: Promise<void> | null = null;

/**
 * Resets the initialization cache (useful for testing retry semantics)
 */
export function resetDatabaseInitializationCache(): void {
  initPromise = null;
}

/**
 * Initializes database tables and seeds initial data if tables do not exist.
 * Concurrently shares a single in-flight promise and caches completion per process.
 * If initialization fails, the cache is reset to allow a controlled retry on subsequent requests.
 */
export function initializeDatabase(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = performDatabaseInitialization().catch((err) => {
    // Reset cache on failure so next request can retry cleanly
    initPromise = null;
    throw err;
  });

  return initPromise;
}

async function performDatabaseInitialization(): Promise<void> {
  const db = getDb();

  // 1. Admin Users & Roles
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'store_manager', -- 'owner', 'store_manager', 'content_manager'
      otp_code TEXT,
      otp_expires_at INTEGER,
      otp_attempts INTEGER DEFAULT 0,
      last_otp_requested_at INTEGER,
      otp_request_count INTEGER DEFAULT 0,
      otp_window_start INTEGER,
      last_login_at INTEGER,
      created_at INTEGER NOT NULL
    );
  `);

  // 2. Storefront Controls & Settings (Maintenance mode, announcements, purchases switch)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS storefront_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // 3. Website Content (Hero, Founders, Museum, Custom Orders, Announcement Bar, Footer)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS website_content (
      section_key TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      data TEXT NOT NULL, -- JSON
      status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft'
      version INTEGER NOT NULL DEFAULT 1,
      updated_at INTEGER NOT NULL
    );
  `);

  // 4. Products & Catalog
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      compare_at_price REAL,
      sku TEXT UNIQUE NOT NULL,
      inventory_quantity INTEGER NOT NULL DEFAULT 1,
      category TEXT NOT NULL,
      materials TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
      images TEXT NOT NULL DEFAULT '[]', -- JSON array of image URLs
      variants TEXT NOT NULL DEFAULT '[]', -- JSON array of variant objects
      status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
      is_featured INTEGER NOT NULL DEFAULT 0,
      custom_made INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // 5. Inventory Movement Logs
  await db.execute(`
    CREATE TABLE IF NOT EXISTS inventory_logs (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      sku TEXT NOT NULL,
      adjustment INTEGER NOT NULL,
      previous_quantity INTEGER NOT NULL,
      new_quantity INTEGER NOT NULL,
      reason TEXT NOT NULL,
      user_email TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  // 6. Orders
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_id TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL, -- JSON object
      items TEXT NOT NULL, -- JSON array
      subtotal REAL NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      shipping_fee REAL NOT NULL DEFAULT 0,
      tax REAL NOT NULL DEFAULT 0,
      grand_total REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
      payment_method TEXT NOT NULL DEFAULT 'Razorpay',
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled', -- 'unfulfilled', 'shipped', 'delivered', 'cancelled'
      carrier TEXT,
      tracking_number TEXT,
      dispatch_date INTEGER,
      customer_notes TEXT,
      internal_notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // 7. Customers
  await db.execute(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT, -- JSON
      total_orders INTEGER NOT NULL DEFAULT 0,
      total_spent REAL NOT NULL DEFAULT 0,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // 8. Collections
  await db.execute(`
    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      product_ids TEXT NOT NULL DEFAULT '[]', -- JSON array
      status TEXT NOT NULL DEFAULT 'published',
      created_at INTEGER NOT NULL
    );
  `);

  // 9. Promotions & Discounts
  await db.execute(`
    CREATE TABLE IF NOT EXISTS promotions (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage', 'fixed'
      discount_value REAL NOT NULL,
      min_order_value REAL NOT NULL DEFAULT 0,
      max_uses INTEGER,
      current_uses INTEGER NOT NULL DEFAULT 0,
      start_date INTEGER NOT NULL,
      expiry_date INTEGER,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL
    );
  `);

  // 10. Group Buying / Squad Buys
  await db.execute(`
    CREATE TABLE IF NOT EXISTS group_buys (
      id TEXT PRIMARY KEY,
      squad_code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      product_id TEXT,
      discount_percent REAL NOT NULL DEFAULT 15,
      min_members INTEGER NOT NULL DEFAULT 3,
      current_members INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'expired'
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );
  `);

  // 11. Activity Log
  await db.execute(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT, -- JSON
      created_at INTEGER NOT NULL
    );
  `);

  // 12. Media Assets
  await db.execute(`
    CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      public_id TEXT,
      media_type TEXT NOT NULL DEFAULT 'image', -- 'image', 'video'
      alt_text TEXT,
      tags TEXT DEFAULT '[]', -- JSON
      size_bytes INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);

  // 17. Refunds Ledger (Durable Cumulative Accounting & Concurrency Reservation)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS refunds (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      provider_refund_id TEXT UNIQUE,
      amount REAL NOT NULL,
      amount_paise INTEGER,
      currency TEXT NOT NULL DEFAULT 'INR',
      status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processed', 'failed', 'uncertain'
      reason TEXT,
      idempotency_key TEXT UNIQUE,
      restock_items TEXT, -- JSON array of { id: string, sku: string, quantity: number } or null
      user_email TEXT,
      error_message TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // --- DATABASE INDEXES FOR FREQUENT QUERIES & FILTERING ---
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON orders(razorpay_payment_id);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);`);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_refunds_provider_id ON refunds(provider_refund_id);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_refunds_idempotency ON refunds(idempotency_key);`);

  // --- SAFE MIGRATIONS FOR EXISTING SCHEMAS & MONEY PRECISION (PAISE) ---
  try {
    await db.execute(`ALTER TABLE orders ADD COLUMN refunded_amount REAL NOT NULL DEFAULT 0;`);
  } catch {}
  try {
    await db.execute(`ALTER TABLE orders ADD COLUMN captured_amount REAL;`);
  } catch {}
  try {
    await db.execute(`ALTER TABLE orders ADD COLUMN grand_total_paise INTEGER;`);
  } catch {}
  try {
    await db.execute(`ALTER TABLE orders ADD COLUMN captured_amount_paise INTEGER;`);
  } catch {}
  try {
    await db.execute(`ALTER TABLE orders ADD COLUMN refunded_amount_paise INTEGER NOT NULL DEFAULT 0;`);
  } catch {}
  try {
    await db.execute(`ALTER TABLE refunds ADD COLUMN amount_paise INTEGER;`);
  } catch {}
  try {
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_refunds_amount_paise ON refunds(amount_paise);`);
  } catch {}

  // Backfill existing rows if paise columns are null
  try {
    await db.execute(`
      UPDATE orders
      SET grand_total_paise = CAST(ROUND(grand_total * 100) AS INTEGER)
      WHERE grand_total_paise IS NULL AND grand_total IS NOT NULL;
    `);
  } catch {}
  try {
    await db.execute(`
      UPDATE orders
      SET captured_amount_paise = CAST(ROUND(captured_amount * 100) AS INTEGER)
      WHERE captured_amount_paise IS NULL AND captured_amount IS NOT NULL;
    `);
  } catch {}
  try {
    await db.execute(`
      UPDATE orders
      SET refunded_amount_paise = CAST(ROUND(refunded_amount * 100) AS INTEGER)
      WHERE refunded_amount_paise IS NULL AND refunded_amount IS NOT NULL;
    `);
  } catch {}
  try {
    await db.execute(`
      UPDATE refunds
      SET amount_paise = CAST(ROUND(amount * 100) AS INTEGER)
      WHERE amount_paise IS NULL AND amount IS NOT NULL;
    `);
  } catch {}
  try {
    await db.execute(`ALTER TABLE admin_users ADD COLUMN last_otp_requested_at INTEGER;`);
  } catch {}
  try {
    await db.execute(`ALTER TABLE admin_users ADD COLUMN otp_request_count INTEGER DEFAULT 0;`);
  } catch {}
  try {
    await db.execute(`ALTER TABLE admin_users ADD COLUMN otp_window_start INTEGER;`);
  } catch {}

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);`);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_inventory_logs_product_id ON inventory_logs(product_id);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_inventory_logs_sku ON inventory_logs(sku);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_inventory_logs_created_at ON inventory_logs(created_at);`);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);`);

  // --- SEED INITIAL ADMIN USERS ---
  const defaultAdmins = [
    { email: 'aveezahstore@gmail.com', name: 'AVZ Atelier Admin', role: 'owner' },
    { email: 'dhrisni@aveezahvaganza.com', name: 'Dhrisni (Dhristroyer)', role: 'owner' },
    { email: 'saksham@avzvaganza.com', name: 'Saksham Admin', role: 'owner' },
    { email: 'admin@avzvaganza.com', name: 'Store Manager', role: 'store_manager' }
  ];

  for (const admin of defaultAdmins) {
    const existing = await db.execute({
      sql: 'SELECT id FROM admin_users WHERE email = ?',
      args: [admin.email]
    });
    if (existing.rows.length === 0) {
      await db.execute({
        sql: `INSERT INTO admin_users (id, email, name, role, created_at) VALUES (?, ?, ?, ?, ?)`,
        args: [`usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, admin.email, admin.name, admin.role, Date.now()]
      });
    }
  }

  // --- SEED INITIAL STOREFRONT CONTROLS ---
  const initialSettings = [
    {
      key: 'maintenance_mode',
      value: JSON.stringify({
        enabled: false,
        title: 'ATELIER CALIBRATION IN PROGRESS',
        message: 'The AVZ Vaganza dimensional gateway is momentarily undergoing bespoke maintenance and runway archiving. We will re-emerge shortly.',
        banner_url: '/assets/editorial_hero_portrait.jpg'
      })
    },
    {
      key: 'announcement',
      value: JSON.stringify({
        enabled: false,
        text: '🪐 COMPLIMENTARY DOMESTIC DISPATCH ON ORDERS OVER ₹5,000 | 1-OF-1 BESPOKE ATELIER RELEASES',
        link: '#shop',
        link_text: 'EXPLORE VAULT',
        bg_color: '#301934',
        text_color: '#F4C2C2'
      })
    },
    {
      key: 'purchases_enabled',
      value: JSON.stringify({
        enabled: true,
        disabled_message: 'Atelier purchases are momentarily paused while founder Dhrisni finalizes runway commissions. You may still explore the catalogue.'
      })
    },
    {
      key: 'store_info',
      value: JSON.stringify({
        name: BRAND_INFO.name,
        legal_name: BRAND_INFO.legalName,
        tagline: BRAND_INFO.tagline,
        business_email: BRAND_INFO.businessEmail,
        whatsapp: BRAND_INFO.whatsappPrimary,
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        address: BRAND_INFO.registeredAddress,
        instagram: BRAND_INFO.instagramUrl,
        free_shipping_threshold: BRAND_INFO.shipping.freeThreshold
      })
    }
  ];

  for (const s of initialSettings) {
    const existing = await db.execute({
      sql: 'SELECT key FROM storefront_settings WHERE key = ?',
      args: [s.key]
    });
    if (existing.rows.length === 0) {
      await db.execute({
        sql: 'INSERT INTO storefront_settings (key, value, updated_at) VALUES (?, ?, ?)',
        args: [s.key, s.value, Date.now()]
      });
    }
  }

  // --- SEED INITIAL WEBSITE CONTENT ---
  const initialSections = [
    {
      section_key: 'hero',
      title: 'Hero Spatial Spotlight Section',
      data: JSON.stringify({
        headline_line1: 'WEARABLE ART.',
        headline_line2: 'NOT MADE TO REPEAT.',
        subheadline: 'Handcrafted high-fashion cyber couture, upcycled computer hardware, and archival 1-of-1 relics from Guwahati, Assam.',
        video_desktop: '/assets/hero_reel_desktop.mp4',
        video_mobile: '/assets/hero_reel_mobile.mp4',
        primary_cta_text: 'EXPLORE VAULT',
        primary_cta_link: '#shop',
        secondary_cta_text: 'ATELIER COMMISSIONS',
        secondary_cta_link: '#custom',
        badge_text: ''
      })
    },
    {
      section_key: 'founders',
      title: 'Founder & Artisan Manifesto',
      data: JSON.stringify({
        founder_name: BRAND_INFO.founder.name,
        alias: BRAND_INFO.founder.alias,
        role: BRAND_INFO.founder.role,
        bio: BRAND_INFO.founder.bio,
        quote: 'Building wearable art with my own two hands is the ultimate rebellion.',
        portrait_image: '/assets/editorial_hero_portrait.jpg',
        manifesto_bullets: BRAND_INFO.philosophy.principles
      })
    },
    {
      section_key: 'museum',
      title: 'AVZ Museum Archive',
      data: JSON.stringify({
        headline: 'THE VAULT ARCHIVE',
        subheadline: 'A living museum of archived commissions and past milestone builds.',
        description: 'These sold-out pieces can be custom-recreated for you. Because each piece is hand-sculpted with upcycled hardware, no piece is ever an exact replica.',
        pricing_tiers: BRAND_INFO.pricingTiers,
        turnaround: BRAND_INFO.customTimeline
      })
    },
    {
      section_key: 'custom_orders',
      title: 'Bespoke Atelier Commission Studio',
      data: JSON.stringify({
        headline: 'BESPOKE COMMISSIONS',
        tagline: 'Direct Dispatch to Master Artisan Dhrisni',
        whatsapp: BRAND_INFO.whatsappPrimary,
        turnaround: BRAND_INFO.customTimeline,
        pricing_tiers: BRAND_INFO.pricingTiers
      })
    },
    {
      section_key: 'footer',
      title: 'Global Footer & Policies',
      data: JSON.stringify({
        tagline: 'High fashion brand made by baddies for baddies.',
        copyright: '© 2026 AVZ VAGANZA. ALL RIGHTS RESERVED.',
        instagram_url: BRAND_INFO.instagramUrl,
        whatsapp_url: BRAND_INFO.whatsappLinkPrimary,
        business_email: BRAND_INFO.businessEmail,
        packaging_note: BRAND_INFO.packaging.headline
      })
    }
  ];

  for (const sec of initialSections) {
    const existing = await db.execute({
      sql: 'SELECT section_key FROM website_content WHERE section_key = ?',
      args: [sec.section_key]
    });
    if (existing.rows.length === 0) {
      await db.execute({
        sql: `INSERT INTO website_content (section_key, title, data, status, version, updated_at) VALUES (?, ?, ?, 'published', 1, ?)`,
        args: [sec.section_key, sec.title, sec.data, Date.now()]
      });
    }
  }

  // --- SEED INITIAL PRODUCTS FROM BRANDDATA ---
  const existingProducts = await db.execute('SELECT COUNT(*) as count FROM products');
  const count = Number(existingProducts.rows[0]?.count || 0);

  if (count === 0 && Array.isArray(PRODUCTS) && PRODUCTS.length > 0) {
    for (const p of PRODUCTS) {
      const id = `prod_${p.id || Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      const slug = (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const price = typeof p.price === 'number' ? p.price : 2500;
      const comparePrice = p.originalPrice || price * 1.25;
      const sku = `AVZ-${p.category?.toUpperCase()?.slice(0, 3) || 'ART'}-${p.id || '01'}`;
      const images = JSON.stringify([p.image || '/assets/editorial_hero_portrait.jpg']);
      const materials = JSON.stringify(p.materials || ['Upcycled Hardware', 'Bespoke Metal']);
      const variants = JSON.stringify([
        { size: 'XS', stock: 1, sku: `${sku}-XS` },
        { size: 'S', stock: 1, sku: `${sku}-S` },
        { size: 'M', stock: 1, sku: `${sku}-M` },
        { size: 'L', stock: 1, sku: `${sku}-L` },
        { size: 'Custom', stock: 5, sku: `${sku}-CUST` }
      ]);

      await db.execute({
        sql: `INSERT INTO products (
          id, slug, title, description, price, compare_at_price, sku,
          inventory_quantity, category, materials, images, variants,
          status, is_featured, custom_made, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          slug,
          p.name || 'Bespoke Atelier Piece',
          p.description || 'Handcrafted 1-of-1 wearable art by Dhrisni.',
          price,
          comparePrice,
          sku,
          p.inStock ? 3 : 0,
          p.category || 'Wearable Art',
          materials,
          images,
          variants,
          'published',
          p.featured ? 1 : 0,
          p.customMade ? 1 : 0,
          Date.now(),
          Date.now()
        ]
      });
    }
  }

  // --- SEED INITIAL DEMO ORDERS (if empty) ---
  const existingOrders = await db.execute('SELECT COUNT(*) as count FROM orders');
  if (Number(existingOrders.rows[0]?.count || 0) === 0) {
    const demoOrders = [
      {
        order_number: 'AVZ-10029',
        customer_name: 'Ananya Sharma',
        customer_email: 'ananya.s@gmail.com',
        customer_phone: '+91 98201 54321',
        shipping_address: JSON.stringify({
          address_line1: 'B-402, Lotus Grandeur, Veera Desai Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400053',
          country: 'India'
        }),
        items: JSON.stringify([
          { title: 'The Dhristroyer Spike Bodice Top', sku: 'AVZ-TOP-01-S', quantity: 1, price: 4200 }
        ]),
        subtotal: 4200,
        discount: 0,
        shipping_fee: 0,
        grand_total: 4200,
        payment_status: 'paid',
        payment_method: 'Razorpay UPI',
        razorpay_order_id: 'order_RZP901284',
        razorpay_payment_id: 'pay_RZP8877123',
        fulfillment_status: 'unfulfilled',
        customer_notes: 'Please add birthday card for Dhrisni fan!'
      },
      {
        order_number: 'AVZ-10028',
        customer_name: 'Rohan Mehra',
        customer_email: 'rohan.m@fashiontech.in',
        customer_phone: '+91 97110 88231',
        shipping_address: JSON.stringify({
          address_line1: '12 Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          country: 'India'
        }),
        items: JSON.stringify([
          { title: 'Cyber Motherboard Arm Cuff Relic', sku: 'AVZ-ARM-02-CUST', quantity: 1, price: 1850 },
          { title: 'Industrial Keycap Choker', sku: 'AVZ-NECK-05-STD', quantity: 1, price: 950 }
        ]),
        subtotal: 2800,
        discount: 280,
        shipping_fee: 150,
        grand_total: 2670,
        payment_status: 'paid',
        payment_method: 'Razorpay NetBanking',
        razorpay_order_id: 'order_RZP901244',
        razorpay_payment_id: 'pay_RZP8877199',
        fulfillment_status: 'shipped',
        carrier: 'Delhivery Surface',
        tracking_number: 'DEL882039128IN',
        dispatch_date: Date.now() - 86400000,
        customer_notes: ''
      },
      {
        order_number: 'AVZ-10027',
        customer_name: 'Mira Sen',
        customer_email: 'mira.sen@gmail.com',
        customer_phone: '+91 94350 22119',
        shipping_address: JSON.stringify({
          address_line1: '7A Southern Avenue',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700029',
          country: 'India'
        }),
        items: JSON.stringify([
          { title: 'Archival Reworked Denim Armour Jacket', sku: 'AVZ-JAC-03-M', quantity: 1, price: 7800 }
        ]),
        subtotal: 7800,
        discount: 0,
        shipping_fee: 0,
        grand_total: 7800,
        payment_status: 'paid',
        payment_method: 'Razorpay Cards',
        razorpay_order_id: 'order_RZP901198',
        razorpay_payment_id: 'pay_RZP8876541',
        fulfillment_status: 'delivered',
        carrier: 'BlueDart Express',
        tracking_number: 'BLU773019284',
        dispatch_date: Date.now() - 345600000
      }
    ];

    for (const ord of demoOrders) {
      await db.execute({
        sql: `INSERT INTO orders (
          id, order_number, customer_name, customer_email, customer_phone,
          shipping_address, items, subtotal, discount, shipping_fee, tax,
          grand_total, currency, payment_status, payment_method,
          razorpay_order_id, razorpay_payment_id, fulfillment_status,
          carrier, tracking_number, dispatch_date, customer_notes,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ord.order_number,
          ord.customer_name,
          ord.customer_email,
          ord.customer_phone,
          ord.shipping_address,
          ord.items,
          ord.subtotal,
          ord.discount,
          ord.shipping_fee,
          0,
          ord.grand_total,
          'INR',
          ord.payment_status,
          ord.payment_method,
          ord.razorpay_order_id,
          ord.razorpay_payment_id,
          ord.fulfillment_status,
          ord.carrier || null,
          ord.tracking_number || null,
          ord.dispatch_date || null,
          ord.customer_notes || null,
          Date.now() - 172800000,
          Date.now()
        ]
      });

      // Seed customers from orders
      await db.execute({
        sql: `INSERT OR REPLACE INTO customers (id, email, name, phone, address, total_orders, total_spent, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)`,
        args: [
          `cust_${Math.random().toString(36).substring(2, 7)}`,
          ord.customer_email,
          ord.customer_name,
          ord.customer_phone,
          ord.shipping_address,
          ord.grand_total,
          Date.now() - 172800000,
          Date.now()
        ]
      });
    }
  }

  // --- SEED INITIAL PROMOTIONS ---
  const existingPromos = await db.execute('SELECT COUNT(*) as count FROM promotions');
  if (Number(existingPromos.rows[0]?.count || 0) === 0) {
    await db.execute({
      sql: `INSERT INTO promotions (id, code, discount_type, discount_value, min_order_value, max_uses, current_uses, start_date, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      args: ['promo_1', 'BADDIES10', 'percentage', 10, 1500, 500, 12, Date.now() - 864000000, Date.now()]
    });
    await db.execute({
      sql: `INSERT INTO promotions (id, code, discount_type, discount_value, min_order_value, max_uses, current_uses, start_date, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      args: ['promo_2', 'ATELIER500', 'fixed', 500, 4000, 100, 5, Date.now() - 864000000, Date.now()]
    });
  }

  // --- SEED INITIAL GROUP BUYS ---
  const existingSquads = await db.execute('SELECT COUNT(*) as count FROM group_buys');
  if (Number(existingSquads.rows[0]?.count || 0) === 0) {
    await db.execute({
      sql: `INSERT INTO group_buys (id, squad_code, title, discount_percent, min_members, current_members, status, created_at, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
      args: [
        'sq_1',
        'AVZ-SQUAD-CYBER',
        'Cyberpunk Armor Collective Drop',
        15,
        3,
        2,
        Date.now(),
        Date.now() + 86400000 * 5
      ]
    });
  }
}
