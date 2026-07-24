const fs = require('fs');
const https = require('https');
const path = require('path');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = 'SsgiLsXVMkf0wv8OhRGwks';
const BATCH_SIZE = 80; // Figma API limit ~100 nodes per request

// `node sync-icons.js` → line icons, `node sync-icons.js --solid` → solid icons
const SOLID = process.argv.includes('--solid');
const ICONS_DIR = path.join(__dirname, '..', 'public', SOLID ? 'icons-solid' : 'icons');
const DATA_FILE = path.join(__dirname, '..', 'public', SOLID ? 'icons-solid-data.json' : 'icons-data.json');

// Read icon nodes mapping
const iconNodes = JSON.parse(fs.readFileSync(
  path.join(__dirname, SOLID ? 'icon-nodes-solid.json' : 'icon-nodes.json'), 'utf8'));

function figmaRequest(urlPath) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.figma.com',
      path: urlPath,
      method: 'GET',
      headers: { 'X-Figma-Token': FIGMA_TOKEN }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) resolve(JSON.parse(data));
        else reject(new Error(`Figma API ${res.statusCode}: ${data.substring(0, 200)}`));
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const handler = (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, handler).on('error', reject);
        return;
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    };
    https.get(url, handler).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  // Ensure output directory
  fs.mkdirSync(ICONS_DIR, { recursive: true });

  // Collect all icon IDs
  const allIcons = [];
  for (const [category, icons] of Object.entries(iconNodes)) {
    for (const icon of icons) {
      allIcons.push({ ...icon, category });
    }
  }

  console.log(`Total icons to fetch: ${allIcons.length}`);

  // Batch request SVG URLs from Figma
  const svgUrls = {}; // nodeId -> svgUrl
  for (let i = 0; i < allIcons.length; i += BATCH_SIZE) {
    const batch = allIcons.slice(i, i + BATCH_SIZE);
    const ids = batch.map(ic => ic.id).join(',');
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allIcons.length / BATCH_SIZE);

    console.log(`Fetching SVG URLs batch ${batchNum}/${totalBatches} (${batch.length} icons)...`);

    try {
      const resp = await figmaRequest(`/v1/images/${FILE_KEY}?ids=${ids}&format=svg`);
      if (resp.images) {
        Object.assign(svgUrls, resp.images);
      }
    } catch (err) {
      console.error(`Batch ${batchNum} failed:`, err.message);
    }

    // Rate limit: wait between batches
    if (i + BATCH_SIZE < allIcons.length) {
      await sleep(1000);
    }
  }

  console.log(`Got SVG URLs for ${Object.keys(svgUrls).length} icons`);

  // Download SVGs and build data
  const iconsData = {};
  let downloaded = 0;
  let failed = 0;

  for (const icon of allIcons) {
    const url = svgUrls[icon.id];
    if (!url) {
      failed++;
      continue;
    }

    const fileName = `${icon.name}.svg`;
    const filePath = path.join(ICONS_DIR, fileName);

    try {
      const svg = await downloadFile(url);
      fs.writeFileSync(filePath, svg);
      downloaded++;

      if (!iconsData[icon.category]) {
        iconsData[icon.category] = [];
      }
      iconsData[icon.category].push({
        name: icon.name,
        file: `${SOLID ? '/icons-solid' : '/icons'}/${fileName}`,
      });

      if (downloaded % 50 === 0) {
        console.log(`Downloaded ${downloaded}/${allIcons.length}...`);
      }
    } catch (err) {
      console.error(`Failed to download ${icon.name}:`, err.message);
      failed++;
    }
  }

  // Save icons data JSON
  fs.writeFileSync(DATA_FILE, JSON.stringify(iconsData, null, 2));

  console.log(`\nDone! Downloaded: ${downloaded}, Failed: ${failed}`);
  console.log(`Icons data saved to ${DATA_FILE}`);
}

main().catch(console.error);
