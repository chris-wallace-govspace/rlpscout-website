import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/andrehavasi/Documents/Projects/React/rlpscout-website-logo-mockups/assets/logo-mockups/round-2";
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

// Every mark is built from separate parts so each can animate on its own:
// k 's' = stroke (drawn with pathLength=1 dashes), k 'f' = fill (scaled from its own centre).
// i = enter order. ld = only present while loading. Strokes are single subpaths because
// dash patterns restart per subpath in some engines.
const marks = [
  {
    slug: "sitefolio",
    name: "Sitefolio",
    rank: 1,
    style: "Descriptive compound",
    meaning:
      "The file kept on each site: the building and every page of evidence that it meets the requirement.",
    mark: "A folio page holding a building elevation drawn in ledger rules, its top floor checked. Refined: the fold is now one clean corner, and the floors step up like the elevation they stand for.",
    domain: "sitefolio.ai unregistered",
    screen:
      "A tiny portfolio builder called SiteFolios (plural) is on Product Hunt. Different field.",
    risk: "low",
    motion: [
      [
        "Enter",
        "The page outline draws from the fold, the fold creases, the three floors are written in from the left, then the checked floor lights.",
      ],
      ["Exit", "Floors erase top down, the page lifts away, about 400 ms."],
      [
        "Loading",
        "The floors are written in one after another and the check lights on the top floor, then the page clears and starts again. It reads as a file being filled in.",
      ],
    ],
    parts: [
      { k: "s", c: "ink", d: "M19 3H5v26h20V9", i: 0 },
      { k: "s", c: "ink", d: "M19 3l6 6", i: 1 },
      { k: "s", c: "ink", d: "M9 25h12", i: 2, cls: "row", r: 0 },
      { k: "s", c: "ink", d: "M11 19h10", i: 3, cls: "row", r: 1 },
      { k: "s", c: "ink", d: "M15 13h6", i: 4, cls: "row", r: 2 },
      { k: "f", c: "signal", rect: [9, 11, 4, 4], i: 5, cls: "chk" },
    ],
  },
  {
    slug: "keyplan",
    name: "Keyplan",
    rank: 2,
    style: "Real architecture term",
    meaning:
      "The small plan on every drawing sheet that shows which part of the building you are looking at.",
    mark: "An L-shaped floor plan split into three bays, with the bay that answers the requirement lit. Refined: a second divider makes three real bays, so the loader has somewhere to move.",
    domain: "keyplan.ai unregistered",
    screen:
      "A Dutch facility-management SaaS called Keyplan serves real estate managers. Same broad market; needs a trademark search.",
    risk: "medium",
    motion: [
      [
        "Enter",
        "The plan outline draws in one stroke, the bay dividers follow, then the matching bay fills.",
      ],
      ["Exit", "The bay empties, then the plan erases along its outline."],
      [
        "Loading",
        "The lit bay steps through all three bays of the plan in turn, like a search moving through a building.",
      ],
    ],
    parts: [
      { k: "s", c: "ink", d: "M3 3h26v14H17v12H3z", i: 0 },
      { k: "s", c: "muted", d: "M17 3v14", i: 1 },
      { k: "s", c: "muted", d: "M3 17h14", i: 1 },
      { k: "f", c: "signal", rect: [20, 6, 6, 8], i: 2, cls: "bay", b: 0 },
      { k: "f", c: "signal", rect: [6, 6, 8, 8], i: 2, cls: "bay ld", b: 1 },
      { k: "f", c: "signal", rect: [6, 20, 8, 6], i: 2, cls: "bay ld", b: 2 },
    ],
  },
  {
    slug: "cornerpin",
    name: "Cornerpin",
    rank: 3,
    style: "Real survey term",
    meaning:
      "The iron pin a surveyor sets at a property corner: the fixed point every boundary and measurement is checked from.",
    mark: "A lit pin where two boundary lines meet, with witness marks on the neighbouring lines. Closest to today’s bracket mark.",
    domain: "cornerpin.ai unregistered",
    screen:
      'No company or trademark found. "Corner pin" is also a video-effects term, a different field.',
    risk: "low",
    motion: [
      [
        "Enter",
        "The pin is set first, then both boundaries run out from it, then the witness marks appear.",
      ],
      ["Exit", "Boundaries retract into the pin, then the pin drops out."],
      [
        "Loading",
        "Square survey pings radiate from the pin while the boundaries hold still.",
      ],
    ],
    parts: [
      { k: "f", c: "signal", rect: [6, 20, 6, 6], i: 0, cls: "pin" },
      { k: "s", c: "ink", d: "M9 17V3", i: 1 },
      { k: "s", c: "ink", d: "M15 23h14", i: 1 },
      { k: "f", c: "muted", rect: [2, 22, 2, 2], i: 2 },
      { k: "f", c: "muted", rect: [8, 28, 2, 2], i: 2 },
      { k: "ring", rect: [6, 20, 6, 6], cls: "ld ring", p: 0 },
      { k: "ring", rect: [6, 20, 6, 6], cls: "ld ring", p: 1 },
    ],
  },
  {
    slug: "lessora",
    name: "Lessora",
    rank: 4,
    style: "Coined word",
    meaning:
      "Built from lessor, the party that grants the lease. Easy to say and unclaimed.",
    mark: "A premises outline with its threshold lit: the space handed over. Refined: the inner rule is gone, so the door is the only detail.",
    domain: "lessora.ai unregistered",
    screen: "No company or trademark found.",
    risk: "low",
    motion: [
      [
        "Enter",
        "Both walls draw up from the doorway and meet at the top, then the threshold lights.",
      ],
      [
        "Exit",
        "The threshold goes dark, then the walls retract back to the door.",
      ],
      [
        "Loading",
        "A short lit segment walks the perimeter of the premises, like an inspection walking the space.",
      ],
    ],
    parts: [
      { k: "s", c: "ink", d: "M13 29H3V3h13", i: 0 },
      { k: "s", c: "ink", d: "M19 29h10V3H16", i: 0 },
      { k: "s", c: "signal", d: "M13 29h6", i: 1, cls: "door" },
      { k: "run", d: "M19 29h10V3H3v26h10", cls: "ld runner" },
    ],
  },
  {
    slug: "checkline",
    name: "Checkline",
    rank: 5,
    style: "Real survey term",
    meaning:
      "In surveying, a check line is an extra line measured between two known points to prove the survey closes. That is what the product does for a building against a requirement.",
    mark: "New mark. Two survey stations joined by the traverse, and the lit check line that closes it. It replaces the checkbox rows.",
    domain: "checkline.ai unregistered",
    screen:
      "Checkline is a registered brand of Electromatic Equipment Co. for tension and torque instruments. Different goods; needs a trademark opinion.",
    risk: "medium",
    motion: [
      [
        "Enter",
        "Both stations are set, the traverse runs between them the long way round, then the check line draws straight across and closes it.",
      ],
      ["Exit", "The check line erases, then the traverse and stations clear."],
      [
        "Loading",
        "The check line draws across, holds, and erases forward on a loop, the survey being checked again and again.",
      ],
    ],
    parts: [
      { k: "f", c: "ink", rect: [3, 23, 6, 6], i: 0 },
      { k: "f", c: "ink", rect: [23, 3, 6, 6], i: 0 },
      { k: "s", c: "muted", d: "M6 20V6h14", i: 1 },
      { k: "s", c: "signal", d: "M11 21L21 11", i: 2, cls: "cl" },
    ],
  },
];

