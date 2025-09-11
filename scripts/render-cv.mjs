import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

async function main() {
  const root = process.cwd();
  const input = path.join(root, 'cv.html');
  const outDir = path.join(root, 'assets', 'pdf');
  const output = path.join(outDir, 'cv.pdf');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('file://' + input, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
  });
  await browser.close();

  const kb = Math.round(fs.statSync(output).size / 1024);
  console.log(`Generated ${output} (${kb} KB)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

