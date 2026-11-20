import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("..", import.meta.url));
const PAGE = process.argv[2];
const WORD = JSON.parse(
  readFileSync(new URL("./wordmark.json", import.meta.url)),
);

const DARK = {
  ground: "#26292c",
  ink: "#eceeef",
  muted: "#6b7278",
  signal: "#22d3ee",
};
// #22d3ee is 1.6:1 on a light ground, so the light version uses a deeper cyan of the same hue.
const LIGHT = {
  ground: "#f3f4f5",
  ink: "#26292c",
  muted: "#9aa2a8",
  signal: "#0e7490",
};
const MONO_W = { ink: "#ffffff", muted: "#ffffff", signal: "#ffffff" };
const MONO_K = { ink: "#26292c", muted: "#26292c", signal: "#26292c" };

const PIN =
  "M16 21.5L11.65 14.5A5 5 0 1 1 20.35 14.5ZM16 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4Z";
const RING = "M16 3a13 13 0 1 1 0 26a13 13 0 1 1 0-26";
const ARC = "M16 3a13 13 0 0 1 13 13";
const SW = 'stroke-width="2" stroke-linecap="square" fill="none"';

const parts = (c, animated = false) => {
  const pl = animated ? ' pathLength="1"' : "";
  const a = (cls, i, o) =>
    animated ? ` class="${cls}" style="--i:${i};--o:${o}"` : "";
  return [
    `<path d="${PIN}" fill="${c.ink}" fill-rule="evenodd"${a("f drop", 0, 2)}/>`,
    `<path d="${RING}" stroke="${c.muted}" ${SW}${pl}${a("s", 1, 1)}/>`,
    `<path d="${ARC}" stroke="${c.signal}" ${SW}${pl}${a("s orb", 2, 0)}/>`,
  ].join("\n  ");
};

const svg = (vb, body, label = "Lessora") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}">\n  ${body}\n</svg>\n`;

const mark = (c) => svg("0 0 32 32", parts(c));
const tile = (c, scale, radius) => {
  const off = ((32 - 32 * scale) / 2).toFixed(2);
  return svg(
    "0 0 32 32",
    `<rect width="32" height="32"${radius ? ` rx="${radius}"` : ""} fill="${c.ground}"/>\n  <g transform="translate(${off} ${off}) scale(${scale})">\n  ${parts(c)}\n  </g>`,
  );
};

const H_W = Math.ceil(44 + WORD.w + 1);
const baseline = +(16 + WORD.cap / 2).toFixed(2);
const lockupH = (c) =>
  svg(
    `0 0 ${H_W} 32`,
    `${parts(c)}\n  <path d="${WORD.d}" fill="${c.ink}" transform="translate(44 ${baseline})"/>`,
  );

const S_W = 120;
const S_SCALE = 0.88;
const S_BASE = +(48 + 14 + WORD.cap * S_SCALE).toFixed(2);
const S_H = Math.ceil(S_BASE + 6);
const lockupS = (c) =>
  svg(
    `0 0 ${S_W} ${S_H}`,
    `<g transform="translate(36 0) scale(1.5)">\n  ${parts(c)}\n  </g>\n  <path d="${WORD.d}" fill="${c.ink}" transform="translate(${((S_W - WORD.w * S_SCALE) / 2).toFixed(2)} ${S_BASE}) scale(${S_SCALE})"/>`,
  );

const MOTION_CSS = `.lessora-mark { overflow: visible; }
.lessora-mark .s { stroke-dasharray: 1 1; stroke-dashoffset: 0; }
.lessora-mark .f { transform-box: fill-box; transform-origin: center; }
.lessora-mark .orb { transform-box: view-box; transform-origin: 16px 16px; }
.lessora-mark.is-enter .s { animation: lessora-draw .6s cubic-bezier(.16,1,.3,1) calc(var(--i) * .14s) both; }
.lessora-mark.is-enter .drop { animation: lessora-dropin .6s cubic-bezier(.16,1,.3,1) calc(var(--i) * .14s) both; }
.lessora-mark.is-exit .s { animation: lessora-erase .34s cubic-bezier(.5,0,.75,0) calc(var(--o) * .07s) both; }
.lessora-mark.is-exit .drop { animation: lessora-lift .32s cubic-bezier(.5,0,.75,0) calc(var(--o) * .07s) both; }
.lessora-mark.is-loading .orb { animation: lessora-spin 1.4s cubic-bezier(.45,.05,.55,.95) infinite; }
.lessora-mark.is-loading .drop { animation: lessora-bob 1.4s cubic-bezier(.45,.05,.55,.95) infinite; }
@keyframes lessora-draw { from { stroke-dashoffset: 1; opacity: 0; } 8% { opacity: 1; } to { stroke-dashoffset: 0; opacity: 1; } }
@keyframes lessora-erase { from { stroke-dashoffset: 0; opacity: 1; } 92% { opacity: 1; } to { stroke-dashoffset: -1; opacity: 0; } }
@keyframes lessora-dropin { from { transform: translateY(-9px); opacity: 0; } 40% { opacity: 1; } to { transform: translateY(0); opacity: 1; } }
@keyframes lessora-lift { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-9px); opacity: 0; } }
@keyframes lessora-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes lessora-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
@keyframes lessora-breathe { 50% { opacity: .35; } }
@media (prefers-reduced-motion: reduce) {
  .lessora-mark * { animation: none !important; }
  .lessora-mark.is-loading .orb { animation: lessora-breathe 1.6s ease-in-out infinite !important; }
}
`;

