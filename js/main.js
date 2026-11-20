(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Toast ---------- */
  const toastEl = $('[data-toast]');
  let toastTimer = 0;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ---------- Mobile nav ---------- */
  const toggle = $('.nav-toggle');
  const links = $('#nav-links');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('open', !open);
  });
  $$('#nav-links a').forEach((a) => a.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    links.classList.remove('open');
  }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
      toggle.focus();
    }
  });

  /* ---------- Active section in nav ---------- */
  const navMap = new Map($$('#nav-links a[href^="#"]').map((a) => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const a = navMap.get(en.target.id);
        if (!a) return;
        if (en.isIntersecting) {
          navMap.forEach((x) => x.removeAttribute('aria-current'));
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Mountain Time clock ---------- */
  const clockEl = $('[data-clock]');
  if (clockEl) {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', hour: 'numeric', minute: '2-digit', second: '2-digit' });
    const tickClock = () => { clockEl.textContent = f.format(new Date()); };
    tickClock();
    setInterval(tickClock, 1000);
  }

  /* ---------- Steps (tabs) ---------- */
  const steps = $('[data-steps]');
  if (steps) {
    const tabs = $$('[role="tab"]', steps);
    const select = (tab, focus = true) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(tabs[n]); }
      });
    });
  }

  /* ---------- Copy registration codes ---------- */
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const v = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(v);
      toast(`Copied ${v}`);
    } catch {
      toast(`Copy failed. Select ${v} and copy it manually.`);
    }
  }));

  /* ---------- Capability statement dialog ---------- */
  const dlg = $('#cap-dialog');
  let opener = null;
  $$('[data-open-cap]').forEach((b) => b.addEventListener('click', () => {
    opener = b;
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    $('[data-print-cap]', dlg)?.focus();
  }));
  $('[data-close-cap]')?.addEventListener('click', () => dlg.close());
  dlg?.addEventListener('close', () => opener?.focus());
  dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  $('[data-print-cap]')?.addEventListener('click', () => {
    document.documentElement.classList.add('print-cap');
    window.print();
  });
  window.addEventListener('afterprint', () => document.documentElement.classList.remove('print-cap'));
  if (location.hash === '#capability-statement') {
    requestAnimationFrame(() => $('[data-open-cap]')?.click());
  }

  /* ---------- Inquiry form ---------- */
  const form = $('[data-inquiry]');
  if (form) {
    const checks = [
      { el: $('#f-name'), err: $('#e-name'), ok: (v) => v.trim().length > 1 },
      { el: $('#f-org'), err: $('#e-org'), ok: (v) => v.trim().length > 1 },
      { el: $('#f-email'), err: $('#e-email'), ok: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      { el: $('#f-msg'), err: $('#e-msg'), ok: (v) => v.trim().length > 3 },
    ];
    const validate = (c) => {
      const good = c.ok(c.el.value);
      c.el.setAttribute('aria-invalid', String(!good));
      c.err.hidden = good;
      if (!good) c.el.setAttribute('aria-describedby', c.err.id); else c.el.removeAttribute('aria-describedby');
      return good;
    };
    checks.forEach((c) => c.el.addEventListener('blur', () => { if (c.el.value) validate(c); }));
    checks.forEach((c) => c.el.addEventListener('input', () => { if (c.el.getAttribute('aria-invalid') === 'true') validate(c); }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = checks.filter((c) => !validate(c));
      if (bad.length) { bad[0].el.focus(); return; }
      const d = Object.fromEntries(new FormData(form));
      const subject = `Inquiry from ${d.organization}${d.solicitation ? ` re: ${d.solicitation}` : ''}`;
      const body = [
        `Name: ${d.name}`,
        `Organization: ${d.organization}`,
        `Role: ${d.role}`,
        `Email: ${d.email}`,
        d.phone ? `Phone: ${d.phone}` : null,
        d.solicitation ? `Solicitation / RLP: ${d.solicitation}` : null,
        '',
        d.message,
      ].filter((l) => l !== null).join('\n');
      const href = `mailto:gmogga@rlpscout.ai?cc=${encodeURIComponent('ahavasi@rlpscout.ai')}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      const note = $('[data-form-note]');
      if (note) note.textContent = 'Your email app should open with the inquiry filled in. If it did not, email gmogga@rlpscout.ai directly.';
    });
  }
})();
