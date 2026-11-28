#!/usr/bin/env node
// DEV ONLY: render standard 3D views of bridges for photo-vs-model comparison.
// Starts its own Vite dev server (camera control exists only in dev builds), opens each bridge's
// 3D view full screen at 1200×800 with labels/dimensions off, and writes PNGs.
//
//   node scripts/render_views.mjs <id…|all> --out <dir> [--views front,side,three_quarter,foot,top]
//                                [--az <deg> --el <deg> --target pylon0|main|unit] [--url http://localhost:5173]
//
// See scripts/README.md.
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PRESETS = ['front', 'side', 'three_quarter', 'foot', 'top'];

function parseArgs(argv) {
  const opts = { ids: [], views: PRESETS, out: null, url: null, az: null, el: null, target: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) throw new Error(`missing value for ${a}`);
      return argv[++i];
    };
    if (a === '--out') opts.out = next();
    else if (a === '--views') opts.views = next().split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--url') opts.url = next();
    else if (a === '--az') opts.az = Number(next());
    else if (a === '--el') opts.el = Number(next());
    else if (a === '--target') opts.target = next();
    else if (a === '--help' || a === '-h') opts.help = true;
    else if (a.startsWith('--')) throw new Error(`unknown option ${a}`);
    else opts.ids.push(a);
  }
  return opts;
}

const USAGE = `usage: node scripts/render_views.mjs <id…|all> --out <dir> [--views ${PRESETS.join(',')}]
                                    [--az <deg> --el <deg> --target pylon0|main|unit] [--url <dev server>]`;

const opts = parseArgs(process.argv.slice(2));
if (opts.help || !opts.ids.length || !opts.out) {
  console.log(USAGE);
  process.exit(opts.help ? 0 : 1);
}
for (const v of opts.views) if (!PRESETS.includes(v)) throw new Error(`unknown view "${v}" (${PRESETS.join(', ')})`);
const custom = opts.az !== null || opts.el !== null || opts.target !== null;
if (custom) {
  if (opts.az === null || Number.isNaN(opts.az) || opts.el === null || Number.isNaN(opts.el))
    throw new Error('--az and --el are both required (degrees) for a custom view');
  if (opts.target && !['pylon0', 'main', 'unit'].includes(opts.target)) throw new Error('--target must be pylon0, main or unit');
}

const data = JSON.parse(readFileSync(join(ROOT, 'data/bridges.json'), 'utf8'));
const known = new Set(data.map((b) => b.id));
const ids = opts.ids.includes('all') ? data.map((b) => b.id) : opts.ids;
for (const id of ids) if (!known.has(id)) throw new Error(`unknown bridge id "${id}"`);
const noModel = ids.filter((id) => !data.find((b) => b.id === id).model3d);
if (noModel.length) console.warn(`skipping (no model3d): ${noModel.join(', ')}`);

const { chromium } = await import('playwright').catch(() => {
  console.error('playwright is not installed: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
});

// dev server (the camera API exists only in dev builds)
let server = null;
let base = opts.url;
if (!base) {
  const { createServer } = await import('vite');
  // bind one explicit IPv4 address: with the default 'localhost', two concurrent runs (e.g. in
  // separate git worktrees) can both claim port 5199, one on ::1 and one on 127.0.0.1, and the
  // browser may then load the other run's server. Pinning the host makes the second run move on.
  server = await createServer({ root: ROOT, logLevel: 'error', server: { host: '127.0.0.1', port: 5199, strictPort: false } });
  await server.listen();
  base = server.resolvedUrls.local[0];
}
base = base.replace(/\/$/, '');

mkdirSync(opts.out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const written = [];
try {
  // warm-up: the first load may trigger Vite's dependency optimisation (a full reload)
  {
    const p = await browser.newPage();
    await p.goto(`${base}/?bridge=${ids[0]}&view=3d`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(4000);
    await p.close();
  }
  for (const id of ids) {
    if (noModel.includes(id)) continue;
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await page.addInitScript(() => {
      try {
        localStorage.setItem('vncsb.m3dHintSeen', '1');
      } catch {
        /* ignore */
      }
    });
    page.on('pageerror', (e) => console.error(`${id}: page error: ${e.message}`));
    await page.goto(`${base}/?bridge=${id}&view=3d&lang=vi`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.m3d-canvas', { timeout: 20000 });
    await page.waitForFunction(() => typeof window.__engine?.setView === 'function', null, { timeout: 20000 });
    // full screen, dimensions off, overlays hidden
    await page.click('button[aria-label="Toàn màn hình"]');
    await page.waitForTimeout(800);
    await page.click('.m3d-dialog button[aria-label="Kích thước"]');
    await page.addStyleTag({
      content: '.m3d-toolbar,.m3d-badge-wrap,.m3d-keys,.m3d-hint,.m3d-labels{display:none!important}',
    });
    await page.waitForTimeout(600);
    const shots = custom
      ? [[`custom-az${opts.az}-el${opts.el}-${opts.target ?? 'unit'}`, { az: opts.az, el: opts.el, target: opts.target ?? 'unit' }]]
      : opts.views.map((v) => [v, { preset: v }]);
    for (const [name, spec] of shots) {
      await page.evaluate((s) => window.__engine.setView(s), spec);
      await page.waitForTimeout(700);
      const file = join(opts.out, `${id}-${name}.png`);
      await page.screenshot({ path: file });
      written.push(file);
    }
    await page.close();
  }
} finally {
  await browser.close();
  if (server) await server.close();
}
console.log(written.join('\n'));
