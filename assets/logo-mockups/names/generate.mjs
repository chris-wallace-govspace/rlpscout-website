import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/andrehavasi/Documents/Projects/React/rlpscout-website-logo-mockups/assets/logo-mockups/names";
const PAGE = process.argv[2];

const DARK = {
  ground: "#26292c",
  ink: "#eceeef",
  muted: "#6b7278",
  signal: "#22d3ee",
};
// #22d3ee is 1.6:1 on a light ground, so light versions use a deeper cyan of the same hue.
const LIGHT = {
  ground: "#f3f4f5",
  ink: "#26292c",
  muted: "#9aa2a8",
  signal: "#0e7490",
};

// 32-unit grid; 2-unit strokes centred on odd coordinates stay pixel-sharp at 16px and 32px.
const S =
  'stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" fill="none"';

const names = [
  {
    slug: "cornerpin",
    name: "Cornerpin",
    style: "Real survey term",
    meaning:
      "The iron pin a surveyor sets at a property corner: the fixed point every boundary and measurement is checked from.",
    mark: "Two boundary lines run into a lit pin at the corner. It grows out of the current bracket mark, so the change reads as continuity.",
    domain: "cornerpin.ai unregistered",
    screen:
      'No company or trademark found under the name. "Corner pin" is also a video-effects term in After Effects, a different field.',
    risk: "low",
    body: (c) => `
  <path d="M9 3v14M15 23h14" stroke="${c.ink}" ${S}/>
  <path d="M3 23h0M9 29h0" stroke="${c.muted}" ${S}/>
  <rect x="6" y="20" width="6" height="6" fill="${c.signal}"/>`,
  },
  {
    slug: "keyplan",
    name: "Keyplan",
    style: "Real architecture term",
    meaning:
      "The small plan in the corner of every drawing sheet that shows which part of the building you are looking at.",
    mark: "An L-shaped floor plan with one bay lit: the part of the building that answers this requirement.",
    domain: "keyplan.ai unregistered",
    screen:
      "A Dutch facility-management SaaS called Keyplan serves real estate managers. Same broad market, so a trademark search is needed before committing.",
    risk: "medium",
    body: (c) => `
  <path d="M3 3h26v14H17v12H3z" stroke="${c.ink}" ${S}/>
  <path d="M17 3v14" stroke="${c.muted}" ${S}/>
  <rect x="20" y="6" width="6" height="8" fill="${c.signal}"/>`,
  },
  {
    slug: "sightrule",
    name: "Sightrule",
    style: "Real survey instrument",
    meaning:
      "The sighting ruler on a surveyor’s plane table: you sight the target along it and draw the line true.",
    mark: "A graduated rule with a rear sight and a lit line of sight running past the front vane toward the target.",
    domain: "sightrule.ai unregistered",
    screen: "No company or trademark found under the name.",
    risk: "low",
    body: (c) => `
  <rect x="2" y="24" width="28" height="4" fill="${c.ink}"/>
  <path d="M11 21v0M15 21v0M19 21v0" stroke="${c.muted}" ${S}/>
  <path d="M5 21V5M25 21v-6" stroke="${c.ink}" ${S}/>
  <path d="M5 9h24" stroke="${c.signal}" ${S}/>`,
  },
  {
    slug: "checkline",
    name: "Checkline",
    style: "Descriptive compound",
    meaning:
      "The line in a ledger that has been checked. Says what the product does: every requirement gets a line, and each line gets checked.",
    mark: "Three ledger rows with a box beside each; the checked row is lit.",
    domain: "checkline.ai unregistered",
    screen:
      "Checkline is a registered brand of Electromatic Equipment Co. for tension and torque instruments. Different goods, but a known mark; needs a trademark opinion.",
    risk: "medium",
    body: (c) => `
  <rect x="3" y="2" width="6" height="6" fill="${c.muted}"/>
  <rect x="3" y="12" width="6" height="6" fill="${c.signal}"/>
  <rect x="3" y="22" width="6" height="6" fill="${c.muted}"/>
  <path d="M15 5h14M15 15h14M15 25h10" stroke="${c.ink}" ${S}/>`,
  },
  {
    slug: "lessora",
    name: "Lessora",
    style: "Coined word",
    meaning:
      "Built from lessor, the party that grants the lease. Easy to say, unclaimed, and it names the company’s role on the website.",
    mark: "A premises outline with its threshold lit: the space handed over, at the moment it is granted.",
    domain: "lessora.ai unregistered",
    screen: "No company or trademark found under the name.",
    risk: "low",
    body: (c) => `
  <path d="M11 29H3V3h26v26h-8" stroke="${c.ink}" ${S}/>
  <path d="M13 29h6" stroke="${c.signal}" ${S}/>
  <path d="M9 9h14" stroke="${c.muted}" ${S}/>`,
  },
  {
    slug: "sitefolio",
    name: "Sitefolio",
    style: "Descriptive compound",
    meaning:
      "The file kept on each site: the building and every page of evidence that it meets the requirement.",
    mark: "A folio page with a building elevation drawn in ledger rules, its top floor checked.",
    domain: "sitefolio.ai unregistered",
    screen:
      "A tiny portfolio-builder called SiteFolios (plural) is on Product Hunt. Different field; low risk.",
    risk: "low",
    body: (c) => `
  <path d="M5 3h14v6h6v20H5z" stroke="${c.ink}" ${S}/>
  <path d="M19 3l6 6" stroke="${c.ink}" ${S}/>
  <path d="M15 15h6M9 21h12" stroke="${c.ink}" ${S}/>
  <rect x="9" y="13" width="4" height="4" fill="${c.signal}"/>`,
  },
];