const animated = (mode) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="lessora-mark is-${mode}" role="img" aria-label="Lessora${mode === "loading" ? ", loading" : ""}">\n<style>\n${MOTION_CSS}</style>\n  ${parts(DARK, true)}\n</svg>\n`;

mkdirSync(OUT, { recursive: true });
const files = {
  "lessora-mark-dark.svg": mark(DARK),
  "lessora-mark-light.svg": mark(LIGHT),
  "lessora-mark-white.svg": mark(MONO_W),
  "lessora-mark-charcoal.svg": mark(MONO_K),
  "lessora-lockup-horizontal-dark.svg": lockupH(DARK),
  "lessora-lockup-horizontal-light.svg": lockupH(LIGHT),
  "lessora-lockup-stacked-dark.svg": lockupS(DARK),
  "lessora-lockup-stacked-light.svg": lockupS(LIGHT),
  "favicon.svg": tile(DARK, 1, 2),
  "app-icon.svg": tile(DARK, 0.7, 0),
  "app-icon-maskable.svg": tile(DARK, 0.62, 0),
  "lessora-mark-enter.svg": animated("enter"),
  "lessora-mark-loading.svg": animated("loading"),
  "lessora-motion.css": MOTION_CSS,
};
for (const [f, s] of Object.entries(files)) writeFileSync(join(OUT, f), s);

const inline = (s) => s.replace(/^<svg /, "<svg ");
const enc = (s) =>
  "data:image/svg+xml;base64," + Buffer.from(s).toString("base64");
const stageMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="lessora-mark" id="hero-mark" role="img" aria-label="Lessora">\n  ${parts(DARK, true)}\n</svg>`;

