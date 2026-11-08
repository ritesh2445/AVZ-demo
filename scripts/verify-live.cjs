async function verify() {
  const res = await fetch('https://aveezahvaganza.com/api/storefront/products');
  const data = await res.json();
  console.log(`Live Storefront: Found ${data.products.length} products (Expected: 26)\n`);
  data.products.forEach((p, idx) => {
    console.log(`${String(idx + 1).padStart(2, '0')}. [${p.sku}] "${p.title}" | ₹${p.price} | Stock: ${p.inventory_quantity} | ${p.images?.length || 1} shots | Sizes: ${(p.sizes || []).join(', ')}`);
  });
}
verify().catch(console.error);
