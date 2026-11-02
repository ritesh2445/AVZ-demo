const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const BACKUP_DIR = path.join(__dirname, '..', 'public', 'assets', '.originals');

const targets = [
  { file: 'desktop_poster.jpg', width: 1920, height: 1080, quality: 85 },
  { file: 'mobile_poster.jpg', width: 1080, height: 1920, quality: 85 },
  { file: 'editorial_hero_portrait.jpg', width: 1200, height: 1600, quality: 85 },
  { file: 'dhrisni_avz.jpg', width: 1200, height: 1600, quality: 85 },
  { file: 'look_chainmail_armor.jpg', width: 896, height: 1200, quality: 85 },
  { file: 'prod_motherboard_cuff.jpg', width: 1024, height: 1024, quality: 85 },
  { file: 'look_spike_bodice.jpg', width: 896, height: 1200, quality: 85 }
];

async function run() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const t of targets) {
    const src = path.join(ASSETS_DIR, t.file);
    const backup = path.join(BACKUP_DIR, t.file);

    if (!fs.existsSync(src)) {
      console.log(`Skipping missing: ${t.file}`);
      continue;
    }

    const beforeStats = fs.statSync(src);
    totalBefore += beforeStats.size;

    // Backup if not already backed up
    if (!fs.existsSync(backup)) {
      fs.copyFileSync(src, backup);
    }

    // Process from backup (or original)
    const inputBuf = fs.readFileSync(backup);
    const pipeline = sharp(inputBuf);
    if (t.width && t.height) {
      pipeline.resize(t.width, t.height, { fit: 'cover' });
    }
    const outBuf = await pipeline
      .jpeg({ quality: t.quality, mozjpeg: true, progressive: true })
      .toBuffer();

    fs.writeFileSync(src, outBuf);
    totalAfter += outBuf.length;

    const savedKb = Math.round((beforeStats.size - outBuf.length) / 1024);
    const pct = Math.round(((beforeStats.size - outBuf.length) / beforeStats.size) * 100);
    console.log(`Optimized ${t.file}: ${Math.round(beforeStats.size / 1024)} KB -> ${Math.round(outBuf.length / 1024)} KB (-${savedKb} KB, -${pct}%)`);
  }

  const totalSavedMb = ((totalBefore - totalAfter) / (1024 * 1024)).toFixed(2);
  const totalSavedPct = Math.round(((totalBefore - totalAfter) / totalBefore) * 100);
  console.log(`\nTOTAL SAVINGS: -${totalSavedMb} MB (-${totalSavedPct}%)!`);
}

run().catch(err => {
  console.error('Optimization error:', err);
  process.exit(1);
});
