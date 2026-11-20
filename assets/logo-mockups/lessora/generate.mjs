import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/andrehavasi/Documents/Projects/React/rlpscout-website-logo-mockups/assets/logo-mockups/lessora";
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

const PIN = (cx, top, r) => {
  const cy = top + r;
  const tip = cy + r * 1.9;
  const dx = (r * 0.87).toFixed(2);
  const ly = (cy + r * 0.5).toFixed(2);
  const h = (r * 0.4).toFixed(2);
  return `M${cx} ${tip}L${cx - dx} ${ly}A${r} ${r} 0 1 1 ${cx + +dx} ${ly}ZM${cx} ${(cy - h).toFixed(2)}a${h} ${h} 0 1 0 0 ${(2 * h).toFixed(2)}a${h} ${h} 0 1 0 0 -${(2 * h).toFixed(2)}Z`;
};

// Parts: k 's' stroke path (drawn with pathLength=1), 'f' rect fill, 'fp' path fill, 'c' circle fill,
// 'ring' square ping (loader only). i = enter order. cls adds motion roles. ld = loader-only.
const marks = [
  {
    slug: "threshold",
    name: "Threshold",
    tag: "Round two, for reference",
    why: "A premises outline with its doorway lit: the space a lessor hands over.",
    motion: [
      [
        "Enter",
        "Both walls rise from the doorway and meet at the top; the threshold lights.",
      ],
      [
        "Loading",
        "A lit segment walks the perimeter, like an inspection walking the space.",
      ],
    ],
    parts: [
      { k: "s", c: "ink", d: "M13 29H3V3h13", i: 0 },
      { k: "s", c: "ink", d: "M19 29h10V3H16", i: 0 },
      { k: "s", c: "signal", d: "M13 29h6", i: 1, cls: "door" },
      { k: "run", d: "M19 29h10V3H3v26h10", cls: "ld runner" },
    ],
    css: `.lm-threshold .runner { stroke-dasharray: .14 .86; }
.lm-threshold.is-loading .runner { animation: lm-run 1.8s linear infinite; }
.lm-threshold.is-loading .door { opacity: .35; }`,
  },
  {
    slug: "orbit",
    name: "Orbit",
    tag: "Pin, circled",
    why: "A map pin with a lit arc circling it: a location being searched around, the moment before a building turns up.",
    motion: [
      [
        "Enter",
        "The pin drops onto the spot, the search circle draws around it, then the lit arc takes its place on the ring.",
      ],
      [
        "Loading",
        "The lit arc orbits the pin continuously. It is the loader most people will read as searching.",
      ],
    ],
    parts: [
      { k: "fp", c: "ink", d: PIN(16, 7, 5), i: 0, cls: "drop" },
      {
        k: "s",
        c: "muted",
        d: "M16 3a13 13 0 1 1 0 26a13 13 0 1 1 0-26",
        i: 1,
        cls: "thin",
      },
      { k: "s", c: "signal", d: "M16 3a13 13 0 0 1 13 13", i: 2, cls: "orb" },
    ],
    css: `.lm-orbit .orb { transform-box: view-box; transform-origin: 16px 16px; }
.lm-orbit.is-loading .orb { animation: lm-spin 1.4s cubic-bezier(.45,.05,.55,.95) infinite; }
.lm-orbit.is-loading .drop { animation: lm-bob 1.4s cubic-bezier(.45,.05,.55,.95) infinite; }`,
  },
  {
    slug: "match-found",
    name: "Match Found",
    tag: "Highlight around a box",
    why: "Three buildings side by side, with inspection brackets locked around the one that matches the requirement.",
    motion: [
      [
        "Enter",
        "The three buildings rise, then the brackets snap around the match.",
      ],
      [
        "Loading",
        "The brackets step from building to building, framing each in turn, the way the product checks one building after another.",
      ],
    ],
    parts: [
      { k: "f", c: "muted", rect: [4, 15, 6, 11], i: 0, cls: "rise" },
      { k: "f", c: "ink", rect: [13, 10, 6, 16], i: 0, cls: "rise" },
      { k: "f", c: "muted", rect: [22, 18, 6, 8], i: 0, cls: "rise" },
      { k: "s", c: "signal", d: "M11 9V5h3", i: 1, cls: "brk" },
      { k: "s", c: "signal", d: "M18 5h3v4", i: 1, cls: "brk" },
      { k: "s", c: "signal", d: "M21 25v4h-3", i: 1, cls: "brk" },
      { k: "s", c: "signal", d: "M14 29h-3v-4", i: 1, cls: "brk" },
    ],
    css: `.lm-match-found.is-enter .brk { animation: lm-snap .5s cubic-bezier(.16,1,.3,1) calc(var(--i) * .13s + .1s) both; }
.lm-match-found.is-loading .brk { animation: lm-scan 2.4s cubic-bezier(.65,0,.35,1) infinite; }`,
  },
  {
    slug: "pin-drop",
    name: "Pin Drop",
    tag: "Pin on the building",
    why: "A pin set on the roof of a building: this address answers the lease. Map vocabulary anyone reads at a glance.",
    motion: [
      [
        "Enter",
        "The building outline draws, then the pin drops onto its roof.",
      ],
      [
        "Loading",
        "The pin bobs above the roof while square pings radiate from the building.",
      ],
    ],
    parts: [
      { k: "s", c: "ink", d: "M7 29V19h8v-4h10v14z", i: 0 },
      { k: "fp", c: "signal", d: PIN(20, 2, 4), i: 1, cls: "drop" },
      { k: "ring", rect: [7, 15, 18, 14], cls: "ld ring", p: 0 },
      { k: "ring", rect: [7, 15, 18, 14], cls: "ld ring", p: 1 },
    ],
    css: `.lm-pin-drop.is-loading .drop { animation: lm-bob 1.2s cubic-bezier(.45,.05,.55,.95) infinite; }
.lm-pin-drop.is-loading .ring { animation: lm-ping-soft 1.6s cubic-bezier(.16,1,.3,1) calc(var(--p) * .8s) infinite both; }`,
  },
  {
    slug: "radius",
    name: "Radius",
    tag: "Circles from a pin",
    why: "Search circles around a point on the map, with the building on the edge of the search lit as the match: the delineated area, then the find.",
    motion: [
      [
        "Enter",
        "The point lights, the two circles draw around it, then the building on the edge and its highlight appear.",
      ],
      [
        "Loading",
        "The rings pulse outward in sequence and the building’s highlight flashes each time the wave reaches it.",
      ],
    ],
    parts: [
      { k: "c", c: "signal", cx: 14, cy: 18, r: 3, i: 0 },
      {
        k: "s",
        c: "muted",
        d: "M14 11a7 7 0 1 1 0 14a7 7 0 1 1 0-14",
        i: 1,
        cls: "wave",
        w: 0,
      },
      {
        k: "s",
        c: "muted",
        d: "M14 6a12 12 0 1 1 0 24a12 12 0 1 1 0-24",
        i: 2,
        cls: "wave",
        w: 1,
      },
      { k: "f", c: "ink", rect: [24, 4, 4, 4], i: 3 },
      { k: "s", c: "signal", d: "M22 2h8v8h-8z", i: 3, cls: "hit" },
    ],
    css: `.lm-radius.is-loading .wave { animation: lm-wave 1.8s ease-in-out calc(var(--w) * .3s) infinite; }
.lm-radius.is-loading .hit { animation: lm-hit 1.8s ease-in-out infinite; }`,
  },
  {
    slug: "l-threshold",
    name: "L Threshold",
    tag: "Monogram",
    why: "The L of Lessora drawn as a wall and floor, ending at a lit square threshold. Now that the name is settled, the letter can carry the mark; it is the boldest at favicon size.",
    motion: [
      [
        "Enter",
        "The wall grows down, the floor runs out along the ground, then the threshold square lights.",
      ],
      [
        "Loading",
        "The threshold breathes and sends out square pings, a door waiting to open.",
      ],
    ],
    parts: [
      { k: "f", c: "ink", rect: [5, 3, 6, 26], i: 0, cls: "gy" },
      { k: "f", c: "ink", rect: [5, 23, 16, 6], i: 1, cls: "gx" },
      { k: "f", c: "signal", rect: [23, 23, 6, 6], i: 2, cls: "key" },
      { k: "ring", rect: [23, 23, 6, 6], cls: "ld ring", p: 0 },
      { k: "ring", rect: [23, 23, 6, 6], cls: "ld ring", p: 1 },
    ],
    css: `.lm-l-threshold.is-loading .key { animation: lm-breathe-s 1.6s ease-in-out infinite; }
.lm-l-threshold.is-loading .ring { animation: lm-ping 1.6s cubic-bezier(.16,1,.3,1) calc(var(--p) * .8s) infinite both; }`,
  },
];

