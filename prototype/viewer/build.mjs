// Rebuilds the runnable copies of the prototype screens and the gallery page.
//
//   prototype/source/*.dc.html  ->  prototype/screens/*.html  (one page per screen)
//                                   prototype/index.html      (gallery)
//
// Usage (Node 18+, no dependencies):  node prototype/viewer/build.mjs
//
// The sources are the files of the Claude design canvas, unchanged. They need the
// canvas runtime to run, so each generated page bundles the screen's markup and
// logic with viewer/dc-lite.js instead. Do not edit screens/ or index.html by hand.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const proto = path.resolve(here, '..');
const srcDir = path.join(proto, 'source');
const outDir = path.join(proto, 'screens');

// Order and English captions for the gallery. Portuguese titles come from canvas.json.
const GROUPS = [
  ['Getting in', [
    ['ConectarPasta', 'Connect folder', 'First run in a Windows profile: guided pick of the ICU network folder.'],
    ['Entrada', 'Entry', 'CRM login, first-access name, role (routine or on-call), nursing station, or "Enter as ADM".'],
    ['Adm', 'ADM entry', 'Admin staff enter labs, blood gas, last-24 h vitals and skin. Fluid balance and devices are read-only.'],
    ['Abertura', 'Open the day', "Today's round is created as a copy of yesterday's, without discharges, plus new admissions."],
  ]],
  ['The round', [
    ['Mapa', 'Station map', 'Bed cards with tags (isolation, sepsis, brain-death protocol, palliative care), locks and previous days.'],
    ['Main', 'Bed, full view', 'Every section for one patient, print dialog, "Leave the ICU" menu, copy note.'],
    ['Enxuta', 'Bed, summary view', 'Accordion view, proposed as the default for the pilot.'],
    ['Branco', 'Blank bed, CTI 1', 'Data entry: section toggles per bed, device list feeding the fluid balance, dose and eGFR calculators, antibiotic form.'],
    ['Cti2', 'Blank bed, CTI 2', 'Same screen in the CTI 2 green theme, with the post-op and vascular-surgery blocks.'],
    ['Paliativos', 'Palliative care', 'Palliative care section for one patient, fed by the palliative team, psychology and social service.'],
    ['ProtocoloME', 'Brain-death protocol', 'ICU part of the protocol, with the timing between clinical exams.'],
  ]],
  ['Outputs', [
    ['Evolucao', 'Copy progress note', 'The generated plain-text note for the hospital EHR.'],
    ['Passagem', 'Shift handoff', 'Handoff per station, filter for unstable patients, receiver confirms with their CRM.'],
    ['Impressao', 'Print preview', 'A4 landscape, black-and-white sheet.'],
  ]],
  ['PDF imports', [
    ['ImportEvol', 'Import previous note', 'What the app takes from a progress note written in another ward.'],
    ['ImportRelato', 'Import operative report', 'Surgery report mapped into the surgery, device, fluid balance and culture sections.'],
    ['ImportPrescricao', 'Import prescription', 'Daily prescription mapped into antibiotics, infusions, nutrition and prophylaxis.'],
    ['ImportLaudos', 'Reports and consults', 'Where imaging reports and consult answers land in the round.'],
  ]],
];

function pick(re, s, what, file) {
  const m = s.match(re);
  if (!m) throw new Error(`${file}: ${what} not found`);
  return m;
}

function scriptSafe(js, file) {
  if (/<\/script/i.test(js)) throw new Error(`${file}: "</script" inside the component code`);
  return js;
}