const html = `<title>Lessora Brand Mark</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap">
<style>
/* Brand sheet as a ledger: one ruled band per use, the live mark first. Dark only, per DESIGN.md. */
:root {
  --ground: #26292c; --band: #2d3134; --raised: #34393d;
  --rule: #474c51; --rule-soft: #3a3f43; --rule-strong: #6b7278;
  --ink: #eceeef; --ink-body: #b0b7bc; --ink-muted: #9aa2a8;
  --cyan: #22d3ee; --light-ground: #f3f4f5; --light-rule: #d6dadd; --light-cap: #4d5459;
  --sans: Geist, "Helvetica Neue", Arial, sans-serif;
  --mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace;
  --ease-ui: cubic-bezier(.25,1,.5,1);
  color-scheme: dark;
}
* { box-sizing: border-box; }
body { background: var(--ground); color: var(--ink-body); font-family: var(--sans); font-size: 15px; line-height: 1.55; }
::selection { background: rgba(34, 211, 238, .28); color: var(--ink); }
.wrap { max-width: 1200px; margin: 0 auto; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.hero { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: clamp(24px, 5vw, 72px); align-items: center; padding-block: 56px 48px; }
.hero-stage { display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 48px 16px 28px; border: 1px solid var(--rule); }
.hero-stage svg { width: 200px; height: 200px; }
h1 { font-weight: 400; color: var(--ink); font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.04; letter-spacing: -0.03em; margin: 0 0 16px; text-wrap: balance; }
.hero p { margin: 0; max-width: 56ch; }
.hero p + p { margin-top: 10px; }
.controls { display: flex; flex-wrap: wrap; justify-content: center; border: 1px solid var(--rule); border-radius: 2px; }
.controls button { font: 500 .8125rem/1 var(--sans); color: var(--ink-body); background: transparent; border: 0; border-left: 1px solid var(--rule); padding: 10px 16px; min-height: 36px; cursor: pointer; transition: color 160ms var(--ease-ui), background-color 160ms var(--ease-ui); }
.controls button:first-child { border-left: 0; }
.controls button:hover { color: var(--ink); background: var(--raised); }
.controls button:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.controls button[aria-pressed="true"] { color: var(--ink); box-shadow: inset 0 -2px 0 var(--cyan); }
.band { border-top: 1px solid var(--rule-soft); padding-block: 40px; }
.band:nth-of-type(even) { background: var(--band); }
h2 { font-weight: 400; color: var(--ink); font-size: 1.375rem; letter-spacing: -0.015em; margin: 0 0 16px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); border: 1px solid var(--rule); }
.cell { margin: 0; display: flex; flex-direction: column; min-height: 180px; border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); min-width: 0; margin-right: -1px; margin-bottom: -1px; }
.cell .stage { flex: 1; display: grid; place-items: center; padding: 28px 20px; }
.cell figcaption { font-size: .75rem; color: var(--ink-muted); padding: 10px 14px; border-top: 1px solid var(--rule-soft); display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.cell figcaption code { font-family: var(--mono); font-size: .6875rem; }
.dark { background: var(--ground); }
.light { background: var(--light-ground); }
.light figcaption { color: var(--light-cap); border-top-color: var(--light-rule); }
.cyan { background: #0e7490; }
.cyan figcaption { color: #e6fbff; border-top-color: rgba(255,255,255,.2); }
.mk svg { width: 88px; height: 88px; }
.lk svg { width: min(100%, 240px); height: auto; }
.st svg { width: 130px; height: auto; }
.sizes { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-end; justify-content: center; }
.sizes span { display: flex; flex-direction: column; align-items: center; gap: 8px; font-family: var(--mono); font-size: .6875rem; color: var(--ink-muted); }
.sizes canvas { image-rendering: pixelated; outline: 1px solid var(--rule-soft); }
.inuse { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: center; }
.btn { display: inline-flex; align-items: center; gap: 10px; height: 46px; padding: 0 20px; border: 1px solid var(--rule-strong); border-radius: 2px; color: var(--ink); font-weight: 500; font-size: .95rem; }
.btn svg { width: 20px; height: 20px; }
.tab { display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px; background: var(--raised); border-radius: 2px 2px 0 0; font-size: .8125rem; color: var(--ink); }
.rules { margin: 0; display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 9fr); border-top: 1px solid var(--rule-soft); }
.rules dt, .rules dd { margin: 0; padding: 10px 0; border-bottom: 1px solid var(--rule-soft); }
.rules dt { color: var(--ink); }
.rules dd { max-width: 72ch; }
.rules code { font-family: var(--mono); font-size: .8125rem; color: var(--ink); }
${MOTION_CSS}
@media (max-width: 860px) { .hero { grid-template-columns: 1fr; } .rules { grid-template-columns: 1fr; } .rules dt { border-bottom: 0; padding-bottom: 0; } }
</style>

<div class="wrap hero">
  <div class="hero-stage">
    ${stageMark}
    <div class="controls" role="group" aria-label="Mark motion">
      <button type="button" data-mode="enter">Enter</button>
      <button type="button" data-mode="exit">Exit</button>
      <button type="button" data-mode="loading" aria-pressed="false">Loading</button>
    </div>
  </div>
  <div>
    <h1>Lessora: Orbit is the mark.</h1>
    <p>A map pin with a lit arc circling it: a place being searched, the moment before a building turns up. The pin is the location, the gray ring is the search, and the cyan arc is the inspection light, the one part that is ever cyan.</p>
    <p>The wordmark is Geist Medium, outlined to paths, so it renders the same everywhere without the font installed.</p>
  </div>
</div>

<section class="band"><div class="wrap">
  <h2>Mark</h2>
  <div class="grid">
    <figure class="cell dark"><div class="stage mk">${inline(files["lessora-mark-dark.svg"])}</div><figcaption>On charcoal<code>lessora-mark-dark.svg</code></figcaption></figure>
    <figure class="cell light"><div class="stage mk">${inline(files["lessora-mark-light.svg"])}</div><figcaption>On light<code>lessora-mark-light.svg</code></figcaption></figure>
    <figure class="cell cyan"><div class="stage mk">${inline(files["lessora-mark-white.svg"])}</div><figcaption>One colour, white<code>lessora-mark-white.svg</code></figcaption></figure>
    <figure class="cell light"><div class="stage mk">${inline(files["lessora-mark-charcoal.svg"])}</div><figcaption>One colour, charcoal<code>lessora-mark-charcoal.svg</code></figcaption></figure>
  </div>
</div></section>

<section class="band"><div class="wrap">
  <h2>Lockups</h2>
  <div class="grid">
    <figure class="cell dark"><div class="stage lk">${inline(files["lessora-lockup-horizontal-dark.svg"])}</div><figcaption>Horizontal<code>lessora-lockup-horizontal-dark.svg</code></figcaption></figure>
    <figure class="cell light"><div class="stage lk">${inline(files["lessora-lockup-horizontal-light.svg"])}</div><figcaption>Horizontal, light<code>lessora-lockup-horizontal-light.svg</code></figcaption></figure>
    <figure class="cell dark"><div class="stage st">${inline(files["lessora-lockup-stacked-dark.svg"])}</div><figcaption>Stacked<code>lessora-lockup-stacked-dark.svg</code></figcaption></figure>
    <figure class="cell light"><div class="stage st">${inline(files["lessora-lockup-stacked-light.svg"])}</div><figcaption>Stacked, light<code>lessora-lockup-stacked-light.svg</code></figcaption></figure>
  </div>
</div></section>

<section class="band"><div class="wrap">
  <h2>Icons and favicons</h2>
  <div class="grid">
    <figure class="cell dark"><div class="stage sizes">
      <span><img src="${enc(files["favicon.svg"])}" width="16" height="16" alt="">16</span>
      <span><img src="${enc(files["favicon.svg"])}" width="32" height="32" alt="">32</span>
      <span><canvas data-src="${enc(files["favicon.svg"])}" data-px="16" width="16" height="16" style="width:64px;height:64px" aria-label="16px favicon magnified"></canvas>16px, 4&times;</span>
    </div><figcaption>Browser tab<code>favicon.svg · favicon.ico · favicon-32.png</code></figcaption></figure>
    <figure class="cell dark"><div class="stage sizes">
      <span><img src="${enc(files["app-icon.svg"])}" width="90" height="90" alt="" style="border-radius:20px">iOS</span>
      <span><img src="${enc(files["app-icon-maskable.svg"])}" width="90" height="90" alt="" style="border-radius:50%">Android</span>
    </div><figcaption>Home screen<code>apple-touch-icon.png · icon-512-maskable.png</code></figcaption></figure>
    <figure class="cell dark"><div class="stage inuse">
      <span class="btn">${animated("loading").replace(/<style>[\s\S]*<\/style>\n/, "")}<span>Finding buildings</span></span>
      <span class="tab"><img src="${enc(files["favicon.svg"])}" width="16" height="16" alt="">Lessora</span>
    </div><figcaption>Loader in a button, tab icon<code>lessora-mark-loading.svg</code></figcaption></figure>
  </div>
</div></section>

<section class="band"><div class="wrap">
  <h2>Rules</h2>
  <dl class="rules">
    <dt>Cyan</dt><dd>Only the arc. On light grounds it becomes <code>#0e7490</code>, because <code>#22d3ee</code> is 1.6:1 there. One-colour versions drop the cyan entirely.</dd>
    <dt>Clear space</dt><dd>Keep a quarter of the mark&rsquo;s width clear on every side; the ring already reads as the edge.</dd>
    <dt>Smallest size</dt><dd>16px with the charcoal tile (favicon.svg). Without the tile, 20px.</dd>
    <dt>Motion</dt><dd>Enter: the pin drops, the ring draws, the arc lands. Exit: reverse, about 400 ms. Loading: the arc orbits the pin while it bobs. All in <code>lessora-motion.css</code>; add <code>is-enter</code>, <code>is-exit</code> or <code>is-loading</code> to an inline mark. Reduced motion holds the mark still and only dims the arc.</dd>
    <dt>Legal name</dt><dd>The company is still registered as RLPSCOUT AI LLC. Use Lessora as the brand; keep the legal name where filings, SAM.gov and contracts need it until it changes.</dd>
  </dl>
</div></section>

<script>
(() => {
  const svg = document.getElementById('hero-mark');
  const btns = document.querySelectorAll('.controls button');
  const loadBtn = document.querySelector('[data-mode="loading"]');
  let t;
  const restart = (mode) => { svg.classList.remove('is-enter', 'is-exit', 'is-loading'); void svg.getBoundingClientRect(); if (mode) svg.classList.add('is-' + mode); };
  btns.forEach((b) => b.addEventListener('click', () => {
    clearTimeout(t);
    if (b.dataset.mode === 'loading') { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); restart(on ? 'loading' : 'enter'); return; }
    loadBtn.setAttribute('aria-pressed', 'false');
    restart(b.dataset.mode);
    if (b.dataset.mode === 'exit') t = setTimeout(() => restart('enter'), 1100);
  }));
  restart('enter');
  document.querySelectorAll('canvas[data-src]').forEach((cv) => { const img = new Image(); img.onload = () => cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); img.src = cv.dataset.src; });
})();
</script>
`;
if (PAGE) writeFileSync(PAGE, html);
console.log("ok", Object.keys(files).length);