const S =
  'stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" fill="none"';

const renderParts = (m, c, { animated = false } = {}) => {
  const n =
    Math.max(...m.parts.filter((p) => p.i !== undefined).map((p) => p.i)) + 1;
  return m.parts
    .filter((p) => animated || !(p.cls || "").includes("ld"))
    .map((p) => {
      const vars = [];
      if (p.i !== undefined) vars.push(`--i:${p.i}`, `--o:${n - 1 - p.i}`);
      if (p.r !== undefined) vars.push(`--r:${p.r}`);
      if (p.b !== undefined) vars.push(`--b:${p.b}`);
      if (p.p !== undefined) vars.push(`--p:${p.p}`);
      const style = animated && vars.length ? ` style="${vars.join(";")}"` : "";
      const cls = animated
        ? ` class="${{ s: "s", f: "f", ring: "", run: "" }[p.k]} ${p.cls || ""}"`
            .replace(/\s+"/, '"')
            .replace('" ', '"')
        : "";
      if (p.k === "s")
        return `<path d="${p.d}" stroke="${c[p.c]}" ${S}${animated ? ' pathLength="1"' : ""}${cls}${style}/>`;
      if (p.k === "f") {
        const [x, y, w, h] = p.rect;
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c[p.c]}"${cls}${style}/>`;
      }
      if (p.k === "ring") {
        const [x, y, w, h] = p.rect;
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${c.signal}" stroke-width="1" vector-effect="non-scaling-stroke"${cls}${style}/>`;
      }
      if (p.k === "run")
        return `<path d="${p.d}" stroke="${c.signal}" ${S} pathLength="1"${cls}/>`;
      return "";
    })
    .join("\n  ");
};

