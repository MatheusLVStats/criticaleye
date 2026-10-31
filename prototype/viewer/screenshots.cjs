// Saves a full-page PNG of each screen (1366 px wide) to prototype/screenshots/.
//
// Needs Playwright:  npm i -D playwright && npx playwright install chromium
// Usage:             node prototype/viewer/screenshots.cjs             (all screens)
//                    node prototype/viewer/screenshots.cjs Main Mapa   (some screens)
//
// Run build.mjs first. The screens load IBM Plex from Google Fonts, so run this online,
// or set DC_FONT_HOOK to a module exporting async (browserContext) => {} that serves
// the fonts some other way; without either, the PNGs use a fallback system font.
// Exits with an error if any screen throws a JavaScript error.

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const proto = path.resolve(__dirname, '..');
const screensDir = path.join(proto, 'screens');
const outDir = path.join(proto, 'screenshots');

(async () => {
  const all = fs.readdirSync(screensDir).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)).sort();
  const names = process.argv.length > 2 ? process.argv.slice(2) : all;
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  if (process.env.DC_FONT_HOOK) await require(path.resolve(process.env.DC_FONT_HOOK))(context);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  for (const name of names) {
    await page.goto(pathToFileURL(path.join(screensDir, name + '.html')).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: true });
    console.log('saved', name + '.png');
  }
  await browser.close();
  if (errors.length) {
    console.error('JavaScript errors:\n' + errors.join('\n'));
    process.exit(1);
  }
})();
