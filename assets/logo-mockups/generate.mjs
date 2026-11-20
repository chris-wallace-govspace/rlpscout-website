import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/andrehavasi/Documents/Projects/React/rlpscout-website-logo-mockups/assets/logo-mockups";
const PAGE = process.argv[2];

const DARK = {
  ground: "#26292c",
  ink: "#eceeef",
  muted: "#6b7278",
  signal: "#22d3ee",
};
// Cyan #22d3ee is 1.6:1 on a light ground; the light-ground signal is a deeper cyan from the same hue.
const LIGHT = {
  ground: "#f3f4f5",
  ink: "#26292c",
  muted: "#9aa2a8",
  signal: "#0e7490",
};

// 32-unit grid. Structure strokes are 2 units, centred on odd coordinates, so edges land
// on whole pixels at both 32px and 16px.
const S =
  'stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" fill="none"';

const directions = [
  {
    slug: "bracket-lock",
    name: "Bracket Lock",
    kind: "Evolution of the current mark",
    why: "The building sits inside the inspection reticle: a property found, framed and checked against the requirement. Keeps the equity of today’s mark, drops the rounded tile.",
    body: (c) => `
  <path d="M3 9V3h6M23 3h6v6M29 23v6h-6M9 29H3v-6" stroke="${c.signal}" ${S}/>
  <path d="M11 25V15h6V9h4v16" stroke="${c.ink}" ${S}/>
  <path d="M9 25h14" stroke="${c.ink}" ${S}/>`,
  },
  {
    slug: "trace",
    name: "Trace",
    kind: "Pure mark",
    why: "Three ledger rows with a right-angle trace dropping from the requirement to its source node: every requirement traced to the document, page and quote it came from.",
    body: (c) => `
  <path d="M3 7h18" stroke="${c.ink}" ${S}/>
  <path d="M3 16h12" stroke="${c.muted}" ${S}/>
  <path d="M3 25h12" stroke="${c.ink}" ${S}/>
  <path d="M21 7v12" stroke="${c.signal}" ${S}/>
  <rect x="18" y="22" width="6" height="6" fill="${c.signal}"/>
  <path d="M27 25h2" stroke="${c.ink}" ${S}/>`,
  },
  {
    slug: "ledger-elevation",
    name: "Ledger Elevation",
    kind: "Pure mark",
    why: "A building elevation drawn only with ledger rules, one per floor, with the checked floor marked: the building and the record of it are the same object.",
    body: (c) => `
  <path d="M21 7h8M15 13h14M9 19h20M3 25h26" stroke="${c.ink}" ${S}/>
  <rect x="15" y="5" width="4" height="4" fill="${c.signal}"/>`,
  },
  {
    slug: "fit",
    name: "Fit",
    kind: "Pure mark",
    why: "The requirement as an outline, the building as a solid with the same profile, and a lit seam where they meet: a building matched to a federal lease requirement.",
    body: (c) => `
  <path d="M15 29H3V13h6V5h6" stroke="${c.ink}" ${S}/>
  <path d="M15 3v26" stroke="${c.signal}" ${S}/>
  <path d="M18 4h6v8h6v18H18z" fill="${c.ink}"/>`,
  },
  {
    slug: "source-folio",
    name: "Source Folio",
    kind: "Pure mark",
    why: "An RLP page with one line lit as the cited source: reading every line of the solicitation and pointing to the exact clause a requirement came from.",
    body: (c) => `
  <path d="M7 3h12v6h6v20H7z" stroke="${c.ink}" ${S}/>
  <path d="M19 3l6 6" stroke="${c.ink}" ${S}/>
  <path d="M11 13h8M11 25h6" stroke="${c.muted}" ${S}/>
  <path d="M11 19h10" stroke="${c.signal}" ${S}/>`,
  },
  {
    slug: "delineated-area",
    name: "Delineated Area",
    kind: "Pure mark",
    why: "An agency’s delineated area drawn as a survey boundary with one building inside it checked: finding the buildings that qualify for where the government needs space.",
    body: (c) => `
  <path d="M3 9h8V3h12v10h6v16H13v-6H3z" stroke="${c.ink}" ${S}/>
  <rect x="7" y="13" width="4" height="4" fill="${c.muted}"/>
  <rect x="17" y="17" width="6" height="6" fill="${c.signal}"/>`,
  },
];