const S =
  'stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" fill="none"';

const renderParts = (m, c, { animated = false } = {}) => {
  const ordered = m.parts.filter((p) => p.i !== undefined);
  const n = Math.max(...ordered.map((p) => p.i)) + 1;
  const kindCls = { s: "s", f: "f", fp: "f", c: "f", ring: "ring", run: "" };
  return m.parts
    .filter((p) => animated || !(p.cls || "").includes("ld"))
    .map((p) => {
      const vars = [];
      if (p.i !== undefined) vars.push(`--i:${p.i}`, `--o:${n - 1 - p.i}`);
      for (const key of ["p", "w"])
        if (p[key] !== undefined) vars.push(`--${key}:${p[key]}`);
      const style = animated && vars.length ? ` style="${vars.join(";")}"` : "";
      const classes = [kindCls[p.k], ...(p.cls || "").split(" ")]
        .filter(Boolean)
        .join(" ");
      const cls = animated && classes ? ` class="${classes}"` : "";
      const pl = animated ? ' pathLength="1"' : "";
      switch (p.k) {
        case "s":
          return `<path d="${p.d}" stroke="${c[p.c]}" ${S}${pl}${cls}${style}/>`;
        case "f": {
          const [x, y, w, h] = p.rect;
          return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c[p.c]}"${cls}${style}/>`;
        }
        case "fp":
          return `<path d="${p.d}" fill="${c[p.c]}" fill-rule="evenodd"${cls}${style}/>`;
        case "c":
          return `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${c[p.c]}"${cls}${style}/>`;
        case "ring": {
          const [x, y, w, h] = p.rect;
          return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${c.signal}" stroke-width="1" vector-effect="non-scaling-stroke"${cls}${style}/>`;
        }
        case "run":
          return `<path d="${p.d}" stroke="${c.signal}" ${S}${pl}${cls}/>`;
      }
      return "";
    })
    .join("\n  ");
};

