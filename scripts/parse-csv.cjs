const fs = require('fs');
const lines = fs.readFileSync('scratch/download/Book(Inventory list).csv', 'utf8').split('\n');
const products = [];

for (let i = 7; i <= 32; i++) {
  const line = lines[i];
  if (!line) continue;
  
  const parts = [];
  let cur = '';
  let inQuotes = false;
  for (let c of line) {
    if (c === '"') { inQuotes = !inQuotes; }
    else if (c === ',' && !inQuotes) { parts.push(cur.trim()); cur = ''; }
    else { cur += c; }
  }
  parts.push(cur.trim());

  products.push({
    inventoryId: parts[2],
    name: parts[3],
    description: parts[4],
    rawPrice: parts[5],
    stock: parts[6],
    extra: parts[7]
  });
}

console.log(JSON.stringify(products, null, 2));
fs.writeFileSync('scratch/csv_products.json', JSON.stringify(products, null, 2));
