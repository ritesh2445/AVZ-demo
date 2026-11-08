import { createClient as createWebClient } from '@libsql/client/web';
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

function loadCreateClient(url?: string): any {
  if (
    url &&
    (url.startsWith('libsql:') ||
      url.startsWith('https:') ||
      url.startsWith('http:') ||
      url.startsWith('wss:') ||
      url.startsWith('ws:'))
  ) {
    return createWebClient;
  }
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
    { key: 'announcement_bar', value: JSON.stringify({ active: true, message: 'AVZ HANDMADE WEARABLE ART STUDIO' }) },
  ]);

  // Pre-seed products with full schema support
  const productRows = PRODUCTS.map((p, idx) => {
    const sku = p.sku || `AVZ-${p.id}`;
    const stock = typeof p.stock === 'number' ? p.stock : 1;
    const sizes = Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['One Size'];
    return {
      id: p.id,
      slug: (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: p.name,
      name: p.name,
      description: p.description || p.story || '',
      story: p.description || p.story || '',
      price: p.price || 0,
      price_inr: p.price || 0,
      price_usd: Math.round((p.price || 0) / 85),
      compare_at_price: p.compare_at_price || null,
      sku: sku,
      inventory_quantity: stock,
      stock: stock,
      category: p.category || 'Wearable Art',
      materials: JSON.stringify(p.materials || []),
      images: JSON.stringify(p.images && p.images.length > 0 ? p.images : [p.image || '/assets/editorial_hero_portrait.jpg']),
      variants: JSON.stringify(
        sizes.map(s => ({
          size: s,
          stock: stock > 1 ? Math.ceil(stock / sizes.length) : stock,
          sku: `${sku}-${s.replace(/[^a-zA-Z0-9]/g, '')}`
        }))
      ),
      sizes: JSON.stringify(sizes),
      status: 'published',
      is_featured: p.featured ? 1 : 0,
      custom_made: p.customMade ? 1 : 0,
      tag: p.tag || (stock === 1 ? 'ONE OF ONE' : 'SMALL RUN'),
      created_at: Date.now() - (idx * 86400000),
      updated_at: Date.now()
    };
  });
  store.set('products', productRows);
  // Pre-seed gallery_artworks
  store.set('gallery_artworks', [
    {
      id: 'art-001',
      title: 'Portrait of the Cyber Empress in Gilded Armor',
      artist: 'Dhrisni & The AVZ Atelier',
      image_url: '/assets/editorial_hero_portrait.jpg',
      thumbnail_url: '/assets/editorial_hero_portrait.jpg',
      description: 'An archival masterwork featuring reclaimed computer motherboard breastplates, hand-beaded glass crystals, and heavy-gauge industrial brass wire over hand-tailored velvet.',
      year: '2023',
      category: 'Sculptural Breastplate',
      frame_style: 'ornate_baroque',
      aspect_ratio: '3:4',
      width_px: 380,
      height_px: 510,
      display_order: 1,
      is_published: 1,
      metadata: JSON.stringify({
        medium: 'Salvaged microcircuits, patinated brass, hand-beaded crystal on tailored velvet',
        dimensions_cm: '78 × 104 cm',
        provenance: 'Guwahati Permanent Salon Collection',
        hanging_bracket: 'brass_chains',
        wall_position: 'center',
        sconce_light: true
      }),
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'art-002',
      title: 'Study in Raw Chrome Spikes & Distressed Denim',
      artist: 'Dhrisni',
      image_url: '/assets/look_spike_bodice.jpg',
      thumbnail_url: '/assets/look_spike_bodice.jpg',
      description: 'Sixty-four solid steel lathe-turned spikes hand-riveted onto reconstructed vintage Japanese denim, framed within an antique Italian rococo profile.',
      year: '2023',
      category: 'Armored Bodice',
      frame_style: 'gilded_rococo',
      aspect_ratio: '4:5',
      width_px: 330,
      height_px: 412,
      display_order: 2,
      is_published: 1,
      metadata: JSON.stringify({
        medium: 'Steel spikes, upcycled 14oz indigo denim, polished brass grommets',
        dimensions_cm: '65 × 82 cm',
        provenance: 'Private Collection, Bangalore (Archival Loan)',
        hanging_bracket: 'wire',
        wall_position: 'upper',
        sconce_light: false
      }),
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'art-003',
      title: 'The Guwahati River Chainmail Nocturne',
      artist: 'AVZ Women Artisan Guild',
      image_url: '/assets/look_chainmail_armor.jpg',
      thumbnail_url: '/assets/look_chainmail_armor.jpg',
      description: 'Over 1,200 hand-threaded stainless steel rings woven by indigenous craftswomen in Guwahati over 45 uninterrupted atelier hours.',
      year: '2024',
      category: 'Fluid Chainmail',
      frame_style: 'florentine_gold',
      aspect_ratio: '3:4',
      width_px: 420,
      height_px: 560,
      display_order: 3,
      is_published: 1,
      metadata: JSON.stringify({
        medium: 'Hand-linked 316L surgical stainless steel rings, industrial carabiners',
        dimensions_cm: '90 × 120 cm',
        provenance: 'Permanent Exhibition Pavilion',
        hanging_bracket: 'brass_chains',
        wall_position: 'center',
        sconce_light: true
      }),
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'art-004',
      title: 'Allegory of the Reworked Denim Relic',
      artist: 'Dhrisni',
      image_url: '/assets/product_reworked_jacket.jpg',
      thumbnail_url: '/assets/product_reworked_jacket.jpg',
      description: 'Eighteen deconstructed panels from an oversized vintage trucker jacket, rebuilt with tensile steel cable lacing and distressed distressing.',
      year: '2024',
      category: 'Tailored Relic',
      frame_style: 'antique_fillet',
      aspect_ratio: '1:1',
      width_px: 340,
      height_px: 340,
      display_order: 4,
      is_published: 1,
      metadata: JSON.stringify({
        medium: 'Upcycled vintage denim, silver eyelets, aircraft tension cables',
        dimensions_cm: '70 × 70 cm',
        provenance: 'Private Collection, Mumbai',
        hanging_bracket: 'hidden',
        wall_position: 'lower',
        sconce_light: false
      }),
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'art-005',
      title: 'Still Life with Telecom Motherboard & Copper Relics',
      artist: 'Dhrisni & The AVZ Atelier',
      image_url: '/assets/prod_motherboard_cuff.jpg',
      thumbnail_url: '/assets/prod_motherboard_cuff.jpg',
      description: 'Exposed golden solder joints, copper circuit paths, and salvaged telecommunication capacitors sculpted into an ergonomic wrist relic.',
      year: '2024',
      category: 'Wearable Hardware',
      frame_style: 'classical_cavetto',
      aspect_ratio: '4:3',
      width_px: 380,
      height_px: 285,
      display_order: 5,
      is_published: 1,
      metadata: JSON.stringify({
        medium: 'Reclaimed telecommunication PCB boards, copper traces, Italian leather backing',
        dimensions_cm: '75 × 56 cm',
        provenance: 'Assam Industrial Heritage Vault',
        hanging_bracket: 'wire',
        wall_position: 'upper',
        sconce_light: true
      }),
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'art-006',
      title: 'The Altar of the Spiked Brassiere',
      artist: 'Dhrisni',
      image_url: '/assets/product_spike_bra.jpg',
      thumbnail_url: '/assets/product_spike_bra.jpg',
      description: 'A radical synthesis of classical Parisian lingerie silhouette with subcultural industrial hardware. Solid steel conical spikes anchored with reinforced rivets.',
      year: '2023',
      category: 'Subcultural Armor',
      frame_style: 'tarnished_brass',
      aspect_ratio: '3:4',
      width_px: 350,
      height_px: 466,
      display_order: 6,
      is_published: 1,
      metadata: JSON.stringify({
        medium: 'Hand-pressed steel cones, black lambskin lining, adjustable nickel hardware',
        dimensions_cm: '68 × 90 cm',
        provenance: 'Atelier Archive No. 008',
        hanging_bracket: 'brass_chains',
        wall_position: 'center',
        sconce_light: false
      }),
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'art-007',
      title: 'Composition with Hand-Strung Beadwork & Metal Shards',
      artist: 'Dhrisni & Guwahati Guild',
      image_url: '/assets/product_beaded_bralette.jpg',
      thumbnail_url: '/assets/product_beaded_bralette.jpg',
      description: 'Intricate micro-beadwork suspended between faceted hematite stones and polished scrap metal offcuts, creating fluid shimmering weight.',
      year: '2024',
      category: 'Haute Bijouterie',
      frame_style: 'ornate_baroque',
      aspect_ratio: '4:5',
      width_px: 320,
      height_px: 400,
      display_order: 7,
      is_published: 1,
      metadata: JSON.stringify({
        medium: 'Hematite micro-beads, silver alloy offcuts, silk threading',
        dimensions_cm: '60 × 75 cm',
        provenance: 'Permanent Archive Showcase',
        hanging_bracket: 'wire',
        wall_position: 'lower',
        sconce_light: true
      }),
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'art-008',
      title: 'The Cybernetic Diva in Full Regalia',
      artist: 'Dhrisni',
      image_url: '/assets/product_diva_top.jpg',
      thumbnail_url: '/assets/product_diva_top.jpg',
      description: 'Monumental one-of-one silhouette uniting high-contrast cybernetic motifs with traditional couture boning and hand-finished edges.',
      year: '2024',
      category: 'Monumental Couture',
      frame_style: 'gilded_rococo',
      aspect_ratio: '3:4',
      width_px: 400,
      height_px: 533,
      display_order: 8,
      is_published: 1,
      metadata: JSON.stringify({
        medium: 'Boned silk corset, reclaimed alloy embellishments, raw steel closures',
        dimensions_cm: '85 × 114 cm',
        provenance: 'Guwahati Master Collection',
        hanging_bracket: 'brass_chains',
        wall_position: 'center',
        sconce_light: true
      }),
      created_at: Date.now(),
      updated_at: Date.now()
    }
  ]);


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
  if (dbInstance) return dbInstance;

  const isProduction = process.env.NODE_ENV === 'production';
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const createClient = loadCreateClient(url);

  if (isProduction) {
    if (!url) {
      throw new Error(
        'Database configuration missing: set TURSO_DATABASE_URL in production.'
      );
    }

    if (url.startsWith('file:')) {
      throw new Error(
        'Local SQLite is not supported as the production database. Configure remote Turso.'
      );
    }

    if (!authToken) {
      throw new Error(
        'Database configuration missing: set TURSO_AUTH_TOKEN in production.'
      );
    }

    if (!createClient) {
      throw new Error(
        '@libsql/client is unavailable. Production database initialization cannot continue.'
      );
    }

    try {
      dbInstance = createClient({ url, authToken });
      return dbInstance;
    } catch (err) {
      throw new Error(
        'Failed to initialize the production Turso database client.',
        { cause: err }
      );
    }
  }

  if (createClient) {
    try {
      dbInstance = createClient({
        url: url || 'file:avz_commerce.db',
        authToken: authToken || undefined,
      });
      return dbInstance;
    } catch (err) {
      console.warn(
        'Database client initialization failed in development:',
        err
      );
    }
  }

  console.warn(
    'Using the in-memory fallback database in development. Writes will not persist.'
  );
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
 * Concurrently shares a single in-flight promise and caches completion per process/isolate.
 * If initialization fails, the cache is reset to allow a controlled retry on subsequent requests.
 *
 * For distributed Cloudflare Worker isolates:
 * A fast-path query checks if the schema is already provisioned, avoiding redundant DDL/ALTER execution
 * on cold starts. Explicit full migrations can also be run out-of-band via `npm run db:bootstrap`.
 */
export function initializeDatabase(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = ensureDatabaseInitialized().catch((err) => {
    // Reset cache on failure so next request can retry cleanly
    initPromise = null;
    throw err;
  });

  return initPromise;
}

async function ensureDatabaseInitialized(): Promise<void> {
  const db = getDb();
  try {
    // Fast-path: Check if schema is already provisioned to avoid hitting Cloudflare's subrequest limit
    await db.execute('SELECT 1 FROM storefront_settings, testimonials, user, gallery_artworks LIMIT 1');
    return;
  } catch {
    await performDatabaseInitialization();
  }
}

export async function ensureGroupCartsTable(db?: Client): Promise<void> {
  const targetDb = db || getDb();
  await targetDb.execute(`
    CREATE TABLE IF NOT EXISTS group_carts (
      id TEXT PRIMARY KEY,
      share_code TEXT UNIQUE NOT NULL,
      creator_name TEXT NOT NULL,
      creator_email TEXT NOT NULL,
      creator_user_id TEXT,
      members_data TEXT NOT NULL,
      order_id TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
}

export async function bootstrapDatabaseSchema(): Promise<void> {
  await performDatabaseInitialization();
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
      animation_theme TEXT DEFAULT 'sparkles',
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

  // 10.1 Collaborative Group Order Carts
  await db.execute(`
    CREATE TABLE IF NOT EXISTS group_carts (
      id TEXT PRIMARY KEY,
      share_code TEXT UNIQUE NOT NULL,
      creator_name TEXT NOT NULL,
      creator_email TEXT NOT NULL,
      creator_user_id TEXT,
      members_data TEXT NOT NULL DEFAULT '[]',
      order_id TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
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

  // 18. Gallery Wall Artworks (Classical European Art Museum Salon)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS gallery_artworks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      image_url TEXT NOT NULL,
      thumbnail_url TEXT,
      description TEXT,
      year TEXT,
      category TEXT DEFAULT 'Archival Haute Couture',
      frame_style TEXT NOT NULL DEFAULT 'ornate_baroque',
      aspect_ratio TEXT NOT NULL DEFAULT '3:4',
      width_px INTEGER DEFAULT 360,
      height_px INTEGER DEFAULT 480,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1,
      metadata TEXT DEFAULT '{}',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery_artworks(display_order);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_gallery_is_published ON gallery_artworks(is_published);`);


    // 19. Testimonials & Customer Reviews
  await db.execute(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT NOT NULL,
      user_email TEXT,
      user_avatar TEXT,
      role_title TEXT,
      rating INTEGER DEFAULT 5,
      content TEXT NOT NULL,
      product_name TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      created_at INTEGER NOT NULL
    );
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);`);

  // 18. Better Auth Tables (User Accounts, Sessions, OAuth Accounts, Verifications, Rate Limiting)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      emailVerified INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      expiresAt INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      ipAddress TEXT,
      userAgent TEXT,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY,
      accountId TEXT NOT NULL,
      providerId TEXT NOT NULL,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      accessToken TEXT,
      refreshToken TEXT,
      idToken TEXT,
      accessTokenExpiresAt INTEGER,
      refreshTokenExpiresAt INTEGER,
      scope TEXT,
      password TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS rateLimit (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      count INTEGER NOT NULL,
      lastRequest INTEGER NOT NULL
    );
  `);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_user_email ON user(email);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_session_userId ON session(userId);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_account_userId ON account(userId);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_account_provider ON account(providerId, accountId);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_rateLimit_key ON rateLimit(key);`);

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
  try {
    await db.execute(`ALTER TABLE promotions ADD COLUMN animation_theme TEXT DEFAULT 'sparkles';`);
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
    { email: 'aveezahstore@gmail.com', name: 'AVZ Studio Admin', role: 'owner' },
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
        title: 'STORE UPDATE IN PROGRESS',
        message: 'The AVZ Vaganza store is momentarily undergoing routine updates. We will be back shortly.',
        banner_url: '/assets/editorial_hero_portrait.jpg'
      })
    },
    {
      key: 'announcement',
      value: JSON.stringify({
        enabled: false,
        text: 'ðŸª COMPLIMENTARY DOMESTIC DISPATCH ON ORDERS OVER â‚¹5,000 | LIMITED STUDIO DROPS',
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
        disabled_message: 'Purchases are momentarily paused while founder Dhrisni finalizes new creations. You may still explore the catalogue.'
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
        secondary_cta_text: 'CUSTOM ORDERS',
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
        subheadline: 'A gallery of custom designs and past signature creations.',
        description: 'These sold-out pieces can be custom-recreated for you. Because each piece is hand-sculpted with upcycled hardware, no piece is ever an exact replica.',
        pricing_tiers: BRAND_INFO.pricingTiers,
        turnaround: BRAND_INFO.customTimeline
      })
    },
    {
      section_key: 'custom_orders',
      title: 'Custom Order Studio',
      data: JSON.stringify({
        headline: 'CUSTOM ORDERS',
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
        copyright: 'Â© 2026 AVZ VAGANZA. ALL RIGHTS RESERVED.',
        instagram_url: BRAND_INFO.instagramUrl,
        whatsapp_url: BRAND_INFO.whatsappLinkPrimary,
        business_email: BRAND_INFO.businessEmail,
        packaging_note: BRAND_INFO.packaging.headline
      })
    },
    {
      section_key: 'reels',
      title: 'Autoplaying Video Reels',
      data: JSON.stringify({
        headline: 'IN MOTION // RUNWAY & REELS',
        subheadline: 'Watch each piece move in real life. Behind-the-scenes, runway motion, and handmade detailing.',
        reels: [
          {
            id: 'reel-01',
            title: 'Chainmail Top & Leg Warmers',
            subtitle: 'Fluid handcrafted stainless steel chainmail in motion',
            vimeo_url: 'https://vimeo.com/1243097495/3c90e1325e',
            fallback_video: 'https://player.vimeo.com/video/1243097495?h=3c90e1325e&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0',
            poster: '/assets/look_chainmail_armor.jpg',
            tag: 'RUNWAY'
          },
          {
            id: 'reel-02',
            title: 'Sculptural Metal Bodice',
            subtitle: 'Heavy hardware and contoured metal plates',
            vimeo_url: 'https://vimeo.com/1243095627/80fef24f4b',
            fallback_video: 'https://player.vimeo.com/video/1243095627?h=80fef24f4b&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0',
            poster: '/assets/look_spike_bodice.jpg',
            tag: 'STUDIO'
          },
          {
            id: 'reel-03',
            title: 'Cybernetic Armor Runway',
            subtitle: 'Intricate circuit tracing and tactile hardware detail',
            vimeo_url: 'https://vimeo.com/1243095629/47f3f9c6c6',
            fallback_video: 'https://player.vimeo.com/video/1243095629?h=47f3f9c6c6&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0',
            poster: '/assets/product_diva_top.jpg',
            tag: 'ATELIER'
          },
          {
            id: 'reel-04',
            title: 'Avant-Garde Studio Fitting',
            subtitle: 'Experimental silhouettes sculpted to the body',
            vimeo_url: 'https://vimeo.com/1243095630/e6e88578e0',
            fallback_video: 'https://player.vimeo.com/video/1243095630?h=e6e88578e0&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0',
            poster: '/assets/product_reworked_jacket.jpg',
            tag: 'FITTING'
          },
          {
            id: 'reel-05',
            title: 'Wearable Art Showcase',
            subtitle: '1-of-1 handmade creations from our Guwahati studio',
            vimeo_url: 'https://vimeo.com/1243095628/95ae4f7ecd',
            fallback_video: 'https://player.vimeo.com/video/1243095628?h=95ae4f7ecd&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0',
            poster: '/assets/editorial_hero_portrait.jpg',
            tag: '1-OF-1 ARCHIVE'
          }
        ]
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

  // --- SEED OR SYNC PRODUCTS FROM BRANDDATA ---
  if (Array.isArray(PRODUCTS) && PRODUCTS.length > 0) {
    for (const p of PRODUCTS) {
      const sku = p.sku || `AVZ-${p.id}`;
      const existing = await db.execute({
        sql: 'SELECT id FROM products WHERE sku = ?',
        args: [sku]
      });

      if (existing.rows.length === 0) {
        const id = `prod_${p.id || Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
        const slug = (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const price = typeof p.price === 'number' ? p.price : 2500;
        const comparePrice = p.compare_at_price || null;
        const stock = typeof p.stock === 'number' ? p.stock : 1;
        const sizes = Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['One Size'];
        const images = JSON.stringify(p.images && p.images.length > 0 ? p.images : [p.image || '/assets/editorial_hero_portrait.jpg']);
        const materials = JSON.stringify(p.materials || ['Upcycled Hardware', 'Reclaimed Materials']);
        const variants = JSON.stringify(
          sizes.map(s => ({
            size: s,
            stock: stock > 1 ? Math.ceil(stock / sizes.length) : stock,
            sku: `${sku}-${s.replace(/[^a-zA-Z0-9]/g, '')}`
          }))
        );
        const status = 'published';

        await db.execute({
          sql: `INSERT INTO products (
            id, slug, title, description, price, compare_at_price, sku,
            inventory_quantity, category, materials, images, variants,
            status, is_featured, custom_made, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            id,
            slug,
            p.name || 'Custom Studio Piece',
            p.description || 'Handcrafted 1-of-1 wearable art by Dhrisni.',
            price,
            comparePrice,
            sku,
            stock,
            p.category || 'Wearable Art',
            materials,
            images,
            variants,
            status,
            p.featured ? 1 : 0,
            p.customMade ? 1 : 0,
            Date.now(),
            Date.now()
          ]
        });
      }
    }
  }

  // Orders and customers are strictly populated by real customer transactions (zero mock seed data)

  // --- SEED INITIAL PROMOTIONS ---
  const existingPromos = await db.execute('SELECT COUNT(*) as count FROM promotions');
  if (Number(existingPromos.rows[0]?.count || 0) === 0) {
    await db.execute({
      sql: `INSERT INTO promotions (id, code, discount_type, discount_value, min_order_value, max_uses, current_uses, start_date, is_active, animation_theme, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      args: ['promo_1', 'BADDIES10', 'percentage', 10, 1500, 500, 12, Date.now() - 864000000, 'cyberpunk', Date.now()]
    });
    await db.execute({
      sql: `INSERT INTO promotions (id, code, discount_type, discount_value, min_order_value, max_uses, current_uses, start_date, is_active, animation_theme, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      args: ['promo_2', 'ATELIER500', 'fixed', 500, 4000, 100, 5, Date.now() - 864000000, 'luxury_gold', Date.now()]
    });
    await db.execute({
      sql: `INSERT INTO promotions (id, code, discount_type, discount_value, min_order_value, max_uses, current_uses, start_date, is_active, animation_theme, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      args: ['promo_3', 'DIWALI20', 'percentage', 20, 2500, 500, 0, Date.now() - 864000000, 'diwali', Date.now()]
    });
    await db.execute({
      sql: `INSERT INTO promotions (id, code, discount_type, discount_value, min_order_value, max_uses, current_uses, start_date, is_active, animation_theme, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      args: ['promo_4', 'HOLISPLASH', 'percentage', 15, 2000, 500, 0, Date.now() - 864000000, 'holi', Date.now()]
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

  // --- SEED INITIAL GALLERY ARTWORKS ---
  const existingArtworks = await db.execute('SELECT COUNT(*) as count FROM gallery_artworks');
  const artworkCount = Number(existingArtworks.rows[0]?.count || 0);

  if (artworkCount === 0) {
    const initialArtworks = [
      {
        id: 'art-001',
        title: 'Portrait of the Cyber Empress in Gilded Armor',
        artist: 'Dhrisni & The AVZ Atelier',
        image_url: '/assets/editorial_hero_portrait.jpg',
        thumbnail_url: '/assets/editorial_hero_portrait.jpg',
        description: 'An archival masterwork featuring reclaimed computer motherboard breastplates, hand-beaded glass crystals, and heavy-gauge industrial brass wire over hand-tailored velvet.',
        year: '2023',
        category: 'Sculptural Breastplate',
        frame_style: 'ornate_baroque',
        aspect_ratio: '3:4',
        width_px: 380,
        height_px: 510,
        display_order: 1,
        is_published: 1,
        metadata: JSON.stringify({
          medium: 'Salvaged microcircuits, patinated brass, hand-beaded crystal on tailored velvet',
          dimensions_cm: '78 × 104 cm',
          provenance: 'Guwahati Permanent Salon Collection',
          hanging_bracket: 'brass_chains',
          wall_position: 'center',
          sconce_light: true
        })
      },
      {
        id: 'art-002',
        title: 'Study in Raw Chrome Spikes & Distressed Denim',
        artist: 'Dhrisni',
        image_url: '/assets/look_spike_bodice.jpg',
        thumbnail_url: '/assets/look_spike_bodice.jpg',
        description: 'Sixty-four solid steel lathe-turned spikes hand-riveted onto reconstructed vintage Japanese denim, framed within an antique Italian rococo profile.',
        year: '2023',
        category: 'Armored Bodice',
        frame_style: 'gilded_rococo',
        aspect_ratio: '4:5',
        width_px: 330,
        height_px: 412,
        display_order: 2,
        is_published: 1,
        metadata: JSON.stringify({
          medium: 'Steel spikes, upcycled 14oz indigo denim, polished brass grommets',
          dimensions_cm: '65 × 82 cm',
          provenance: 'Private Collection, Bangalore (Archival Loan)',
          hanging_bracket: 'wire',
          wall_position: 'upper',
          sconce_light: false
        })
      },
      {
        id: 'art-003',
        title: 'The Guwahati River Chainmail Nocturne',
        artist: 'AVZ Women Artisan Guild',
        image_url: '/assets/look_chainmail_armor.jpg',
        thumbnail_url: '/assets/look_chainmail_armor.jpg',
        description: 'Over 1,200 hand-threaded stainless steel rings woven by indigenous craftswomen in Guwahati over 45 uninterrupted atelier hours.',
        year: '2024',
        category: 'Fluid Chainmail',
        frame_style: 'florentine_gold',
        aspect_ratio: '3:4',
        width_px: 420,
        height_px: 560,
        display_order: 3,
        is_published: 1,
        metadata: JSON.stringify({
          medium: 'Hand-linked 316L surgical stainless steel rings, industrial carabiners',
          dimensions_cm: '90 × 120 cm',
          provenance: 'Permanent Exhibition Pavilion',
          hanging_bracket: 'brass_chains',
          wall_position: 'center',
          sconce_light: true
        })
      },
      {
        id: 'art-004',
        title: 'Allegory of the Reworked Denim Relic',
        artist: 'Dhrisni',
        image_url: '/assets/product_reworked_jacket.jpg',
        thumbnail_url: '/assets/product_reworked_jacket.jpg',
        description: 'Eighteen deconstructed panels from an oversized vintage trucker jacket, rebuilt with tensile steel cable lacing and distressed distressing.',
        year: '2024',
        category: 'Tailored Relic',
        frame_style: 'antique_fillet',
        aspect_ratio: '1:1',
        width_px: 340,
        height_px: 340,
        display_order: 4,
        is_published: 1,
        metadata: JSON.stringify({
          medium: 'Upcycled vintage denim, silver eyelets, aircraft tension cables',
          dimensions_cm: '70 × 70 cm',
          provenance: 'Private Collection, Mumbai',
          hanging_bracket: 'hidden',
          wall_position: 'lower',
          sconce_light: false
        })
      },
      {
        id: 'art-005',
        title: 'Still Life with Telecom Motherboard & Copper Relics',
        artist: 'Dhrisni & The AVZ Atelier',
        image_url: '/assets/prod_motherboard_cuff.jpg',
        thumbnail_url: '/assets/prod_motherboard_cuff.jpg',
        description: 'Exposed golden solder joints, copper circuit paths, and salvaged telecommunication capacitors sculpted into an ergonomic wrist relic.',
        year: '2024',
        category: 'Wearable Hardware',
        frame_style: 'classical_cavetto',
        aspect_ratio: '4:3',
        width_px: 380,
        height_px: 285,
        display_order: 5,
        is_published: 1,
        metadata: JSON.stringify({
          medium: 'Reclaimed telecommunication PCB boards, copper traces, Italian leather backing',
          dimensions_cm: '75 × 56 cm',
          provenance: 'Assam Industrial Heritage Vault',
          hanging_bracket: 'wire',
          wall_position: 'upper',
          sconce_light: true
        })
      },
      {
        id: 'art-006',
        title: 'The Altar of the Spiked Brassiere',
        artist: 'Dhrisni',
        image_url: '/assets/product_spike_bra.jpg',
        thumbnail_url: '/assets/product_spike_bra.jpg',
        description: 'A radical synthesis of classical Parisian lingerie silhouette with subcultural industrial hardware. Solid steel conical spikes anchored with reinforced rivets.',
        year: '2023',
        category: 'Subcultural Armor',
        frame_style: 'tarnished_brass',
        aspect_ratio: '3:4',
        width_px: 350,
        height_px: 466,
        display_order: 6,
        is_published: 1,
        metadata: JSON.stringify({
          medium: 'Hand-pressed steel cones, black lambskin lining, adjustable nickel hardware',
          dimensions_cm: '68 × 90 cm',
          provenance: 'Atelier Archive No. 008',
          hanging_bracket: 'brass_chains',
          wall_position: 'center',
          sconce_light: false
        })
      },
      {
        id: 'art-007',
        title: 'Composition with Hand-Strung Beadwork & Metal Shards',
        artist: 'Dhrisni & Guwahati Guild',
        image_url: '/assets/product_beaded_bralette.jpg',
        thumbnail_url: '/assets/product_beaded_bralette.jpg',
        description: 'Intricate micro-beadwork suspended between faceted hematite stones and polished scrap metal offcuts, creating fluid shimmering weight.',
        year: '2024',
        category: 'Haute Bijouterie',
        frame_style: 'ornate_baroque',
        aspect_ratio: '4:5',
        width_px: 320,
        height_px: 400,
        display_order: 7,
        is_published: 1,
        metadata: JSON.stringify({
          medium: 'Hematite micro-beads, silver alloy offcuts, silk threading',
          dimensions_cm: '60 × 75 cm',
          provenance: 'Permanent Archive Showcase',
          hanging_bracket: 'wire',
          wall_position: 'lower',
          sconce_light: true
        })
      },
      {
        id: 'art-008',
        title: 'The Cybernetic Diva in Full Regalia',
        artist: 'Dhrisni',
        image_url: '/assets/product_diva_top.jpg',
        thumbnail_url: '/assets/product_diva_top.jpg',
        description: 'Monumental one-of-one silhouette uniting high-contrast cybernetic motifs with traditional couture boning and hand-finished edges.',
        year: '2024',
        category: 'Monumental Couture',
        frame_style: 'gilded_rococo',
        aspect_ratio: '3:4',
        width_px: 400,
        height_px: 533,
        display_order: 8,
        is_published: 1,
        metadata: JSON.stringify({
          medium: 'Boned silk corset, reclaimed alloy embellishments, raw steel closures',
          dimensions_cm: '85 × 114 cm',
          provenance: 'Guwahati Master Collection',
          hanging_bracket: 'brass_chains',
          wall_position: 'center',
          sconce_light: true
        })
      }
    ];

    for (const art of initialArtworks) {
      await db.execute({
        sql: `INSERT INTO gallery_artworks (
          id, title, artist, image_url, thumbnail_url, description, year, category,
          frame_style, aspect_ratio, width_px, height_px, display_order, is_published,
          metadata, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          art.id, art.title, art.artist, art.image_url, art.thumbnail_url,
          art.description, art.year, art.category, art.frame_style, art.aspect_ratio,
          art.width_px, art.height_px, art.display_order, art.is_published,
          art.metadata, Date.now(), Date.now()
        ]
      });
    }
  }

}