const BASE_CSS = `
.lm { overflow: visible; }
.lm .s { stroke-dasharray: 1 1; stroke-dashoffset: 0; }
.lm .f, .lm .ring, .lm .brk { transform-box: fill-box; transform-origin: center; }
.lm .rise { transform-origin: center bottom; }
.lm .gy { transform-origin: center top; }
.lm .gx { transform-origin: left center; }
.lm .ld { display: none; }
.lm.is-loading .ld { display: inline; }
.lm.is-enter .s { animation: lm-draw .6s cubic-bezier(.16,1,.3,1) calc(var(--i) * .14s) both; }
.lm.is-enter .f { animation: lm-pop .45s cubic-bezier(.16,1,.3,1) calc(var(--i) * .14s + .08s) both; }
.lm.is-enter .rise { animation: lm-rise .55s cubic-bezier(.16,1,.3,1) calc(var(--i) * .14s) both; }
.lm.is-enter .gy { animation: lm-gy .55s cubic-bezier(.16,1,.3,1) calc(var(--i) * .14s) both; }
.lm.is-enter .gx { animation: lm-gx .5s cubic-bezier(.16,1,.3,1) calc(var(--i) * .14s) both; }
.lm.is-enter .drop { animation: lm-dropin .6s cubic-bezier(.16,1,.3,1) calc(var(--i) * .14s) both; }
.lm.is-exit .s { animation: lm-erase .34s cubic-bezier(.5,0,.75,0) calc(var(--o) * .07s) both; }
.lm.is-exit .f { animation: lm-out .3s cubic-bezier(.5,0,.75,0) calc(var(--o) * .07s) both; }
.lm.is-exit .drop { animation: lm-lift .32s cubic-bezier(.5,0,.75,0) calc(var(--o) * .07s) both; }
@keyframes lm-draw { from { stroke-dashoffset: 1; opacity: 0; } 8% { opacity: 1; } to { stroke-dashoffset: 0; opacity: 1; } }
@keyframes lm-erase { from { stroke-dashoffset: 0; opacity: 1; } 92% { opacity: 1; } to { stroke-dashoffset: -1; opacity: 0; } }
@keyframes lm-pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes lm-out { from { transform: scale(1); opacity: 1; } to { transform: scale(0); opacity: 0; } }
@keyframes lm-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes lm-gy { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes lm-gx { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes lm-dropin { from { transform: translateY(-9px); opacity: 0; } 40% { opacity: 1; } to { transform: translateY(0); opacity: 1; } }
@keyframes lm-lift { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-9px); opacity: 0; } }
@keyframes lm-snap { from { transform: scale(1.6); opacity: 0; stroke-dashoffset: 0; } to { transform: scale(1); opacity: 1; stroke-dashoffset: 0; } }
@keyframes lm-run { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1; } }
@keyframes lm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes lm-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
@keyframes lm-ping { from { transform: scale(1); opacity: .9; } to { transform: scale(3.2); opacity: 0; } }
@keyframes lm-ping-soft { from { transform: scale(1); opacity: .8; } to { transform: scale(1.45); opacity: 0; } }
@keyframes lm-scan { 0%, 27% { transform: translateX(-9px); } 33%, 60% { transform: translateX(0); } 66%, 93% { transform: translateX(9px); } 100% { transform: translateX(-9px); } }
@keyframes lm-wave { 0%, 100% { opacity: .25; } 30% { opacity: 1; stroke: #22d3ee; } 60% { opacity: .25; } }
@keyframes lm-hit { 0%, 45% { opacity: .2; } 60%, 80% { opacity: 1; } 100% { opacity: .2; } }
@keyframes lm-breathe-s { 0%, 100% { transform: scale(1); } 50% { transform: scale(.7); } }
@keyframes lm-breathe { 50% { opacity: .35; } }`;

