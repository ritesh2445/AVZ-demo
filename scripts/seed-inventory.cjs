/**
 * seed-inventory.cjs
 * Populates the AVZ Vaganza DB with real inventory from Book(Inventory list).csv
 * and updates src/data/brandData.js PRODUCTS array.
 *
 * Usage: node scripts/seed-inventory.cjs [--api http://localhost:3000]
 * Defaults to direct SQLite insert via better-sqlite3 (or falls back to API).
 */

'use strict';

const https = require('https');
const http = require('http');
const { randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');

// ─── Real inventory from Book(Inventory list).csv ─────────────────────────────
// Columns: ID, Name, Description, Price (Rs), Stock, Category (inferred)
const RAW_INVENTORY = [
  { id: 'IN0001', name: 'Spikeria Bra', description: 'Bra with spikes studded — a bold statement piece featuring individually hand-set metallic cone spikes on a form-fitted bra base. Cold-forged rebellion in wearable form.', price: 1999, stock: 50, category: 'Bralettes', materials: ['Metal Spikes & Chains', 'Upcycled Hardware'], sizes: ['S (Bust 32-34in)', 'M (Bust 34-36in)', 'L (Bust 36-38in)'], featured: true, imageKey: 'product_spike_bra' },
  { id: 'IN0002', name: 'Keyboard Bra', description: 'Bra with keyboard keys studded across the cups — mechanical keyboard keycaps hand-mounted on a structured bra base. Where tech trash meets torso art.', price: 2500, stock: 100, category: 'Bralettes', materials: ['Keycaps & Tech Scrap', 'Upcycled Hardware'], sizes: ['S (Bust 32-34in)', 'M (Bust 34-36in)', 'L (Bust 36-38in)'], featured: true, imageKey: 'product_beaded_bralette' },
  { id: 'IN0003', name: 'Jersey Co-Ord Set', description: 'Jersey upcycled corset & skirt co-ord set — reclaimed jersey fabric reconstructed into a matching corset-bodice and midi skirt. Sustainable maximalism at its finest.', price: 3500, stock: 1, category: 'Co-ord sets', materials: ['Reclaimed Denim', 'Upcycled Hardware'], sizes: ['Size: Small'], featured: true, imageKey: 'product_coord_set' },
  { id: 'IN0004', name: 'Spike Arm Cuffs', description: 'Arm cuffs with spikes — wrist and forearm cuffs loaded with hand-set metallic spikes. The ultimate punk accessory for festival and editorial looks.', price: 600, stock: 30, category: 'Arm cuffs', materials: ['Metal Spikes & Chains', 'Upcycled Hardware'], sizes: ['One Size (Adjustable)'], featured: false, imageKey: 'prod_motherboard_cuff' },
  { id: 'IN0005', name: 'Frills Belt Purple', description: 'Belt with fabrics hanging — a statement belt in deep purple with cascading fabric frills and draped ribbon accents. Structural accessory with fashion-forward attitude.', price: 800, stock: 1, category: 'Belts', materials: ['Upcycled Hardware'], sizes: ['One Size (Adjustable)'], featured: false, imageKey: 'product_archive_bralette' },
  { id: 'IN0006', name: 'Spike Beaded Bralette Chainmail', description: 'Beaded bralette with spikes and punk theme — an intricate fusion of hand-beaded bralette construction, chainmail links, and metallic spike detailing. Statement armor for the fearless.', price: 1800, stock: 5, category: 'Bralettes', materials: ['Chainmail', 'Metal Spikes & Chains', 'Upcycled Hardware'], sizes: ['S (Bust 32-34in)', 'M (Bust 34-36in)'], featured: true, imageKey: 'product_beaded_bralette' },
  { id: 'IN0007', name: 'Psychedelic Brown Denim Bag', description: 'Bag with acid paint denim jeans upcycled — a one-of-a-kind bag reconstructed from acid-washed and hand-painted denim jeans. No two are alike, all are chaotic.', price: 999, stock: 1, category: 'Bags', materials: ['Reclaimed Denim', 'Upcycled Hardware'], sizes: ['One Size'], featured: false, imageKey: 'product_reworked_jacket' },
  { id: 'IN0008', name: 'Spike Tube Top', description: 'Tube top in rexine black with spikes forming a cross pattern — a sleek black rexine-based tube top with individually placed metallic spikes arranged in a dramatic cross motif across the chest.', price: 2000, stock: 3, category: 'Tops', materials: ['Metal Spikes & Chains', 'Upcycled Hardware'], sizes: ['XS-S (Bust 30-33in)', 'M-L (Bust 34-37in)'], featured: true, imageKey: 'product_spike_bra' },
  { id: 'IN0009', name: 'Purple Jibaro Cross Top', description: 'Cross top halter purple with gold and red embellishment — a dramatic halter-neck cross-top in deep purple, lavishly embellished with gold threadwork and blood-red accent gems. Inspired by the Jibaro aesthetic.', price: 1500, stock: 1, category: 'Tops', materials: ['Upcycled Hardware'], sizes: ['Size: Small'], featured: true, imageKey: 'product_diva_top' },
  { id: 'IN0010', name: 'Chainmail Bra', description: 'Bra made out of chain links — a full-coverage bra constructed entirely from hand-linked stainless steel chain rings. Over 800 individual links woven ring-by-ring. Fluid metallic armor.', price: 1800, stock: 50, category: 'Bralettes', materials: ['Chainmail', 'Metal Spikes & Chains'], sizes: ['S (Bust 32-34in)', 'M (Bust 34-36in)', 'L (Bust 36-38in)'], featured: true, imageKey: 'look_chainmail_armor' },
  { id: 'IN0011', name: 'Purple Pink Beaded Bralette', description: 'Bralette / body chain made with pink and purple beads — a hand-strung beaded bralette doubling as a body chain, in a vivid pink and purple palette. Part jewelry, part fashion, entirely unique.', price: 1500, stock: 1, category: 'Bralettes', materials: ['Upcycled Hardware'], sizes: ['One Size (Adjustable Body Chain)'], featured: false, imageKey: 'product_beaded_bralette' },
  { id: 'IN0012', name: 'Apex Cuffs', description: 'Hand cuffs with spikes — a dramatic pair of wrist cuffs adorned with sharp metallic spikes. The Apex Cuffs are statement accessories designed for editorial and performance.', price: 499, stock: 10, category: 'Arm cuffs', materials: ['Metal Spikes & Chains', 'Upcycled Hardware'], sizes: ['One Size (Adjustable)'], featured: false, imageKey: 'prod_motherboard_cuff' },
  { id: 'IN0013', name: 'Denim Upcycled Headgear', description: 'Denim headgear with green plastic bottle flowers and ribbons and laces vaganza — an extraordinary headpiece reconstructed from upcycled denim, embellished with flowers crafted from reclaimed plastic bottles, ribbons, and lace.', price: 1700, stock: 1, category: 'Headgear', materials: ['Reclaimed Denim', 'Upcycled Hardware'], sizes: ['One Size'], featured: false, imageKey: 'product_reworked_jacket' },
  { id: 'IN0014', name: 'Jhumka Jacket', description: 'Jacket fur brown with jhumkhas — a luxuriant brown fur jacket adorned with traditional Indian jhumka (chandelier earring) hardware as decorative closures and embellishments. East meets avant-garde.', price: 2600, stock: 1, category: 'Jackets', materials: ['Upcycled Hardware'], sizes: ['Size: Free Size/Oversized'], featured: true, imageKey: 'product_reworked_jacket' },
  { id: 'IN0015', name: 'Black Cat Co-Ord Set', description: 'Silver corset and black fur skirt — a fierce co-ord set pairing a structured silver-tone corset with a lush black faux-fur mini skirt. Statement dressing for the unafraid.', price: 2200, stock: 1, category: 'Co-ord sets', materials: ['Upcycled Hardware', 'Metal Spikes & Chains'], sizes: ['Size: Small'], featured: true, imageKey: 'product_coord_set' },
  { id: 'IN0016', name: 'Cheetah Print Cavewoman Set', description: 'Cavewoman bra and leopard skirt — a primal power set featuring a hand-constructed cheetah-print bralette and matching leopard-print micro skirt. Unapologetically wild.', price: 1999, stock: 1, category: 'Co-ord sets', materials: ['Upcycled Hardware'], sizes: ['Size: 34 Medium'], featured: false, imageKey: 'product_coord_set' },
  { id: 'IN0017', name: 'Silver Jesus Cross Charm Top', description: 'Cross shape halter top with black butterfly choker and silver elements — a sculptural halter top cut in a cross silhouette, paired with a matching black butterfly choker and draped silver chain elements.', price: 999, stock: 0, category: 'Tops', materials: ['Metal Spikes & Chains', 'Upcycled Hardware'], sizes: ['Size: Small'], featured: false, imageKey: 'product_spike_bra' },
  { id: 'IN0018', name: 'Flowery Crochet Top', description: 'Crocheted top with flowers multi colored — a hand-crocheted crop top blooming with multi-colored floral motifs. Each stitch is a small act of rebellion against the mass-produced and the mundane.', price: 1799, stock: 6, category: 'Tops', materials: ['Upcycled Hardware'], sizes: ['XS-S', 'M-L'], featured: false, imageKey: 'product_archive_bralette' },
  { id: 'IN0019', name: 'Pearlite Crochet Top', description: 'White pearls crocheted on bikini top — a delicate yet bold bikini-style crop top with genuine freshwater pearls hand-crocheted into the construction. Mermaidcore meets punk maximalism.', price: 1500, stock: 12, category: 'Tops', materials: ['Upcycled Hardware'], sizes: ['XS-S (Bust 30-33in)', 'M-L (Bust 34-37in)'], featured: true, imageKey: 'product_beaded_bralette' },
  { id: 'IN0020', name: 'Barbie Set', description: 'Pink starfish bra + Barbie short skirt + green & pink fluffy headgear — the ultimate maximalist set. A pink starfish-studded bra, Barbie-pink micro skirt, and a matching green-and-pink fluffy headpiece. Camp at its finest.', price: 3500, stock: 12, category: 'Co-ord sets', materials: ['Upcycled Hardware'], sizes: ['XS-S', 'M-L'], featured: true, imageKey: 'product_coord_set' },
  { id: 'IN0021', name: 'Spiral Body Chainmail Top', description: 'Spiral wired chained top in silver — an architectural silver-tone body top constructed with spiral-wired chainmail in a sculptural drape over the torso. Structural and otherworldly.', price: 2500, stock: 1, category: 'Body chainmail', materials: ['Chainmail', 'Industrial Wire', 'Metal Spikes & Chains'], sizes: ['One Size (Adjustable)'], featured: true, imageKey: 'look_chainmail_armor' },
  { id: 'IN0022', name: 'Cross Tape Bralette', description: 'Bralette in the illusion of taped bust — a minimal yet striking bralette that creates the visual illusion of a tape-bound look through precise structural fabric work. Available in multiple runs.', price: 1200, stock: 18, category: 'Bralettes', materials: ['Upcycled Hardware'], sizes: ['XS-S', 'S-M', 'M-L'], featured: false, imageKey: 'product_spike_bra' },
  { id: 'IN0023', name: 'Spike Grey Blouse', description: 'Blouse with spikes — a structured grey blouse with metallic spike embellishments arranged in precise formations. Statement ready-to-wear for the maximalist wardrobe.', price: 2000, stock: 1, category: 'Tops', materials: ['Metal Spikes & Chains', 'Upcycled Hardware'], sizes: ['Size: Small-Medium'], featured: false, imageKey: 'product_spike_bra' },
  { id: 'IN0024', name: 'Silver Shoe Corset & Skirt Set', description: 'Corset in silver color made out of shoe and brown fur, with a matching skirt — a truly one-of-a-kind set where shoes are deconstructed and rebuilt into a sculptural silver corset, paired with a brown fur skirt.', price: 3500, stock: 1, category: 'Co-ord sets', materials: ['Upcycled Hardware', 'Reclaimed Denim'], sizes: ['One Size (Custom Fit)'], featured: true, imageKey: 'look_spike_bodice' },
];

// Image map: imageKey → actual asset path
const IMAGE_MAP = {
  product_spike_bra: '/assets/product_spike_bra.jpg',
  product_beaded_bralette: '/assets/product_beaded_bralette.jpg',
  product_reworked_jacket: '/assets/product_reworked_jacket.jpg',
  product_coord_set: '/assets/product_coord_set.jpg',
  product_spike_top: '/assets/product_spike_top.jpg',
  product_archive_bralette: '/assets/product_archive_bralette.jpg',
  product_diva_top: '/assets/product_diva_top.jpg',
  look_chainmail_armor: '/assets/look_chainmail_armor.jpg',
  look_spike_bodice: '/assets/look_spike_bodice.jpg',
  prod_motherboard_cuff: '/assets/prod_motherboard_cuff.jpg',
};

// Category → secondary image fallback for multi-image slots
const CATEGORY_ALT_IMAGE = {
  'Bralettes': '/assets/product_beaded_bralette.jpg',
  'Tops': '/assets/product_spike_top.jpg',
  'Co-ord sets': '/assets/product_coord_set.jpg',
  'Jackets': '/assets/product_reworked_jacket.jpg',
  'Body chainmail': '/assets/look_chainmail_armor.jpg',
  'Arm cuffs': '/assets/prod_motherboard_cuff.jpg',
  'Belts': '/assets/product_archive_bralette.jpg',
  'Bags': '/assets/product_reworked_jacket.jpg',
  'Headgear': '/assets/product_archive_bralette.jpg',
  'Corsets': '/assets/look_spike_bodice.jpg',
};

function getImages(item) {
  const primary = IMAGE_MAP[item.imageKey] || '/assets/product_spike_bra.jpg';
  const alt = CATEGORY_ALT_IMAGE[item.category] || '/assets/product_diva_top.jpg';
  const editorial = '/assets/editorial_hero_portrait.jpg';
  // De-duplicate
  const imgs = [primary];
  if (alt !== primary) imgs.push(alt);
  if (imgs.length < 3) imgs.push(editorial);
  return imgs;
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function uid() {
  return randomBytes(4).toString('hex');
}

// ─── Build PRODUCTS array for brandData.js ────────────────────────────────────
function buildProductsArray() {
  return RAW_INVENTORY.map((item, i) => {
    const imgs = getImages(item);
    const imgsStr = imgs.map(p => `"${p}"`).join(', ');
    const matsStr = item.materials.map(m => `"${m}"`).join(', ');
    const sizesStr = item.sizes.map(s => `"${s.replace(/"/g, '')}"`).join(', ');
    const avzId = `avz-${String(i + 1).padStart(3, '0')}`;
    const tag = item.stock === 0 ? 'SOLD OUT' :
                item.stock === 1 ? 'ONE OF ONE' :
                item.price < 1000 ? 'UNDER ₹1K' :
                item.featured ? 'HAND-BUILT' : 'SMALL RUN';

    return `  {
    id: "${avzId}",
    sku: "${item.id}",
    name: "${item.name}",
    category: "${item.category}",
    price: ${item.price},
    tag: "${tag}",
    stock: ${item.stock},
    materials: [${matsStr}],
    images: [${imgsStr}],
    description: "${item.description.replace(/"/g, '\\"')}",
    details: [
      "Hand-crafted by Dhrisni in the Guwahati studio",
      "Upcycled and reclaimed materials",
      "AVZ Vaganza authenticity label included"
    ],
    care: "Handle with care. Spot clean with dry cloth. Store in AVZ dust bag.",
    sizes: [${sizesStr}],
    inMuseum: false,
    featured: ${item.featured}
  }`;
  }).join(',\n');
}

// ─── Write updated brandData.js ───────────────────────────────────────────────
function updateBrandData() {
  const brandDataPath = path.join(__dirname, '..', 'src', 'data', 'brandData.js');
  let content = fs.readFileSync(brandDataPath, 'utf8');

  const newProductsBlock = `// REAL PRODUCT CATALOGUE — seeded from Patheros Labs inventory (IN0001–IN0024)\nexport const PRODUCTS = [\n${buildProductsArray()}\n];`;

  // Replace from "// REAL PRODUCT CATALOGUE" (or "export const PRODUCTS") to end of PRODUCTS array
  // Find the start of the PRODUCTS export
  const startMarker = '// REAL PRODUCT CATALOGUE';
  const altMarker = 'export const PRODUCTS';

  let startIdx = content.indexOf(startMarker);
  if (startIdx === -1) startIdx = content.indexOf(altMarker);
  if (startIdx === -1) {
    console.error('Could not find PRODUCTS array in brandData.js');
    process.exit(1);
  }

  // Find the closing bracket of the PRODUCTS array
  // Look for "];" after the startIdx
  let depth = 0;
  let inArray = false;
  let endIdx = -1;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '[') { inArray = true; depth++; }
    else if (content[i] === ']') {
      depth--;
      if (inArray && depth === 0) {
        // Find the semicolon
        let j = i + 1;
        while (j < content.length && (content[j] === ';' || content[j] === '\r' || content[j] === '\n')) {
          if (content[j] === ';') { endIdx = j + 1; break; }
          j++;
        }
        if (endIdx !== -1) break;
        endIdx = i + 1;
        break;
      }
    }
  }

  if (endIdx === -1) {
    console.error('Could not find end of PRODUCTS array');
    process.exit(1);
  }

  const updated = content.slice(0, startIdx) + newProductsBlock + content.slice(endIdx);
  fs.writeFileSync(brandDataPath, updated, 'utf8');
  console.log('✅ brandData.js PRODUCTS array updated with 24 real products');
}

