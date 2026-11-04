'use strict';
const fs = require('fs');
const path = require('path');

// Extract RAW_INVENTORY and helper functions
const seedFilePath = path.join(__dirname, 'seed-inventory.cjs');
const seedFileContent = fs.readFileSync(seedFilePath, 'utf8');

// We can extract RAW_INVENTORY by evaluating it in VM or extracting the array
const vm = require('vm');
const sandbox = { module: {}, exports: {}, require, console };
vm.createContext(sandbox);

// Instead of running full file, extract RAW_INVENTORY and helpers
const extractMatch = seedFileContent.match(/const RAW_INVENTORY = (\[[\s\S]*?\n\];)/);
if (!extractMatch) {
  throw new Error('Could not find RAW_INVENTORY in seed-inventory.cjs');
}

const RAW_INVENTORY = eval(`(${extractMatch[1].replace(/;\s*$/, '')})`);

const imgMapMatch = seedFileContent.match(/const IMAGE_MAP = (\{[\s\S]*?\n\};)/);
const IMAGE_MAP = eval(`(${imgMapMatch[1].replace(/;\s*$/, '')})`);

const catAltMatch = seedFileContent.match(/const CATEGORY_ALT_IMAGE = (\{[\s\S]*?\n\};)/);
const CATEGORY_ALT_IMAGE = eval(`(${catAltMatch[1].replace(/;\s*$/, '')})`);

function getImages(item) {
  const primary = IMAGE_MAP[item.imageKey] || '/assets/product_spike_bra.jpg';
  const alt = CATEGORY_ALT_IMAGE[item.category] || '/assets/product_diva_top.jpg';
  const editorial = '/assets/editorial_hero_portrait.jpg';
  const imgs = [primary];
  if (alt !== primary) imgs.push(alt);
  if (imgs.length < 3) imgs.push(editorial);
  return imgs;
}

async function main() {
  const baseUrl = 'https://aveezahvaganza.com';
  const email = 'avz.vaganza@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'AvzAtelier#2026!MasterKey';

  console.log(`\n🚀 Connecting to ${baseUrl}...`);

  // 1. Log in
  const loginRes = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!loginRes.ok) {
    const txt = await loginRes.text();
    throw new Error(`Admin login failed: ${loginRes.status} ${txt}`);
  }

  const cookieHeader = loginRes.headers.get('set-cookie');
  const sessionCookie = cookieHeader ? cookieHeader.split(';')[0] : '';
  console.log('✅ Admin authenticated successfully.');

  const headers = {
    'Content-Type': 'application/json',
    'Cookie': sessionCookie
  };

  // 2. Fetch existing products
  const listRes = await fetch(`${baseUrl}/api/admin/products`, { headers });
  const listData = await listRes.json();
  const existingProducts = listData.products || [];
  console.log(`Found ${existingProducts.length} existing products in database.`);

  // 3. Delete old dummy products (e.g. SKUs like AVZ-AVZ-* or not in RAW_INVENTORY)
  const validSkus = new Set(RAW_INVENTORY.map(item => item.id));

  for (const prod of existingProducts) {
    if (!validSkus.has(prod.sku)) {
      console.log(`🗑️ Deleting old dummy product: ${prod.id} (${prod.sku} - ${prod.title})`);
      const delRes = await fetch(`${baseUrl}/api/admin/products/${prod.id}`, {
        method: 'DELETE',
        headers
      });
      const delData = await delRes.json();
      console.log(`   Result:`, delData);
    }
  }

  // 4. Seed all 24 items
  console.log(`\n📦 Seeding ${RAW_INVENTORY.length} authentic inventory products...`);
  let seeded = 0;
  let updated = 0;
  let errors = 0;

  for (const item of RAW_INVENTORY) {
    const imgs = getImages(item);
    const payload = {
      title: item.name,
      description: item.description,
      price: item.price,
      compare_at_price: null,
      sku: item.id,
      inventory_quantity: item.stock,
      category: item.category,
      materials: item.materials,
      images: imgs,
      variants: item.sizes.map(s => ({
        size: s,
        stock: item.stock > 1 ? Math.ceil(item.stock / item.sizes.length) : item.stock
      })),
      status: 'published',
      is_featured: item.featured,
      custom_made: false,
    };

    const postRes = await fetch(`${baseUrl}/api/admin/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (postRes.status === 409) {
      console.log(`  ℹ️ ${item.id} already exists`);
      seeded++;
    } else if (!postRes.ok) {
      const errTxt = await postRes.text();
      console.error(`  ❌ Failed to seed ${item.id}: ${postRes.status} ${errTxt}`);
      errors++;
    } else {
      const data = await postRes.json();
      console.log(`  ✅ Seeded ${item.id} (${item.name}) - ID: ${data.id}`);
      seeded++;
    }
  }

  // 5. Verify final storefront and admin product count
  console.log('\n🔍 Verifying storefront API...');
  const storeRes = await fetch(`${baseUrl}/api/storefront/products`);
  const storeData = await storeRes.json();
  console.log(`Storefront now has ${storeData.products?.length} products!`);

  console.log(`\n🎉 Summary:`);
  console.log(`  Seeded/Verified: ${seeded}`);
  console.log(`  Errors: ${errors}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