const svgMark = (d, c, { tile = false } = {}) => {
  const bg = tile
    ? `\n  <rect width="32" height="32" rx="2" fill="${c.ground}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="${d.name} mark">${bg}${d.body(c)}\n</svg>`;
};

const WORD = `font-family="Geist, 'Helvetica Neue', Arial, sans-serif" font-weight="500" letter-spacing="1.6"`;
const wordW = (d, size) => Math.ceil(d.name.length * size * 0.74);

const svgLockupH = (d, c) => {
  const w = 44 + wordW(d, 20);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 32" role="img" aria-label="${d.name}">
  <g>${d.body(c)}</g>
  <text x="44" y="23" font-size="20" ${WORD} fill="${c.ink}">${d.name.toUpperCase()}</text>
</svg>`;
};

const svgLockupS = (d, c) => {
  const w = Math.max(96, wordW(d, 18) + 8);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 92" role="img" aria-label="${d.name}">
  <g transform="translate(${w / 2 - 24} 0) scale(1.5)">${d.body(c)}</g>
  <text x="${w / 2}" y="86" text-anchor="middle" font-size="18" ${WORD} fill="${c.ink}">${d.name.toUpperCase()}</text>
</svg>`;
};

for (const d of names) {
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

const card = (d, i) => {
  const fav = enc(svgMark(d, DARK, { tile: true }));
  return `
<section class="dir" id="${d.slug}" aria-labelledby="${d.slug}-h"><div class="wrap">
  <header class="dir-head">
    <span class="idx">${i + 1}</span>
    <div class="dir-title">
      <h2 id="${d.slug}-h">${d.name}</h2>
      <p class="kind">${d.style}</p>
    </div>
    <dl class="facts">
      <dt>Name</dt><dd>${d.meaning}</dd>
      <dt>Mark</dt><dd>${d.mark}</dd>
      <dt>Domain</dt><dd class="mono">${d.domain}</dd>
      <dt>Conflicts</dt><dd><span class="risk risk-${d.risk}">${d.risk === "low" ? "Low" : "Check"}</span> ${d.screen}</dd>
    </dl>
  </header>
  <div class="grid">
    <figure class="cell lock dark wide"><div class="stage-l">${svgLockupH(d, DARK)}</div><figcaption>Horizontal lockup on charcoal <code>#26292c</code></figcaption></figure>
    <figure class="cell hero dark"><div class="stage">${svgMark(d, DARK)}</div><figcaption>Mark alone</figcaption></figure>
    <figure class="cell hero light"><div class="stage">${svgMark(d, LIGHT)}</div><figcaption>Mark on light</figcaption></figure>
    <figure class="cell fav dark">
      <div class="fav-row">
        <div class="fav-real"><img src="${fav}" width="16" height="16" alt=""><span>16</span></div>
        <div class="fav-real"><img src="${fav}" width="32" height="32" alt=""><span>32</span></div>
        <div class="fav-zoom"><canvas data-src="${fav}" width="16" height="16" aria-label="16px favicon magnified"></canvas><span>16px, 4&times;</span></div>
      </div>
      <figcaption>Favicon at real size</figcaption>
    </figure>
    <figure class="cell lock light"><div class="stage-l">${svgLockupH(d, LIGHT)}</div><figcaption>Horizontal lockup, light</figcaption></figure>
    <figure class="cell lock dark"><div class="stage-s">${svgLockupS(d, DARK)}</div><figcaption>Stacked lockup</figcaption></figure>
    <figure class="cell lock light"><div class="stage-s">${svgLockupS(d, LIGHT)}</div><figcaption>Stacked lockup, light</figcaption></figure>
  </div>
  <p class="files">assets/logo-mockups/names/${d.slug}/</p>
</div></section>`;
};

const lineup = names
  .map(
    (d) =>
      `<a class="pick" href="#${d.slug}"><span class="pick-mark">${svgMark(d, DARK)}</span><span class="pick-name">${d.name}</span><span class="pick-dom">${d.slug}.ai</span></a>`,
  )
  .join("");

const html = `<title>Name and Mark Shortlist</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap">
<style>
/* Ledger layout: ruled full-width bands, one per name; lineup strip on top for side-by-side reading. Dark only, per DESIGN.md. */
:root {
  --ground: #26292c; --band: #2d3134; --raised: #34393d;
  --rule: #474c51; --rule-soft: #3a3f43; --rule-strong: #6b7278;
  --ink: #eceeef; --ink-body: #b0b7bc; --ink-muted: #9aa2a8;
  --cyan: #22d3ee; --met: #7ee8d8; --amber: #f2b84b;
  --light-ground: #f3f4f5; --light-rule: #d6dadd; --light-cap: #4d5459;
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
.intro p { margin: 0; max-width: 62ch; }
.intro p + p { margin-top: 10px; }
.lineup-band { border-top: 1px solid var(--rule-soft); border-bottom: 1px solid var(--rule-soft); background: var(--band); }
.lineup { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); }
.pick { display: flex; flex-direction: column; align-items: center; gap: 6px; padding-block: 28px 18px; color: var(--ink); text-decoration: none; border-left: 1px solid var(--rule-soft); transition: background-color 160ms cubic-bezier(.25,1,.5,1); }
.pick:first-child { border-left: 0; }
.pick:hover { background: var(--raised); }
.pick:focus-visible { outline: 2px solid var(--cyan); outline-offset: -2px; }
.pick-mark svg { width: 64px; height: 64px; display: block; margin-bottom: 10px; }
.pick-name { font-size: 1rem; letter-spacing: -0.01em; }
.pick-dom { font-family: var(--mono); font-size: .6875rem; color: var(--ink-muted); }
.dir { border-top: 1px solid var(--rule-soft); padding-block: 48px; }
.dir:nth-child(even) { background: var(--band); }
.dir-head { display: grid; grid-template-columns: auto minmax(0, 4fr) minmax(0, 8fr); gap: 12px clamp(16px, 3vw, 48px); align-items: start; margin-bottom: 24px; }
.idx { font-family: var(--mono); font-size: .8125rem; color: var(--ink-muted); padding-top: 10px; }
h2 { font-weight: 400; color: var(--ink); font-size: clamp(1.8rem, 3vw, 2.5rem); line-height: 1.05; letter-spacing: -0.025em; margin: 0; }
.kind { margin: 6px 0 0; font-size: .8125rem; color: var(--ink-muted); }
.facts { margin: 0; display: grid; grid-template-columns: 84px minmax(0, 1fr); border-top: 1px solid var(--rule-soft); }
.facts dt, .facts dd { margin: 0; padding: 8px 0; border-bottom: 1px solid var(--rule-soft); }
.facts dt { font-size: .75rem; color: var(--ink-muted); padding-top: 10px; }
.facts dd { max-width: 70ch; }
.mono { font-family: var(--mono); font-size: .8125rem; color: var(--ink); }
.risk { display: inline-block; font-size: .6875rem; line-height: 1; padding: 4px 6px; border: 1px solid currentColor; border-radius: 2px; margin-right: 6px; vertical-align: 1px; }
.risk-low { color: var(--met); }
.risk-medium { color: var(--amber); }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--rule); }
.cell { margin: 0; display: flex; flex-direction: column; justify-content: space-between; min-height: 200px; border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); min-width: 0; }
.cell.wide { grid-column: 1 / -1; min-height: 180px; }
.cell:nth-child(4), .cell:nth-child(7) { border-right: 0; }
.cell:nth-child(n+5) { border-bottom: 0; }
.cell.dark { background: var(--ground); }
.cell.light { background: var(--light-ground); }
.cell.light figcaption { color: var(--light-cap); border-top-color: var(--light-rule); }
.cell figcaption { font-size: .75rem; color: var(--ink-muted); padding: 10px 14px; border-top: 1px solid var(--rule-soft); }
.cell code { font-family: var(--mono); font-size: .7rem; }
.stage, .stage-l, .stage-s { flex: 1; display: grid; place-items: center; padding: 28px 16px; }
.stage svg { width: 104px; height: 104px; }
.wide .stage-l svg { width: min(100%, 420px); height: auto; }
.stage-l svg { width: min(100%, 250px); height: auto; }
.stage-s svg { width: 150px; height: auto; max-width: 100%; }
.fav-row { flex: 1; display: flex; flex-wrap: wrap; gap: 22px; align-items: center; justify-content: center; padding: 24px 14px; }
.fav-real, .fav-zoom { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.fav-real span, .fav-zoom span { font-family: var(--mono); font-size: .6875rem; color: var(--ink-muted); }
.fav-zoom canvas { width: 64px; height: 64px; image-rendering: pixelated; outline: 1px solid var(--rule-soft); }
.files { margin: 12px 0 0; font-family: var(--mono); font-size: .75rem; color: var(--ink-muted); }
footer { border-top: 1px solid var(--rule-soft); padding-block: 32px 56px; font-size: .8125rem; color: var(--ink-muted); }
footer p { margin: 0; max-width: 76ch; }
footer p + p { margin-top: 8px; }
@media (max-width: 900px) {
  .intro { grid-template-columns: 1fr; }
  .lineup { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .pick:nth-child(4) { border-left: 0; }
  .pick:nth-child(n+4) { border-top: 1px solid var(--rule-soft); }
  .dir-head { grid-template-columns: auto minmax(0, 1fr); }
  .facts { grid-column: 1 / -1; }
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cell, .cell:nth-child(4), .cell:nth-child(7), .cell:nth-child(n+5) { border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .cell:nth-child(odd) { border-right: 0; }
  .cell.wide { border-right: 0; }
}
@media (max-width: 560px) {
  .lineup { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pick, .pick:nth-child(4) { border-left: 1px solid var(--rule-soft); }
  .pick:nth-child(odd) { border-left: 0; }
  .pick:nth-child(n+3) { border-top: 1px solid var(--rule-soft); }
  .grid { grid-template-columns: 1fr; }
  .cell, .cell:nth-child(n) { border-right: 0; }
  .facts { grid-template-columns: 72px minmax(0, 1fr); }
}
</style>

<div class="wrap intro">
  <h1>Six names, each with a mark drawn from what the name means.</h1>
  <div>
    <p>One name for the company and the app. Every name is a word from surveying, plans or the ledger, or is built from one, and every .ai domain below came back unregistered on 20 November 2026.</p>
    <p>Each mark draws the thing the name refers to, in the Inspection Ledger grammar: 2-unit rules, square corners, cyan only on the part that is checked.</p>
  </div>
</div>

<div class="lineup-band"><div class="wrap"><nav class="lineup" aria-label="Names">${lineup}</nav></div></div>

${names.map(card).join("")}

<footer><div class="wrap">
  <p>Domain status comes from DNS and the .ai WHOIS on 20 November 2026; nothing was reserved. Conflict notes come from a web search only. Before a name is used, it needs a USPTO search in classes 36 (real estate) and 42 (software) and an attorney's opinion.</p>
  <p>Screened out: Leasetrace (registered US trademark for leasing-marketing software), Leaseplat (reads as a misspelling of LeasePlan), Matchline, Datum, Plumb, Folio, Traverse and most other plain survey words (the .ai domains are taken).</p>
  <p>Light versions use a deeper cyan (#0e7490) because #22d3ee is 1.6:1 on light. Wordmarks are live Geist text until a name is chosen.</p>
</div></footer>

<script>
document.querySelectorAll('canvas[data-src]').forEach((cv) => {
  const img = new Image();
  img.onload = () => cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
  img.src = cv.dataset.src;
});
</script>
`;

writeFileSync(PAGE, html);
console.log("ok", names.length);