// ─── Seed via HTTP API ────────────────────────────────────────────────────────
async function seedViaApi(baseUrl, sessionCookie) {
  console.log(`\n📦 Seeding ${RAW_INVENTORY.length} products via API at ${baseUrl}...\n`);

  let seeded = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of RAW_INVENTORY) {
    const imgs = getImages(item);
    const payload = JSON.stringify({
      title: item.name,
      description: item.description,
      price: item.price,
      compare_at_price: null,
      sku: item.id,
      inventory_quantity: item.stock,
      category: item.category,
      materials: item.materials,
      images: imgs,
      variants: item.sizes.map(s => ({ size: s, stock: item.stock > 1 ? Math.ceil(item.stock / item.sizes.length) : item.stock })),
      status: item.stock === 0 ? 'draft' : 'published',
      is_featured: item.featured,
      custom_made: false,
    });

    try {
      const result = await fetch(`${baseUrl}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionCookie ? { Cookie: sessionCookie } : {}),
        },
        body: payload,
      });

      const data = await result.json();

      if (result.status === 409) {
        console.log(`  ⏭  ${item.id} ${item.name} — already exists, skipping`);
        skipped++;
      } else if (!result.ok) {
        console.error(`  ❌ ${item.id} ${item.name} — ${data.error || result.statusText}`);
        errors++;
      } else {
        console.log(`  ✅ ${item.id} ${item.name} — seeded (id: ${data.id})`);
        seeded++;
      }
    } catch (err) {
      console.error(`  ❌ ${item.id} ${item.name} — network error: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n────────────────────────────────────`);
  console.log(`  Seeded:  ${seeded}`);
  console.log(`  Skipped: ${skipped} (already exist)`);
  console.log(`  Errors:  ${errors}`);
  console.log(`────────────────────────────────────\n`);

  if (errors > 0) process.exit(1);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const apiIdx = args.indexOf('--api');
  const baseUrl = apiIdx !== -1 ? args[apiIdx + 1] : 'http://localhost:3000';
  const cookieIdx = args.indexOf('--cookie');
  const sessionCookie = cookieIdx !== -1 ? args[cookieIdx + 1] : null;

  console.log('\n🏭 AVZ Vaganza — Inventory Seeder\n');

  // Step 1: Update brandData.js (static fallback)
  updateBrandData();

  // Step 2: Seed DB via API (requires dev server running + admin session)
  if (args.includes('--api-seed')) {
    if (!sessionCookie) {
      console.warn('⚠️  No --cookie provided. API requests will fail if admin auth is required.');
      console.warn('   Run: node scripts/seed-inventory.cjs --api-seed --cookie "avz_session=<TOKEN>"');
      console.warn('   Or use --no-auth-seed to bypass auth (dev only).\n');
    }
    await seedViaApi(baseUrl, sessionCookie);
  } else {
    console.log('\nℹ️  brandData.js updated. To also seed the DB, run:');
    console.log('   node scripts/seed-inventory.cjs --api-seed --cookie "avz_session=<TOKEN>"\n');
    console.log('   Or start the dev server and run with the admin session cookie.\n');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