function buildScreen(file) {
  const html = fs.readFileSync(path.join(srcDir, file), 'utf8');
  const title = pick(/<title>([\s\S]*?)<\/title>/, html, '<title>', file)[1].trim();
  const xdc = pick(/<x-dc>([\s\S]*)<\/x-dc>/, html, '<x-dc>', file)[1];
  const helmet = (xdc.match(/<helmet>([\s\S]*?)<\/helmet>/) || ['', ''])[1];
  const body = xdc.replace(/<helmet>[\s\S]*?<\/helmet>/, '').trim();
  const script = pick(/<script type="text\/x-dc"([^>]*)>([\s\S]*?)<\/script>/, html, 'component script', file);
  const propsAttr = (script[1].match(/data-props='([^']*)'/) || ['', '{}'])[1];

  const props = {};
  for (const [k, spec] of Object.entries(JSON.parse(propsAttr))) {
    if (!k.startsWith('$') && spec && spec.default !== undefined) props[k] = spec.default;
  }

  const assets = (s) => s.replace(/(src|href)="assets\//g, '$1="../source/assets/');
  const templateJson = JSON.stringify(assets(body)).replace(/</g, '\\u003c');
  const name = file.replace(/\.dc\.html$/, '');

  const page = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<!-- Generated from ../source/${file} by ../viewer/build.mjs. Do not edit by hand. -->
${assets(helmet).trim()}
</head>
<body>
<div id="dc-root"></div>
<script>window.DC_TEMPLATE = ${templateJson};</script>
<script src="../viewer/dc-lite.js"></script>
<script>
${scriptSafe(script[2], file).trim()}
DCLite.mount(Component, ${JSON.stringify(props)});
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(outDir, name + '.html'), page);
  return { name, title, clickable: /setState\(/.test(script[2]) };
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildGallery(built) {
  const canvas = JSON.parse(fs.readFileSync(path.join(srcDir, 'canvas.json'), 'utf8'));
  const boards = canvas.boards || {};
  const listed = new Set(GROUPS.flatMap(([, items]) => items.map(([n]) => n)));
  const missing = Object.keys(built).filter((n) => !listed.has(n));
  if (missing.length) throw new Error('Add these screens to GROUPS in build.mjs: ' + missing.join(', '));

  const card = ([name, en, desc]) => {
    const b = built[name];
    if (!b) throw new Error(`GROUPS lists ${name}, but source/${name}.dc.html is missing`);
    const pt = (boards[name + '.dc.html'] || {}).title || b.title;
    return `<a class="card" href="screens/${name}.html">
<span class="shot"><img src="screenshots/${name}.png" alt="" loading="lazy"></span>
<span class="txt"><span class="en">${esc(en)}${b.clickable ? ' <span class="tag">clickable</span>' : ''}</span>
<span class="pt">${esc(pt)}</span>
<span class="desc">${esc(desc)}</span></span>
</a>`;
  };

  const sections = GROUPS.map(([g, items]) => `<section>
<h2>${esc(g)}</h2>
<div class="grid">
${items.map(card).join('\n')}
</div>
</section>`).join('\n');

  const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CriticalEye prototype</title>
<!-- Generated by viewer/build.mjs. Do not edit by hand. -->
<style>
:root{--navy:#01234F;--blue:#1D4A8C;--bg:#E8EDF3;--card:#FFFFFF;--line:#D3DCE0;--ink:#1B2A30;--muted:#55666D}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.45}
header{background:var(--navy);color:#fff}
.wrap{max-width:1240px;margin:0 auto;padding:0 16px}
header .wrap{display:flex;align-items:center;gap:12px;padding-top:14px;padding-bottom:14px}
header img{width:36px;height:36px;border-radius:7px;display:block}
header h1{margin:0;font-size:18px}
header p{margin:0;font-size:13px;color:#C6DDF2}
.intro{margin:18px 0 4px;font-size:14px;color:var(--muted);max-width:820px}
h2{margin:26px 0 10px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--blue)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px}
.card{display:flex;flex-direction:column;background:var(--card);border:1px solid var(--line);border-radius:8px;overflow:hidden;color:inherit;text-decoration:none}
.card:hover,.card:focus-visible{border-color:var(--blue);box-shadow:0 0 0 2px rgba(29,74,140,.18)}
.shot{display:block;aspect-ratio:16/10;background:#F6F9FA;border-bottom:1px solid var(--line);overflow:hidden}
.shot img{width:100%;height:100%;object-fit:cover;object-position:top left;display:block}
.txt{display:flex;flex-direction:column;gap:3px;padding:10px 12px 12px}
.en{font-weight:600;font-size:15px}
.pt{font-size:12px;color:var(--muted)}
.desc{font-size:13px}
.tag{font-size:11px;font-weight:600;padding:1px 6px;border-radius:4px;background:#E3EEF8;color:var(--navy);vertical-align:2px}
footer{margin:30px 0;font-size:12px;color:var(--muted)}
</style>
</head>
<body>
<header><div class="wrap">
<img src="source/assets/criticaleye-icone.png" alt="CriticalEye">
<div><h1>CriticalEye · prototype</h1><p>Cada paciente, um olhar atento.</p></div>
</div></header>
<main class="wrap">
<p class="intro">${Object.keys(built).length} screens from the design canvas, with fictional patients. Screens marked "clickable" run their own logic (dose, fluid balance, eGFR, day counts, device and antibiotic lists). Nothing is saved: reloading resets the screen. The screens are in Portuguese.</p>
${sections}
<footer>Generated from prototype/source by prototype/viewer/build.mjs.</footer>
</main>
</body>
</html>
`;
  fs.writeFileSync(path.join(proto, 'index.html'), page);
}

fs.mkdirSync(outDir, { recursive: true });
const built = {};
for (const f of fs.readdirSync(srcDir).filter((f) => f.endsWith('.dc.html')).sort()) {
  const b = buildScreen(f);
  built[b.name] = b;
}
buildGallery(built);
console.log(`Built ${Object.keys(built).length} screens and the gallery.`);