const MOTION_CSS = `
.lm { overflow: visible; }
.lm .s { stroke-dasharray: 1 1; stroke-dashoffset: 0; }
.lm .f, .lm .ring { transform-box: fill-box; transform-origin: center; }
.lm .ld { display: none; }
.lm.is-loading .ld { display: inline; }
.lm.is-enter .s { animation: lm-draw .6s cubic-bezier(.16,1,.3,1) calc(var(--i) * .13s) both; }
.lm.is-enter .f { animation: lm-pop .42s cubic-bezier(.16,1,.3,1) calc(var(--i) * .13s + .08s) both; }
.lm.is-exit .s { animation: lm-erase .34s cubic-bezier(.5,0,.75,0) calc(var(--o) * .07s) both; }
.lm.is-exit .f { animation: lm-drop .3s cubic-bezier(.5,0,.75,0) calc(var(--o) * .07s) both; }
@keyframes lm-draw { from { stroke-dashoffset: 1; opacity: 0; } 8% { opacity: 1; } to { stroke-dashoffset: 0; opacity: 1; } }
@keyframes lm-erase { from { stroke-dashoffset: 0; opacity: 1; } 92% { opacity: 1; } to { stroke-dashoffset: -1; opacity: 0; } }
@keyframes lm-pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes lm-drop { from { transform: scale(1); opacity: 1; } to { transform: scale(0); opacity: 0; } }

.lm.is-loading .row { animation: lm-row 2s cubic-bezier(.16,1,.3,1) calc(var(--r) * .22s) infinite; }
.lm.is-loading .chk { animation: lm-chk 2s cubic-bezier(.16,1,.3,1) infinite; }
@keyframes lm-row { 0% { stroke-dashoffset: 1; opacity: 1; } 30%, 82% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes lm-chk { 0%, 52% { transform: scale(0); opacity: 1; } 62%, 82% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }

.lm.is-loading .bay { animation: lm-bay 1.8s cubic-bezier(.16,1,.3,1) calc(var(--b) * .6s) infinite both; }
@keyframes lm-bay { 0% { transform: scale(.4); opacity: 0; } 8%, 30% { transform: scale(1); opacity: 1; } 38%, 100% { transform: scale(1); opacity: 0; } }

.lm.is-loading .ring { animation: lm-ping 1.6s cubic-bezier(.16,1,.3,1) calc(var(--p) * .8s) infinite both; }
@keyframes lm-ping { from { transform: scale(1); opacity: .9; } to { transform: scale(3.4); opacity: 0; } }

.lm .runner { stroke-dasharray: .14 .86; }
.lm.is-loading .runner { animation: lm-run 1.8s linear infinite; }
.lm.is-loading .door { opacity: .35; }
@keyframes lm-run { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1; } }

.lm.is-loading .cl { animation: lm-check 1.6s cubic-bezier(.65,0,.35,1) infinite; }
@keyframes lm-check { 0% { stroke-dashoffset: 1; } 42%, 58% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -1; } }

@media (prefers-reduced-motion: reduce) {
  .lm *, .lm.is-loading * { animation: none !important; }
  .lm .ld { display: none !important; }
  .lm.is-loading [stroke="${DARK.signal}"], .lm.is-loading [fill="${DARK.signal}"] { animation: lm-breathe 1.6s ease-in-out infinite !important; }
  @keyframes lm-breathe { 50% { opacity: .35; } }
}`;