const svgMark = (d, c, { tile = false, size } = {}) => {
  const dims = size ? ` width="${size}" height="${size}"` : "";
  const bg = tile
    ? `\n  <rect width="32" height="32" rx="2" fill="${c.ground}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"${dims} role="img" aria-label="${d.name} mark">${bg}${d.body(c)}\n</svg>`;
};

const WORD =
  'font-family="Geist, \'Helvetica Neue\', Arial, sans-serif" font-weight="500" letter-spacing="1.6"';

const svgLockupH = (d, c) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196 32" role="img" aria-label="RLPSCOUT">
  <g>${d.body(c)}</g>
  <text x="44" y="23" font-size="20" ${WORD} fill="${c.ink}">RLPSCOUT</text>
</svg>`;

const svgLockupS = (d, c) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 92" role="img" aria-label="RLPSCOUT">
  <g transform="translate(42 0) scale(1.5)">${d.body(c)}</g>
  <text x="66" y="86" text-anchor="middle" font-size="18" ${WORD} fill="${c.ink}">RLPSCOUT</text>
</svg>`;

for (const d of directions) {
  const dir = join(OUT, d.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "mark-dark.svg"), svgMark(d, DARK) + "\n");
  writeFileSync(join(dir, "mark-light.svg"), svgMark(d, LIGHT) + "\n");
  writeFileSync(
    join(dir, "favicon.svg"),
    svgMark(d, DARK, { tile: true }) + "\n",
  );
  writeFileSync(
    join(dir, "lockup-horizontal-dark.svg"),
    svgLockupH(d, DARK) + "\n",
  );
  writeFileSync(
    join(dir, "lockup-horizontal-light.svg"),
    svgLockupH(d, LIGHT) + "\n",
  );
  writeFileSync(
    join(dir, "lockup-stacked-dark.svg"),
    svgLockupS(d, DARK) + "\n",
  );
  writeFileSync(
    join(dir, "lockup-stacked-light.svg"),
    svgLockupS(d, LIGHT) + "\n",
  );
}

const enc = (s) =>
  "data:image/svg+xml;base64," + Buffer.from(s).toString("base64");

const card = (d, i) => `
<section class="dir" id="${d.slug}" aria-labelledby="${d.slug}-h"><div class="wrap">
  <header class="dir-head">
    <span class="idx">${String.fromCharCode(65 + i)}</span>
    <div class="dir-title">
      <h2 id="${d.slug}-h">${d.name}</h2>
      <p class="kind">${d.kind}</p>
    </div>
    <p class="why">${d.why}</p>
  </header>
  <div class="grid">
    <figure class="cell hero dark"><div class="stage">${svgMark(d, DARK)}</div><figcaption>Mark on charcoal <code>#26292c</code></figcaption></figure>
    <figure class="cell hero light"><div class="stage">${svgMark(d, LIGHT)}</div><figcaption>Mark on light</figcaption></figure>
    <figure class="cell fav dark">
      <div class="fav-row">
        <div class="fav-real"><img src="${enc(svgMark(d, DARK, { tile: true }))}" width="16" height="16" alt=""><span>16</span></div>
        <div class="fav-real"><img src="${enc(svgMark(d, DARK, { tile: true }))}" width="32" height="32" alt=""><span>32</span></div>
        <div class="fav-zoom"><canvas data-src="${enc(svgMark(d, DARK, { tile: true }))}" data-px="16" width="16" height="16" aria-label="16px favicon magnified"></canvas><span>16px, 4&times;</span></div>
        <div class="fav-zoom"><canvas data-src="${enc(svgMark(d, DARK, { tile: true }))}" data-px="32" width="32" height="32" aria-label="32px favicon magnified"></canvas><span>32px, 2&times;</span></div>
      </div>
      <figcaption>Favicon, rasterised at real size</figcaption>
    </figure>
    <figure class="cell lock dark"><div class="stage-l">${svgLockupH(d, DARK)}</div><figcaption>Horizontal lockup</figcaption></figure>
    <figure class="cell lock light"><div class="stage-l">${svgLockupH(d, LIGHT)}</div><figcaption>Horizontal lockup, light</figcaption></figure>
    <figure class="cell lock dark"><div class="stage-s">${svgLockupS(d, DARK)}</div><figcaption>Stacked lockup</figcaption></figure>
  </div>
  <p class="files">assets/logo-mockups/${d.slug}/</p></div>
</section>`;