const REDUCED = `
@media (prefers-reduced-motion: reduce) {
  .lm *, .lm.is-loading * { animation: none !important; }
  .lm .ld { display: none !important; }
  .lm.is-loading [stroke="${DARK.signal}"], .lm.is-loading [fill="${DARK.signal}"] { animation: lm-breathe 1.6s ease-in-out infinite !important; }
}`;

const MOTION_CSS =
  BASE_CSS + "\n" + marks.map((m) => m.css).join("\n") + REDUCED;

const svgStatic = (m, c, { tile = false } = {}) => {
  const bg = tile
    ? `\n  <rect width="32" height="32" rx="2" fill="${c.ground}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Lessora">${bg}\n  ${renderParts(m, c)}\n</svg>`;
};

const svgAnimated = (m, c, mode, { id = "", embedCss = false } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="lm lm-${m.slug}${mode ? " is-" + mode : ""}"${id ? ` id="${id}"` : ""} role="img" aria-label="Lessora${mode === "loading" ? ", loading" : ""}">${embedCss ? `\n<style>${BASE_CSS}\n${m.css}${REDUCED}\n</style>` : ""}
  ${renderParts(m, c, { animated: true })}
</svg>`;

const WORD = `font-family="Geist, 'Helvetica Neue', Arial, sans-serif" font-weight="500"`;
const svgLockupH = (
  m,
  c,
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 146 32" role="img" aria-label="Lessora">
  <g>${renderParts(m, c)}</g>
  <text x="44" y="24" font-size="25" letter-spacing="-0.6" ${WORD} fill="${c.ink}">Lessora</text>
</svg>`;
const svgLockupS = (
  m,
  c,
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 92" role="img" aria-label="Lessora">
  <g transform="translate(36 0) scale(1.5)">${renderParts(m, c)}</g>
  <text x="60" y="86" text-anchor="middle" font-size="22" letter-spacing="-0.5" ${WORD} fill="${c.ink}">Lessora</text>
</svg>`;

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
const letter = (i) => String.fromCharCode(65 + i);

const card = (m, i) => {
  const fav = enc(svgStatic(m, DARK, { tile: true }));
  return `
<section class="dir" id="${m.slug}" aria-labelledby="${m.slug}-h"><div class="wrap">
  <header class="dir-head">
    <span class="idx">${letter(i)}</span>
    <div class="dir-title">
      <h2 id="${m.slug}-h">${m.name}</h2>
      <p class="kind">${m.tag}</p>
    </div>
    <dl class="facts">
      <dt>Why</dt><dd>${m.why}</dd>
      ${m.motion.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("")}
      <dt>Exit</dt><dd>Parts leave in reverse order, fast, in about 400 ms.</dd>
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
    <div class="usage">
      <div class="use use-lock dark">${svgLockupH(m, DARK)}</div>
      <div class="use use-lock light">${svgLockupH(m, LIGHT)}</div>
      <div class="use use-small dark">
        <span class="inuse-btn">${svgAnimated(m, DARK, "loading")}<span>Finding buildings</span></span>
        <span class="inuse-tab"><img src="${fav}" width="16" height="16" alt="">Lessora</span>
        <span class="fav-zoom"><canvas data-src="${fav}" width="16" height="16" aria-label="16px favicon magnified"></canvas><span>16px, 4&times;</span></span>
      </div>
      <div class="use use-stack light">${svgLockupS(m, LIGHT)}<span class="mark-l">${svgStatic(m, LIGHT)}</span></div>
    </div>
  </div>
  <p class="files">assets/logo-mockups/lessora/${m.slug}/</p>
</div></section>`;
};

const lineup = marks
  .map(
    (m, i) =>
      `<a class="pick" href="#${m.slug}"><span class="pick-mark">${svgAnimated(m, DARK, "")}</span><span class="pick-name"><b>${letter(i)}</b> ${m.name}</span></a>`,
  )
  .join("");

const html = `<title>Lessora Marks</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap">
<style>
/* Ledger layout: ruled bands, one per mark, each opening on a live motion stage beside real usage. Dark only, per DESIGN.md. */
:root {
  --ground: #26292c; --band: #2d3134; --raised: #34393d;
  --rule: #474c51; --rule-soft: #3a3f43; --rule-strong: #6b7278;
  --ink: #eceeef; --ink-body: #b0b7bc; --ink-muted: #9aa2a8;
  --cyan: #22d3ee;
  --light-ground: #f3f4f5; --light-rule: #d6dadd;
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
.lineup { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); }
.pick { display: flex; flex-direction: column; align-items: center; gap: 6px; padding-block: 28px 18px; color: var(--ink); text-decoration: none; border-left: 1px solid var(--rule-soft); transition: background-color 160ms var(--ease-ui); }
.pick:first-child { border-left: 0; }
.pick:hover { background: var(--raised); }
.pick:focus-visible { outline: 2px solid var(--cyan); outline-offset: -2px; }
.pick-mark svg { width: 64px; height: 64px; display: block; margin-bottom: 10px; }
.pick-name { font-size: .9375rem; }
.pick-name b { font-family: var(--mono); font-weight: 400; font-size: .75rem; color: var(--ink-muted); margin-right: 4px; }
.dir { border-top: 1px solid var(--rule-soft); padding-block: 48px; }
.dir:nth-child(even) { background: var(--band); }
.dir-head { display: grid; grid-template-columns: auto minmax(0, 4fr) minmax(0, 8fr); gap: 12px clamp(16px, 3vw, 48px); align-items: start; margin-bottom: 24px; }
.idx { font-family: var(--mono); font-size: .8125rem; color: var(--ink-muted); padding-top: 10px; }
h2 { font-weight: 400; color: var(--ink); font-size: clamp(1.8rem, 3vw, 2.5rem); line-height: 1.05; letter-spacing: -0.025em; margin: 0; }
.kind { margin: 6px 0 0; font-size: .8125rem; color: var(--ink-muted); }
.facts { margin: 0; display: grid; grid-template-columns: 76px minmax(0, 1fr); border-top: 1px solid var(--rule-soft); }
.facts dt, .facts dd { margin: 0; padding: 8px 0; border-bottom: 1px solid var(--rule-soft); }
.facts dt { font-size: .75rem; color: var(--ink-muted); padding-top: 10px; }
.facts dd { max-width: 70ch; }
.motion { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); border: 1px solid var(--rule); background: var(--ground); }
.stage-m { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; padding: 44px 16px 24px; border-right: 1px solid var(--rule); min-width: 0; }
.stage-m > svg { width: 176px; height: 176px; }
.controls { display: flex; flex-wrap: wrap; justify-content: center; border: 1px solid var(--rule); border-radius: 2px; }
.controls button { font: 500 .8125rem/1 var(--sans); color: var(--ink-body); background: transparent; border: 0; border-left: 1px solid var(--rule); padding: 10px 16px; min-height: 36px; cursor: pointer; transition: color 160ms var(--ease-ui), background-color 160ms var(--ease-ui); }
.controls button:first-child { border-left: 0; }
.controls button:hover { color: var(--ink); background: var(--raised); }
.controls button:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.controls button[aria-pressed="true"] { color: var(--ink); box-shadow: inset 0 -2px 0 var(--cyan); }
.usage { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); min-width: 0; }
.use { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; padding: 28px 20px; min-height: 150px; min-width: 0; border-bottom: 1px solid var(--rule); }
.use:nth-child(odd) { border-right: 1px solid var(--rule); }
.use:nth-child(n+3) { border-bottom: 0; }
.use.dark { background: var(--ground); }
.use.light { background: var(--light-ground); }
.use-lock svg { width: min(100%, 200px); height: auto; }
.use-stack svg { width: 96px; height: auto; }
.use-stack .mark-l svg { width: 44px; height: 44px; }
.inuse-btn { display: inline-flex; align-items: center; gap: 10px; height: 46px; padding: 0 18px; border: 1px solid var(--rule-strong); border-radius: 2px; color: var(--ink); font-weight: 500; font-size: .95rem; }
.inuse-btn svg { width: 20px; height: 20px; }
.inuse-tab { display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px; background: var(--raised); border-radius: 2px 2px 0 0; font-size: .8125rem; color: var(--ink); }
.fav-zoom { display: inline-flex; flex-direction: column; align-items: center; gap: 6px; }
.fav-zoom span { font-family: var(--mono); font-size: .6875rem; color: var(--ink-muted); }
.fav-zoom canvas { width: 64px; height: 64px; image-rendering: pixelated; outline: 1px solid var(--rule-soft); }
.files { margin: 12px 0 0; font-family: var(--mono); font-size: .75rem; color: var(--ink-muted); }
footer { border-top: 1px solid var(--rule-soft); padding-block: 32px 56px; font-size: .8125rem; color: var(--ink-muted); }
footer p { margin: 0; max-width: 78ch; }
footer p + p { margin-top: 8px; }
${MOTION_CSS}
@media (max-width: 960px) {
  .intro { grid-template-columns: 1fr; }
  .lineup { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .pick:nth-child(4) { border-left: 0; }
  .pick:nth-child(n+4) { border-top: 1px solid var(--rule-soft); }
  .dir-head { grid-template-columns: auto minmax(0, 1fr); }
  .facts { grid-column: 1 / -1; }
  .motion { grid-template-columns: 1fr; }
  .stage-m { border-right: 0; border-bottom: 1px solid var(--rule); }
}
@media (max-width: 600px) {
  .lineup { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pick, .pick:nth-child(4) { border-left: 1px solid var(--rule-soft); }
  .pick:nth-child(odd) { border-left: 0; }
  .pick:nth-child(n+3) { border-top: 1px solid var(--rule-soft); }
  .usage { grid-template-columns: 1fr; }
  .use, .use:nth-child(odd) { border-right: 0; border-bottom: 1px solid var(--rule); }
  .use:last-child { border-bottom: 0; }
  .facts { grid-template-columns: 64px minmax(0, 1fr); }
}
</style>

<div class="wrap intro">
  <h1>Lessora: five new marks, each built to move.</h1>
  <div>
    <p>Pins and circles for finding a place, brackets and highlights for finding the building, and one monogram now that the name is settled. Round two&rsquo;s threshold mark leads for comparison.</p>
    <p>Every mark draws in, clears away and runs as a loader from the same parts. Cyan stays on the one thing being searched or matched. With reduced motion, the marks stay still and the loader only dims its cyan part.</p>
  </div>
</div>

<div class="lineup-band"><div class="wrap"><nav class="lineup" aria-label="Lessora marks">${lineup}</nav></div></div>

${marks.map(card).join("")}

<footer><div class="wrap">
  <p>All motion is plain CSS on the SVG parts and lives in lessora/motion.css; mark-enter.svg and mark-loading.svg in each folder animate on their own. Wordmark is Geist 500 in sentence case, set as live text until a mark is chosen.</p>
  <p>lessora.ai was unregistered when checked on 20 November 2026 and is not reserved yet.</p>
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
      const loadBtn = btn.parentElement.querySelector('[data-mode="loading"]');
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
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { restart(e.target, 'enter'); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll('.stage-m > svg, .pick-mark svg').forEach((s) => io.observe(s));
  }
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