const svgStatic = (m, c, { tile = false } = {}) => {
  const bg = tile
    ? `\n  <rect width="32" height="32" rx="2" fill="${c.ground}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="${m.name}">${bg}\n  ${renderParts(m, c)}\n</svg>`;
};

const svgAnimated = (m, c, mode, { id = "", embedCss = false } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="lm ${mode ? "is-" + mode : ""}"${id ? ` id="${id}"` : ""} role="img" aria-label="${m.name}${mode === "loading" ? ", loading" : ""}">${embedCss ? `\n<style>${MOTION_CSS}\n</style>` : ""}
  ${renderParts(m, c, { animated: true })}
</svg>`;

const WORD = `font-family="Geist, 'Helvetica Neue', Arial, sans-serif" font-weight="500" letter-spacing="1.6"`;
const wordW = (m, size) => Math.ceil(m.name.length * size * 0.74);
const svgLockupH = (m, c) => {
  const w = 44 + wordW(m, 20);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 32" role="img" aria-label="${m.name}">
  <g>${renderParts(m, c)}</g>
  <text x="44" y="23" font-size="20" ${WORD} fill="${c.ink}">${m.name.toUpperCase()}</text>
</svg>`;
};
const svgLockupS = (m, c) => {
  const w = Math.max(96, wordW(m, 18) + 8);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 92" role="img" aria-label="${m.name}">
  <g transform="translate(${w / 2 - 24} 0) scale(1.5)">${renderParts(m, c)}</g>
  <text x="${w / 2}" y="86" text-anchor="middle" font-size="18" ${WORD} fill="${c.ink}">${m.name.toUpperCase()}</text>
</svg>`;
};

for (const m of marks) {
  const dir = join(OUT, m.slug);
  mkdirSync(dir, { recursive: true });
  const files = {
    "mark-dark.svg": svgStatic(m, DARK),
    "mark-light.svg": svgStatic(m, LIGHT),
    "favicon.svg": svgStatic(m, DARK, { tile: true }),
    "lockup-horizontal-dark.svg": svgLockupH(m, DARK),
    "lockup-horizontal-light.svg": svgLockupH(m, LIGHT),
    "lockup-stacked-dark.svg": svgLockupS(m, DARK),
    "lockup-stacked-light.svg": svgLockupS(m, LIGHT),
    "mark-enter.svg": svgAnimated(m, DARK, "enter", { embedCss: true }),
    "mark-loading.svg": svgAnimated(m, DARK, "loading", { embedCss: true }),
  };
  for (const [f, s] of Object.entries(files))
    writeFileSync(join(dir, f), s + "\n");
}
writeFileSync(join(OUT, "motion.css"), MOTION_CSS.trim() + "\n");

const enc = (s) =>
  "data:image/svg+xml;base64," + Buffer.from(s).toString("base64");

const card = (m) => {
  const fav = enc(svgStatic(m, DARK, { tile: true }));
  return `
<section class="dir" id="${m.slug}" aria-labelledby="${m.slug}-h"><div class="wrap">
  <header class="dir-head">
    <span class="idx">${m.rank}</span>
    <div class="dir-title">
      <h2 id="${m.slug}-h">${m.name}</h2>
      <p class="kind">${m.style}</p>
    </div>
    <dl class="facts">
      <dt>Name</dt><dd>${m.meaning}</dd>
      <dt>Mark</dt><dd>${m.mark}</dd>
      <dt>Domain</dt><dd class="mono">${m.domain}</dd>
      <dt>Conflicts</dt><dd><span class="risk risk-${m.risk}">${m.risk === "low" ? "Low" : "Check"}</span> ${m.screen}</dd>
    </dl>
  </header>
  <div class="motion">
    <div class="stage-m">
      ${svgAnimated(m, DARK, "", { id: `${m.slug}-anim` })}
      <div class="controls" role="group" aria-label="${m.name} motion">
        <button type="button" data-target="${m.slug}-anim" data-mode="enter">Enter</button>
        <button type="button" data-target="${m.slug}-anim" data-mode="exit">Exit</button>
        <button type="button" data-target="${m.slug}-anim" data-mode="loading" aria-pressed="false">Loading</button>
      </div>
    </div>
    <div class="motion-side">
      <dl class="mspec">${m.motion.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>
      <div class="inuse">
        <span class="inuse-btn">${svgAnimated(m, DARK, "loading")}<span>Matching buildings</span></span>
        <span class="inuse-tab"><img src="${fav}" width="16" height="16" alt="">${m.name}</span>
      </div>
    </div>
  </div>
  <div class="grid">
    <figure class="cell lock dark wide"><div class="stage-l">${svgLockupH(m, DARK)}</div><figcaption>Horizontal lockup on charcoal <code>#26292c</code></figcaption></figure>
    <figure class="cell hero light"><div class="stage">${svgStatic(m, LIGHT)}</div><figcaption>Mark on light</figcaption></figure>
    <figure class="cell fav dark">
      <div class="fav-row">
        <div class="fav-real"><img src="${fav}" width="16" height="16" alt=""><span>16</span></div>
        <div class="fav-real"><img src="${fav}" width="32" height="32" alt=""><span>32</span></div>
        <div class="fav-zoom"><canvas data-src="${fav}" width="16" height="16" aria-label="16px favicon magnified"></canvas><span>16px, 4&times;</span></div>
      </div>
      <figcaption>Favicon at real size</figcaption>
    </figure>
    <figure class="cell lock light"><div class="stage-l">${svgLockupH(m, LIGHT)}</div><figcaption>Horizontal lockup, light</figcaption></figure>
  </div>
  <p class="files">assets/logo-mockups/round-2/${m.slug}/ · mark-enter.svg and mark-loading.svg animate on their own</p>
</div></section>`;
};

const lineup = marks
  .map(
    (m) =>
      `<a class="pick" href="#${m.slug}"><span class="pick-mark">${svgAnimated(m, DARK, "")}</span><span class="pick-name"><b>${m.rank}</b> ${m.name}</span><span class="pick-dom">${m.slug}.ai</span></a>`,
  )
  .join("");

const html = `<title>Name and Mark Round Two</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap">
<style>
/* Ledger layout: ruled full-width bands in George's ranking; each band opens on a live motion stage. Dark only, per DESIGN.md. */
:root {
  --ground: #26292c; --band: #2d3134; --raised: #34393d;
  --rule: #474c51; --rule-soft: #3a3f43; --rule-strong: #6b7278;
  --ink: #eceeef; --ink-body: #b0b7bc; --ink-muted: #9aa2a8;
  --cyan: #22d3ee; --met: #7ee8d8; --amber: #f2b84b;
  --light-ground: #f3f4f5; --light-rule: #d6dadd; --light-cap: #4d5459;
  --sans: Geist, "Helvetica Neue", Arial, sans-serif;
  --mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace;
  --ease-ui: cubic-bezier(.25,1,.5,1);
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
.lineup { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); }
.pick { display: flex; flex-direction: column; align-items: center; gap: 6px; padding-block: 28px 18px; color: var(--ink); text-decoration: none; border-left: 1px solid var(--rule-soft); transition: background-color 160ms var(--ease-ui); }
.pick:first-child { border-left: 0; }
.pick:hover { background: var(--raised); }
.pick:focus-visible { outline: 2px solid var(--cyan); outline-offset: -2px; }
.pick-mark svg { width: 64px; height: 64px; display: block; margin-bottom: 10px; }
.pick-name { font-size: 1rem; letter-spacing: -0.01em; }
.pick-name b { font-family: var(--mono); font-weight: 400; font-size: .75rem; color: var(--ink-muted); margin-right: 4px; }
.pick-dom { font-family: var(--mono); font-size: .6875rem; color: var(--ink-muted); }
.dir { border-top: 1px solid var(--rule-soft); padding-block: 48px; }
.dir:nth-child(even) { background: var(--band); }
.dir-head { display: grid; grid-template-columns: auto minmax(0, 4fr) minmax(0, 8fr); gap: 12px clamp(16px, 3vw, 48px); align-items: start; margin-bottom: 24px; }
.idx { font-family: var(--mono); font-size: .8125rem; color: var(--ink-muted); padding-top: 10px; }
h2 { font-weight: 400; color: var(--ink); font-size: clamp(1.8rem, 3vw, 2.5rem); line-height: 1.05; letter-spacing: -0.025em; margin: 0; }
.kind { margin: 6px 0 0; font-size: .8125rem; color: var(--ink-muted); }
.facts, .mspec { margin: 0; display: grid; grid-template-columns: 84px minmax(0, 1fr); border-top: 1px solid var(--rule-soft); }
.facts dt, .facts dd, .mspec dt, .mspec dd { margin: 0; padding: 8px 0; border-bottom: 1px solid var(--rule-soft); }
.facts dt, .mspec dt { font-size: .75rem; color: var(--ink-muted); padding-top: 10px; }
.facts dd, .mspec dd { max-width: 70ch; }
.mono { font-family: var(--mono); font-size: .8125rem; color: var(--ink); }
.risk { display: inline-block; font-size: .6875rem; line-height: 1; padding: 4px 6px; border: 1px solid currentColor; border-radius: 2px; margin-right: 6px; vertical-align: 1px; }
.risk-low { color: var(--met); }
.risk-medium { color: var(--amber); }
.motion { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); border: 1px solid var(--rule); border-bottom: 0; background: var(--ground); }
.stage-m { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; padding: 40px 16px 24px; border-right: 1px solid var(--rule); min-width: 0; }
.stage-m > svg { width: 168px; height: 168px; }
.controls { display: flex; flex-wrap: wrap; justify-content: center; border: 1px solid var(--rule); border-radius: 2px; }
.controls button { font: 500 .8125rem/1 var(--sans); color: var(--ink-body); background: transparent; border: 0; border-left: 1px solid var(--rule); padding: 10px 16px; min-height: 36px; cursor: pointer; transition: color 160ms var(--ease-ui), background-color 160ms var(--ease-ui); }
.controls button:first-child { border-left: 0; }
.controls button:hover { color: var(--ink); background: var(--raised); }
.controls button:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.controls button[aria-pressed="true"] { color: var(--ink); box-shadow: inset 0 -2px 0 var(--cyan); }
.motion-side { display: flex; flex-direction: column; justify-content: space-between; gap: 24px; padding: 24px clamp(16px, 2.5vw, 32px); min-width: 0; }
.inuse { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.inuse-btn { display: inline-flex; align-items: center; gap: 10px; height: 46px; padding: 0 20px; border: 1px solid var(--rule-strong); border-radius: 2px; color: var(--ink); font-weight: 500; font-size: .95rem; }
.inuse-btn svg { width: 20px; height: 20px; }
.inuse-tab { display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px; background: var(--raised); border-radius: 2px 2px 0 0; font-size: .8125rem; color: var(--ink-lede, var(--ink)); }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--rule); }
.cell { margin: 0; display: flex; flex-direction: column; justify-content: space-between; min-height: 190px; border-right: 1px solid var(--rule); min-width: 0; }
.cell.wide { grid-column: 1 / -1; min-height: 170px; border-right: 0; border-bottom: 1px solid var(--rule); }
.cell:last-child { border-right: 0; }
.cell.dark { background: var(--ground); }
.cell.light { background: var(--light-ground); }
.cell.light figcaption { color: var(--light-cap); border-top-color: var(--light-rule); }
.cell figcaption { font-size: .75rem; color: var(--ink-muted); padding: 10px 14px; border-top: 1px solid var(--rule-soft); }
.cell code { font-family: var(--mono); font-size: .7rem; }
.stage, .stage-l { flex: 1; display: grid; place-items: center; padding: 28px 16px; }
.stage svg { width: 96px; height: 96px; }
.wide .stage-l svg { width: min(100%, 420px); height: auto; }
.stage-l svg { width: min(100%, 250px); height: auto; }
.fav-row { flex: 1; display: flex; flex-wrap: wrap; gap: 22px; align-items: center; justify-content: center; padding: 24px 14px; }
.fav-real, .fav-zoom { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.fav-real span, .fav-zoom span { font-family: var(--mono); font-size: .6875rem; color: var(--ink-muted); }
.fav-zoom canvas { width: 64px; height: 64px; image-rendering: pixelated; outline: 1px solid var(--rule-soft); }
.files { margin: 12px 0 0; font-family: var(--mono); font-size: .75rem; color: var(--ink-muted); }
footer { border-top: 1px solid var(--rule-soft); padding-block: 32px 56px; font-size: .8125rem; color: var(--ink-muted); }
footer p { margin: 0; max-width: 78ch; }
footer p + p { margin-top: 8px; }
${MOTION_CSS}
@media (max-width: 900px) {
  .intro { grid-template-columns: 1fr; }
  .lineup { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .pick:nth-child(4) { border-left: 0; }
  .pick:nth-child(n+4) { border-top: 1px solid var(--rule-soft); }
  .dir-head { grid-template-columns: auto minmax(0, 1fr); }
  .facts { grid-column: 1 / -1; }
  .motion { grid-template-columns: 1fr; }
  .stage-m { border-right: 0; border-bottom: 1px solid var(--rule); }
}
@media (max-width: 640px) {
  .lineup { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pick, .pick:nth-child(4) { border-left: 1px solid var(--rule-soft); }
  .pick:nth-child(odd) { border-left: 0; }
  .pick:nth-child(n+3) { border-top: 1px solid var(--rule-soft); }
  .grid { grid-template-columns: 1fr; }
  .cell { border-right: 0; border-bottom: 1px solid var(--rule); }
  .cell:last-child { border-bottom: 0; }
  .facts, .mspec { grid-template-columns: 72px minmax(0, 1fr); }
}
</style>

<div class="wrap intro">
  <h1>Five names in George&rsquo;s order, with marks built to move.</h1>
  <div>
    <p>Each mark is made of separate rules and blocks, so it can draw itself in, clear itself away, and run as a loader without a second drawing. Checkline has a new mark. Sightrule is out.</p>
    <p>Motion follows DESIGN.md: arrivals on the long ease-out, exits fast, cyan only on what is being checked. With reduced motion turned on, the mark stays still and the loader only dims its cyan part.</p>
  </div>
</div>

<div class="lineup-band"><div class="wrap"><nav class="lineup" aria-label="Names">${lineup}</nav></div></div>

${marks.map(card).join("")}

<footer><div class="wrap">
  <p>Every animation is plain CSS on the SVG parts (stroke dashes with pathLength 1, and scale from each block's centre), shared in round-2/motion.css. The same file drives the website, the app and the standalone mark-enter.svg and mark-loading.svg, with no animation library.</p>
  <p>Domains checked by DNS and the .ai WHOIS on 20 November 2026; nothing reserved. Conflict notes come from a web search only. The chosen name needs a USPTO search in classes 36 and 42 before use.</p>
</div></footer>

<script>
(() => {
  const restart = (svg, mode) => {
    svg.classList.remove('is-enter', 'is-exit', 'is-loading');
    void svg.getBoundingClientRect();
    if (mode) svg.classList.add('is-' + mode);
  };
  const timers = new WeakMap();
  document.querySelectorAll('.controls button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const svg = document.getElementById(btn.dataset.target);
      const group = btn.parentElement;
      const loadBtn = group.querySelector('[data-mode="loading"]');
      clearTimeout(timers.get(svg));
      if (btn.dataset.mode === 'loading') {
        const on = btn.getAttribute('aria-pressed') !== 'true';
        btn.setAttribute('aria-pressed', String(on));
        restart(svg, on ? 'loading' : 'enter');
        return;
      }
      loadBtn.setAttribute('aria-pressed', 'false');
      restart(svg, btn.dataset.mode);
      if (btn.dataset.mode === 'exit') timers.set(svg, setTimeout(() => restart(svg, 'enter'), 1100));
    });
  });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { restart(e.target, 'enter'); io.unobserve(e.target); } });
  }, { threshold: 0.6 }) : null;
  if (io) document.querySelectorAll('.stage-m > svg, .pick-mark svg').forEach((s) => io.observe(s));
  document.querySelectorAll('canvas[data-src]').forEach((cv) => {
    const img = new Image();
    img.onload = () => cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
    img.src = cv.dataset.src;
  });
})();
</script>
`;

writeFileSync(PAGE, html);
console.log("ok", marks.length);