const lineup = directions
  .map(
    (d, i) =>
      `<a class="pick" href="#${d.slug}"><span class="pick-mark">${svgMark(d, DARK)}</span><span class="pick-name"><b>${String.fromCharCode(65 + i)}</b> ${d.name}</span></a>`,
  )
  .join("");

const html = `<title>RLPScout Mark Directions</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap">
<style>
/* Ledger layout: full-width ruled bands, one per direction; a lineup strip up top for side-by-side reading. Dark only, per DESIGN.md. */
:root {
  --ground: #26292c; --band: #2d3134; --raised: #34393d;
  --rule: #474c51; --rule-soft: #3a3f43; --rule-strong: #6b7278;
  --ink: #eceeef; --ink-body: #b0b7bc; --ink-muted: #9aa2a8;
  --cyan: #22d3ee; --light-ground: #f3f4f5; --light-rule: #d6dadd;
  --sans: Geist, "Helvetica Neue", Arial, sans-serif;
  --mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace;
  color-scheme: dark;
}
* { box-sizing: border-box; }
body { background: var(--ground); color: var(--ink-body); font-family: var(--sans); font-size: 15px; line-height: 1.55; }
::selection { background: rgba(34, 211, 238, .28); color: var(--ink); }
.wrap { max-width: 1320px; margin: 0 auto; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.intro { padding-block: 56px 32px; display: grid; grid-template-columns: 5fr 7fr; gap: clamp(24px, 5vw, 80px); align-items: end; }
h1 { font-weight: 400; color: var(--ink); font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.04; letter-spacing: -0.03em; margin: 0; text-wrap: balance; }
.intro p { margin: 0; max-width: 60ch; }
.intro p + p { margin-top: 10px; }
.rules { font-family: var(--mono); font-size: .75rem; color: var(--ink-muted); }
.lineup-band { border-top: 1px solid var(--rule-soft); border-bottom: 1px solid var(--rule-soft); background: var(--band); }
.lineup { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); }
.pick { display: flex; flex-direction: column; align-items: center; gap: 14px; padding-block: 28px 18px; color: var(--ink-body); text-decoration: none; border-left: 1px solid var(--rule-soft); transition: background-color 160ms cubic-bezier(.25,1,.5,1); }
.pick:first-child { border-left: 0; }
.pick:hover { background: var(--raised); color: var(--ink); }
.pick:focus-visible { outline: 2px solid var(--cyan); outline-offset: -2px; }
.pick-mark svg { width: 64px; height: 64px; display: block; }
.pick-name { font-size: .8125rem; }
.pick-name b { font-family: var(--mono); font-weight: 400; color: var(--ink-muted); margin-right: 4px; }
.dir { border-top: 1px solid var(--rule-soft); padding-block: 48px; }
.dir:nth-child(even) { background: var(--band); }
.dir-head { display: grid; grid-template-columns: auto minmax(0, 4fr) minmax(0, 7fr); gap: 12px clamp(16px, 3vw, 48px); align-items: baseline; margin-bottom: 24px; }
.idx { font-family: var(--mono); font-size: .8125rem; color: var(--ink-muted); }
h2 { font-weight: 400; color: var(--ink); font-size: clamp(1.5rem, 2.4vw, 2rem); line-height: 1.1; letter-spacing: -0.02em; margin: 0; }
.kind { margin: 4px 0 0; font-size: .8125rem; color: var(--ink-muted); }
.why { margin: 0; max-width: 60ch; color: var(--ink-body); }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--rule); }
.cell { margin: 0; display: flex; flex-direction: column; justify-content: space-between; min-height: 220px; border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); min-width: 0; }
.cell:nth-child(3n) { border-right: 0; }
.cell:nth-child(n+4) { border-bottom: 0; }
.cell.dark { background: var(--ground); }
.cell.light { background: var(--light-ground); }
.cell.light figcaption { color: #4d5459; border-top-color: var(--light-rule); }
.cell figcaption { font-size: .75rem; color: var(--ink-muted); padding: 10px 14px; border-top: 1px solid var(--rule-soft); }
.cell code { font-family: var(--mono); font-size: .7rem; }
.stage, .stage-l, .stage-s { flex: 1; display: grid; place-items: center; padding: 28px 16px; }
.stage svg { width: 112px; height: 112px; }
.stage-l svg { width: min(100%, 260px); height: auto; }
.stage-s svg { width: 150px; height: auto; }
.fav-row { flex: 1; display: flex; flex-wrap: wrap; gap: 22px; align-items: center; justify-content: center; padding: 24px 14px; }
.fav-real, .fav-zoom { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.fav-real span, .fav-zoom span { font-family: var(--mono); font-size: .6875rem; color: var(--ink-muted); }
.fav-real img { image-rendering: auto; }
.fav-zoom canvas { width: 64px; height: 64px; image-rendering: pixelated; outline: 1px solid var(--rule-soft); }
.files { margin: 12px 0 0; font-family: var(--mono); font-size: .75rem; color: var(--ink-muted); }
footer { border-top: 1px solid var(--rule-soft); padding-block: 32px 56px; font-size: .8125rem; color: var(--ink-muted); }
footer p { margin: 0; max-width: 72ch; }
footer p + p { margin-top: 8px; }
@media (max-width: 900px) {
  .intro { grid-template-columns: 1fr; }
  .lineup { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .pick:nth-child(4) { border-left: 0; }
  .pick:nth-child(n+4) { border-top: 1px solid var(--rule-soft); }
  .dir-head { grid-template-columns: auto minmax(0, 1fr); }
  .why { grid-column: 1 / -1; }
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cell, .cell:nth-child(3n), .cell:nth-child(n+4) { border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .cell:nth-child(2n) { border-right: 0; }
}
@media (max-width: 560px) {
  .lineup { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pick, .pick:nth-child(4) { border-left: 1px solid var(--rule-soft); }
  .pick:nth-child(odd) { border-left: 0; }
  .pick:nth-child(n+3) { border-top: 1px solid var(--rule-soft); }
  .grid { grid-template-columns: 1fr; }
  .cell, .cell:nth-child(2n) { border-right: 0; }
}
</style>

<div class="wrap intro">
  <h1>Six mark directions for the Inspection Ledger rebrand.</h1>
  <div>
    <p>Every mark stands alone, so it survives a product rename; RLPSCOUT appears only in the lockups. Cyan marks the one thing each mark has checked. Structure is 2px rule on a 32-unit grid, square corners, no tile.</p>
    <p class="rules">32 grid · 2u stroke on odd centres · cyan #22d3ee dark / #0e7490 light · ink #eceeef · Geist 500 wordmark</p>
  </div>
</div>

<div class="lineup-band"><div class="wrap"><nav class="lineup" aria-label="Directions">${lineup}</nav></div></div>

${directions.map((d, i) => `${card(d, i)}`).join("")}

<footer><div class="wrap">
  <p>Light-ground versions use a deeper cyan (#0e7490) because #22d3ee falls to 1.6:1 on a light ground. DESIGN.md is dark only, so this is a proposed addition, not an existing token.</p>
  <p>Lockup SVGs set the wordmark as live Geist text. The chosen direction gets its wordmark outlined to paths before it ships.</p>
  <p>RLPSCOUT AI LLC</p>
</div></footer>

<script>
document.querySelectorAll('canvas[data-src]').forEach((cv) => {
  const img = new Image();
  img.onload = () => { const ctx = cv.getContext('2d'); ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0, cv.width, cv.height); };
  img.src = cv.dataset.src;
});
</script>
`;

writeFileSync(PAGE, html);
console.log("ok", directions.length);
