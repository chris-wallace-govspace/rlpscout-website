/* RLPSCOUT hero: skyline scan with delineated-area requirement checks.
   Static scene is pre-rendered once per resize; each frame only draws overlays. */
(() => {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  const hero = canvas.closest('.hero');
  const ctx = canvas.getContext('2d', { alpha: false });
  const hud = {
    count: document.querySelector('[data-hud="count"]'),
    timer: document.querySelector('[data-hud="timer"]'),
    status: document.querySelector('[data-hud="status"]'),
  };
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

  const COL = {
    cyan: '#22d3ee',
    teal: '#14b8a6',
    warn: '#f2b84b',
    grey: '#8d959b',
    tagBg: 'rgba(28, 31, 34, 0.9)',
    ink: '#e6f6f9',
  };

  // Cycle timing (seconds)
  const SCAN_START = 0.6;
  const SCAN_END = 10.4;
  const MATCH_END = 12.8;
  const CYCLE = 14.2;

  let W = 0, H = 0, dpr = 1;
  let bg = null;
  let scene = null;
  let t = 0, last = 0, raf = 0;
  let visible = true;
  let hudCache = { count: '', timer: '', status: '' };

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = (p) => 1 - Math.pow(1 - p, 3);
  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  const fmt = (n) => n.toLocaleString('en-US');

  /* ---------- Scene construction ---------- */
  function build() {
    const rect = hero.getBoundingClientRect();
    W = Math.max(320, Math.round(rect.width));
    H = Math.max(480, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (W * H * dpr * dpr > 5_000_000) dpr = Math.max(1, Math.sqrt(5_000_000 / (W * H)));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const mobile = W < 700;
    const tablet = W < 1000;
    // Narrow screens: skyline gets its own band above the copy (matches .hero-inner padding in CSS)
    const groundY = mobile ? 380 : tablet ? 430 : Math.round(H * 0.84);
    const topLimit = mobile ? 168 : 150;
    const avail = groundY - topLimit;
    const scale = clamp(W / 1440, 0.55, 1.15);
    const rand = rng(531120);

    const da = mobile
      ? { x0: W * 0.14, x1: W * 0.88 }
      : tablet ? { x0: W * 0.3, x1: W * 0.86 } : { x0: W * 0.47, x1: W * 0.93 };
    const vpX = W * 0.62;

    // Far layer (context only, not evaluated)
    const far = [];
    for (let x = -20; x < W + 20;) {
      const w = (28 + rand() * 60) * scale;
      const h = avail * (0.18 + rand() * 0.42);
      far.push({ x, w, h });
      x += w + rand() * 4;
    }

    // Near layer (evaluated)
    const near = [];
    let x = -10 + rand() * 20;
    let idSeed = 1000 + Math.floor(rand() * 400);
    while (x < W - 20) {
      const w = (52 + rand() * 78) * scale;
      const tall = rand() < 0.22;
      const h = avail * (tall ? 0.72 + rand() * 0.28 : 0.3 + rand() * 0.42);
      const b = {
        x, w, h, y: groundY - h,
        setback: rand() < 0.38 ? 0.12 + rand() * 0.14 : 0,
        setbackH: 0.12 + rand() * 0.18,
        antenna: rand() < 0.22,
        id: 'BLDG-' + String((idSeed += 7 + Math.floor(rand() * 90))).padStart(4, '0'),
        aboa: Math.round((9000 + rand() * 52000) / 10) * 10,
        parking: 20 + Math.floor(rand() * 60),
        page: 6 + Math.floor(rand() * 30),
      };
      b.cx = x + w / 2;
      b.inside = b.cx > da.x0 && b.cx < da.x1;
      near.push(b);
      x += w + (6 + rand() * 22) * scale;
    }

    // Acquisition times as the scan line passes each building centre
    near.forEach((b) => {
      b.ta = SCAN_START + ((b.cx + 40) / (W + 80)) * (SCAN_END - SCAN_START);
    });

    // Tag assignment: three detailed checks spread through the delineated area
    const inside = near.filter((b) => b.inside);
    const fulls = [];
    if (inside.length >= 3) {
      const picks = (tablet ? [0.15, 0.85] : [0.2, 0.52, 0.84]).map((f) => inside[Math.min(inside.length - 1, Math.floor(f * inside.length))]);
      [...new Set(picks)].forEach((b) => fulls.push(b));
    } else {
      inside.forEach((b) => fulls.push(b));
    }
    fulls.forEach((b, i) => {
      b.tag = 'full';
      b.fail = fulls.length > 1 && i === (tablet ? 0 : 1); // one candidate fails the floodplain line
      b.req = { aboa: Math.round(b.aboa * (0.9 + rand() * 0.05) / 10) * 10, parking: b.parking - 2 - Math.floor(rand() * 6) };
    });
    const tagW = tablet ? 174 : 214;
    let lastShort = -1e9;
    near.forEach((b) => {
      if (b.tag) return;
      if (tablet) { b.tag = 'none'; return; }
      const farFromFull = fulls.every((f) => Math.abs(f.cx - b.cx) > tagW * 0.95);
      if (farFromFull && b.cx - lastShort > 128 * scale + 40) {
        b.tag = b.inside ? 'short' : 'out';
        lastShort = b.cx;
      } else {
        b.tag = 'none';
      }
    });
    const shortLabels = (b) => [
      `ABOA ${fmt(b.aboa)} SF`,
      `Parking ${b.parking}`,
      'Flood Zone X',
      `Src RLP p.${b.page}`,
    ];
    near.forEach((b, i) => { if (b.tag === 'short') b.short = shortLabels(b)[i % 4]; });

    scene = { groundY, topLimit, da, vpX, far, near, fulls, mobile, compact: tablet, scale, tagW, passCount: fulls.filter((b) => !b.fail).length };
    renderBackground();
  }

  /* ---------- Static background ---------- */
  function renderBackground() {
    const { groundY, far, near, da, vpX } = scene;
    bg = document.createElement('canvas');
    bg.width = canvas.width;
    bg.height = canvas.height;
    const g = bg.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#2b2f33');
    sky.addColorStop(0.7, '#272b2e');
    sky.addColorStop(1, '#222528');
    g.fillStyle = sky;
    g.fillRect(0, 0, W, H);

    // Framing grid
    g.strokeStyle = 'rgba(200, 215, 222, 0.045)';
    g.lineWidth = 1;
    const cols = W < 700 ? 6 : 12;
    g.beginPath();
    for (let i = 1; i < cols; i++) {
      const x = Math.round((W / cols) * i) + 0.5;
      g.moveTo(x, 0); g.lineTo(x, H);
    }
    for (let y = 120; y < groundY; y += 120) {
      g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5);
    }
    g.stroke();

    // Far skyline
    g.fillStyle = '#2f3337';
    far.forEach((b) => g.fillRect(b.x, groundY - b.h, b.w, b.h));

    // Near skyline
    near.forEach((b) => {
      const sbW = b.w * b.setback;
      const sbH = b.h * b.setbackH;
      g.fillStyle = '#34393e';
      g.fillRect(b.x, b.y + (b.setback ? sbH : 0), b.w, b.h - (b.setback ? sbH : 0));
      if (b.setback) g.fillRect(b.x + sbW, b.y, b.w - sbW * 2, sbH + 1);
      if (b.antenna) {
        g.fillStyle = '#3d4348';
        g.fillRect(b.cx - 1, b.y - 22, 2, 22);
      }
      // left edge highlight
      g.fillStyle = 'rgba(255,255,255,0.035)';
      g.fillRect(b.x, b.y + (b.setback ? sbH : 0), Math.max(2, b.w * 0.08), b.h);
      // windows
      const wr = rng(Math.floor(b.x * 13 + b.h));
      for (let wy = b.y + (b.setback ? sbH : 0) + 10; wy < groundY - 10; wy += 11) {
        for (let wx = b.x + 7; wx < b.x + b.w - 8; wx += 9) {
          const r = wr();
          g.fillStyle = r > 0.965 ? 'rgba(120, 200, 214, 0.32)' : r > 0.5 ? '#3c4247' : '#393e43';
          g.fillRect(wx, wy, 4, 5);
        }
      }
    });

    // Ground line
    g.fillStyle = '#25282b';
    g.fillRect(0, groundY, W, H - groundY);
    g.strokeStyle = 'rgba(200, 215, 222, 0.18)';
    g.beginPath(); g.moveTo(0, groundY + 0.5); g.lineTo(W, groundY + 0.5); g.stroke();

    // Ground plane grid in perspective
    const k = 0.42;
    const toBottom = (x) => vpX + (x - vpX) / k;
    g.strokeStyle = 'rgba(200, 215, 222, 0.06)';
    g.beginPath();
    for (let xb = -W * 1.5; xb < W * 2.5; xb += 70) {
      g.moveTo(vpX + (xb - vpX) * k, groundY); g.lineTo(xb, H);
    }
    const n = 9;
    for (let i = 1; i <= n; i++) {
      const y = groundY + (H - groundY) * Math.pow(i / n, 1.8);
      g.moveTo(0, y); g.lineTo(W, y);
    }
    g.stroke();

    // Delineated-area footprint on the ground
    g.fillStyle = 'rgba(34, 211, 238, 0.045)';
    g.beginPath();
    g.moveTo(da.x0, groundY); g.lineTo(da.x1, groundY);
    g.lineTo(toBottom(da.x1), H); g.lineTo(toBottom(da.x0), H);
    g.closePath(); g.fill();
    scene.daBottom = [toBottom(da.x0), toBottom(da.x1)];
  }

  /* ---------- Drawing helpers ---------- */
  function brackets(x, y, w, h, len) {
    ctx.beginPath();
    ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
    ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len);
    ctx.moveTo(x + w, y + h - len); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - len, y + h);
    ctx.moveTo(x + len, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - len);
    ctx.stroke();
  }
  function tick(x, y, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3, y + 3); ctx.lineTo(x + 9, y - 4); ctx.stroke();
  }
  function cross(x, y, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x + 8, y + 4); ctx.moveTo(x + 8, y - 4); ctx.lineTo(x, y + 4); ctx.stroke();
  }
  function font(size, weight = 500) {
    ctx.font = `${weight} ${size}px "Geist Mono", ui-monospace, Menlo, monospace`;
  }

  /* ---------- Frame ---------- */
  function draw(time) {
    const { groundY, topLimit, da, near, mobile, compact, tagW, daBottom } = scene;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(bg, 0, 0, W, H);

    const fade = time > MATCH_END ? 1 - clamp((time - MATCH_END) / (CYCLE - MATCH_END - 0.2)) : clamp(time / SCAN_START);
    const fs = mobile ? 10 : 11;
    ctx.globalAlpha = 1;

    // Delineated-area boundary (marching dashes)
    const daTop = topLimit - 18;
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.65 * fade;
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.55)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.lineDashOffset = -time * 14;
    ctx.beginPath();
    ctx.moveTo(da.x0 + 0.5, daTop); ctx.lineTo(da.x0 + 0.5, groundY); ctx.lineTo(daBottom[0], H);
    ctx.moveTo(da.x1 + 0.5, daTop); ctx.lineTo(da.x1 + 0.5, groundY); ctx.lineTo(daBottom[1], H);
    ctx.moveTo(da.x0, daTop + 0.5); ctx.lineTo(da.x1, daTop + 0.5);
    ctx.stroke();
    ctx.setLineDash([]);
    font(fs);
    ctx.fillStyle = 'rgba(207, 239, 245, 0.85)';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Delineated area', da.x0 + 8, daTop - 6);
    const rl = 'RLP boundary';
    ctx.fillStyle = 'rgba(141, 149, 155, 0.9)';
    ctx.fillText(rl, da.x1 - ctx.measureText(rl).width - 8, daTop - 6);
    ctx.restore();

    // Scan line
    const sp = (time - SCAN_START) / (SCAN_END - SCAN_START);
    if (sp > 0 && sp < 1) {
      const sx = -40 + sp * (W + 80);
      const trail = ctx.createLinearGradient(sx - 140, 0, sx, 0);
      trail.addColorStop(0, 'rgba(34, 211, 238, 0)');
      trail.addColorStop(1, 'rgba(34, 211, 238, 0.07)');
      ctx.fillStyle = trail;
      ctx.fillRect(sx - 140, daTop, 140, groundY - daTop);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.7)';
      ctx.fillRect(sx, daTop, 1, groundY - daTop);
    }

    ctx.globalAlpha = fade;

    // Telemetry links between acquired buildings inside the area
    const acquiredIn = near.filter((b) => b.inside && time >= b.ta + 0.2);
    if (acquiredIn.length > 1) {
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      acquiredIn.forEach((b, i) => {
        const px = b.cx, py = b.y - 6;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      // travelling packet on the newest segment
      const a = acquiredIn[acquiredIn.length - 2], b = acquiredIn[acquiredIn.length - 1];
      const p = ((time * 0.9) % 1);
      ctx.fillStyle = COL.cyan;
      ctx.fillRect(a.cx + (b.cx - a.cx) * p - 1.5, (a.y - 6) + ((b.y - 6) - (a.y - 6)) * p - 1.5, 3, 3);
    }

    // Boxes
    let evaluated = 0;
    near.forEach((b) => {
      if (time < b.ta) return;
      evaluated++;
      const p = easeOut(clamp((time - b.ta) / 0.45));
      const grow = 1 + (1 - p) * 0.3;
      const bw = (b.w + 8) * grow, bh = (b.h + 8) * grow;
      const bx = b.cx - bw / 2, by = b.y - 4 + (b.h + 8) / 2 - bh / 2;
      const len = Math.min(14, bw / 4, bh / 4);

      let color = b.inside ? COL.cyan : COL.grey;
      let matched = false;
      if (b.tag === 'full') {
        const doneAt = b.ta + 0.35 + 4 * 0.32;
        if (b.fail && time > b.ta + 0.35 + 3 * 0.32) color = COL.warn;
        if (!b.fail && time > SCAN_END) matched = true;
        if (!b.fail && time > doneAt) color = COL.teal;
      }

      ctx.save();
      ctx.globalAlpha = fade * p;
      ctx.lineWidth = 1;
      if (b.inside) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = fade * p * 0.28;
        ctx.strokeRect(bx + 0.5, by + 0.5, bw, bh);
        ctx.globalAlpha = fade * p;
        ctx.lineWidth = matched ? 2 : 1.5;
        brackets(bx + 0.5, by + 0.5, bw, bh, len);
        if (matched) {
          const pulse = 0.5 + 0.5 * Math.sin((time - SCAN_END) * 5);
          ctx.globalAlpha = fade * (0.08 + pulse * 0.08);
          ctx.fillStyle = COL.teal;
          ctx.fillRect(bx, by, bw, bh);
        }
        // lock-on crosshair
        const lk = clamp((time - b.ta) / 0.7);
        if (lk < 1) {
          ctx.globalAlpha = fade * (1 - lk);
          ctx.strokeStyle = COL.cyan;
          const r = 6 + lk * 10;
          ctx.beginPath();
          ctx.moveTo(b.cx - r, b.y + b.h / 2); ctx.lineTo(b.cx + r, b.y + b.h / 2);
          ctx.moveTo(b.cx, b.y + b.h / 2 - r); ctx.lineTo(b.cx, b.y + b.h / 2 + r);
          ctx.stroke();
        }
      } else {
        ctx.globalAlpha = fade * p * 0.7;
        ctx.strokeStyle = COL.grey;
        ctx.setLineDash([3, 4]);
        ctx.strokeRect(bx + 0.5, by + 0.5, bw, bh);
        ctx.setLineDash([]);
      }
      ctx.restore();
    });

    // Tags (drawn after boxes so they sit on top)
    near.forEach((b) => {
      if (time < b.ta + 0.15 || b.tag === 'none') return;
      const p = clamp((time - b.ta - 0.15) / 0.3);
      ctx.save();
      ctx.globalAlpha = fade * p;
      font(fs);
      ctx.textBaseline = 'middle';

      if (b.tag === 'short' || b.tag === 'out') {
        const label = b.tag === 'out' ? 'Outside area: excluded' : b.short;
        const head = b.id;
        const w = Math.max(ctx.measureText(label).width, ctx.measureText(head).width) + 26;
        const h = 36;
        const x = clamp(b.cx - w / 2, 6, W - w - 6);
        const y = Math.max(b.y - h - 14, topLimit - 10);
        ctx.fillStyle = COL.tagBg;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = b.tag === 'out' ? 'rgba(141,149,155,0.6)' : 'rgba(34,211,238,0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        ctx.fillStyle = b.tag === 'out' ? '#aab2b8' : COL.ink;
        ctx.fillText(head, x + 8, y + 11);
        ctx.fillStyle = b.tag === 'out' ? COL.grey : COL.cyan;
        ctx.fillText(label, x + 8, y + 25);
        if (b.tag === 'short') tick(x + w - 16, y + 25, COL.cyan);
        // leader
        ctx.strokeStyle = b.tag === 'out' ? 'rgba(141,149,155,0.5)' : 'rgba(34,211,238,0.5)';
        ctx.beginPath(); ctx.moveTo(b.cx, y + h); ctx.lineTo(b.cx, b.y - 4); ctx.stroke();
      } else if (b.tag === 'full') {
        const lineH = fs + 6;
        const rows = [
          ['ABOA SF', `${fmt(b.aboa)} / ${fmt(b.req.aboa)}`, true],
          ['Parking', `${b.parking} / ${b.req.parking}`, true],
          ['Floodplain', b.fail ? 'Zone AE' : 'Zone X', !b.fail],
          ['Source', `RLP p.${b.page}`, true],
        ];
        const reveal = (i) => time > b.ta + 0.35 + i * 0.32;
        // Compact mode shows only the row currently being checked
        let shown = rows.map((r, i) => i);
        if (compact) {
          let cur = 0;
          for (let i = 0; i < rows.length; i++) if (reveal(i)) cur = i;
          if (b.fail && reveal(2)) cur = 2;
          shown = [cur];
        }
        const w = tagW;
        const h = 14 + lineH * (shown.length + 1) + 6;
        const valX = x0 => x0 + 8 + ctx.measureText('Floodplain ').width + 6;
        const x = clamp(b.cx - w / 2, 6, W - w - 6);
        const y = Math.max(b.y - h - 16, topLimit - 6);
        const failed = b.fail && reveal(2);
        const done = reveal(3);
        const matched = !b.fail && time > SCAN_END;
        const edge = failed ? COL.warn : done && !b.fail ? COL.teal : COL.cyan;

        ctx.fillStyle = COL.tagBg;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = edge;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        // header bar
        ctx.fillStyle = failed ? 'rgba(242,184,75,0.16)' : matched ? 'rgba(20,184,166,0.28)' : 'rgba(34,211,238,0.12)';
        ctx.fillRect(x + 1, y + 1, w - 2, lineH + 6);
        ctx.fillStyle = COL.ink;
        ctx.fillText(b.id, x + 8, y + 4 + lineH / 2 + 1);
        const status = failed ? (compact ? 'Fails' : 'Fails 1 line') : matched ? (compact ? 'Candidate' : 'Offer candidate') : done ? '4/4 met' : 'Checking';
        ctx.fillStyle = failed ? COL.warn : done ? '#5eead4' : COL.cyan;
        const sw = ctx.measureText(status).width;
        ctx.fillText(status, x + w - sw - 8, y + 4 + lineH / 2 + 1);

        shown.forEach((i, row) => {
          const [k, v, ok] = rows[i];
          const ry = y + 10 + lineH * (row + 1) + lineH / 2;
          ctx.fillStyle = '#9aa3a9';
          ctx.fillText(k, x + 8, ry);
          if (!reveal(i)) {
            const dots = '.'.repeat(1 + Math.floor((time * 4) % 3));
            ctx.fillStyle = 'rgba(34,211,238,0.6)';
            ctx.fillText(dots, valX(x), ry);
            return;
          }
          ctx.fillStyle = ok ? COL.ink : COL.warn;
          ctx.fillText(v, valX(x), ry);
          if (ok) tick(x + w - 18, ry, COL.cyan); else cross(x + w - 17, ry, COL.warn);
        });
        ctx.strokeStyle = failed ? 'rgba(242,184,75,0.6)' : 'rgba(34,211,238,0.6)';
        ctx.beginPath(); ctx.moveTo(b.cx, y + h); ctx.lineTo(b.cx, b.y - 4); ctx.stroke();
      }
      ctx.restore();
    });

    ctx.globalAlpha = 1;
    updateHud(time, evaluated);
  }

  function setHud(key, value) {
    if (hudCache[key] !== value && hud[key]) {
      hud[key].textContent = value;
      hudCache[key] = value;
    }
  }
  function updateHud(time, evaluated) {
    setHud('count', String(evaluated));
    const secs = clamp(time - SCAN_START, 0, MATCH_END - SCAN_START);
    setHud('timer', secs.toFixed(1) + 's');
    const n = scene.passCount;
    setHud('status', time > SCAN_END && time < CYCLE - 0.3
      ? `Requirement Match: ${n} candidate${n === 1 ? '' : 's'}`
      : 'RLP Engine: Active');
  }

  /* ---------- Loop control ---------- */
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    t += dt;
    if (t >= CYCLE) t = 0;
    draw(t);
    schedule();
  }
  function schedule() {
    if (!raf && visible && !document.hidden && !reduceMQ.matches) raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0; last = 0;
  }
  function drawStatic() {
    stop();
    draw(SCAN_END + 1.2);
  }
  function start() {
    if (reduceMQ.matches) { drawStatic(); return; }
    schedule();
  }

  let resizeTimer = 0;
  let lastW = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = hero.getBoundingClientRect().width;
      // Ignore height-only changes from mobile browser chrome unless large
      if (Math.abs(w - lastW) < 1 && Math.abs(hero.getBoundingClientRect().height - H) < 120) return;
      lastW = w;
      build();
      reduceMQ.matches ? drawStatic() : draw(t);
    }, 150);
  }

  build();
  lastW = W;
  start();
  if (reduceMQ.matches) drawStatic();

  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
  reduceMQ.addEventListener?.('change', start);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    }, { threshold: 0.01 }).observe(hero);
  }
  // Redraw once the HUD font is ready so the static frame uses it too
  document.fonts?.ready.then(() => { if (reduceMQ.matches) drawStatic(); });
})();
