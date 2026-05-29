/* ──────────────────────────────────────────────────────────────────────
   PAUSCHENWEIN DESIGN SYSTEM · navbar.js
   Selbst-injizierende Navbar mit Burger-Menü-Overlay für alle
   Pauschenwein-Seiten. CSS + HTML + Verhalten in einer Datei.

   Usage:
     <div data-pw-navbar
          data-active="bau"
          data-light-on-top="false"
          data-immo-href="https://pauschenwein-immobilien.at"
          data-contact-href="#kontakt"
          data-karriere-href="https://pauschenwein-gruppe.at/karriere/"
          data-logo-href="/"></div>
     <script src="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/navbar.js" defer></script>

   Alle data-Attribute sind optional — sinnvolle Defaults sind gesetzt.
   data-active = einer von: bau | immobilien | wohlfuehlzentrum | med |
                            kosmetik | handel | karriere | gruppe
   data-light-on-top = "true"  → Navbar-Text dunkel solange nicht gescrollt
                                 (für Seiten mit hellem Hero, z.B. Gruppe)
   ────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const CDN = 'https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main';

  // ───────── CSS (einmalig injizieren) ─────────
  const CSS = `
.pw-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 100; height: var(--nav-h);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 var(--pad-x);
  transition: background 0.5s var(--ease), border-color 0.5s var(--ease), height 0.4s var(--ease);
  border-bottom: 1px solid transparent;
}
.pw-nav.scrolled { background: rgba(14,18,19,0.82); backdrop-filter: blur(14px); border-bottom-color: var(--line); height: 70px; }
[data-pw-theme='light'] .pw-nav.scrolled { background: rgba(255,255,255,0.86); }
.pw-nav-logo img { height: 46px; width: auto; transition: height 0.4s var(--ease); display: block; }
.pw-nav.scrolled .pw-nav-logo img { height: 38px; }
.pw-nav-right { display: flex; align-items: center; gap: 22px; }
.pw-nav-immo {
  display: inline-flex; align-items: center; gap: 7px; font-size: 0.74rem; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
  transition: color 0.4s var(--ease); white-space: nowrap;
}
.pw-nav-immo:hover { color: var(--paper); }
.pw-nav-immo svg { width: 11px; height: 11px; stroke: currentColor; fill: none; stroke-width: 2; opacity: 0.7; }
.pw-burger { display: flex; flex-direction: column; gap: 6px; background: none; border: none; cursor: pointer; padding: 6px; }
.pw-burger span { display: block; width: 26px; height: 1.5px; background: var(--paper); transition: transform 0.4s var(--ease), opacity 0.3s, background 0.4s var(--ease); }
.pw-burger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
.pw-burger.open span:nth-child(2) { opacity: 0; }
.pw-burger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }
@media (max-width: 940px) { .pw-nav-immo { display: none; } }

/* ── Light-Mode (Navbar über hellem Hero, nicht gescrollt, Menü zu) ── */
.pw-nav.light-on-top:not(.scrolled):not(.menu-open) .pw-nav-logo img { filter: invert(1) brightness(0); }
.pw-nav.light-on-top:not(.scrolled):not(.menu-open) .pw-nav-immo { color: rgba(14,18,19,0.7); }
.pw-nav.light-on-top:not(.scrolled):not(.menu-open) .pw-nav-immo:hover { color: var(--ink); }
.pw-nav.light-on-top:not(.scrolled):not(.menu-open) .pw-burger span { background: var(--ink); }

/* X immer auf weiß sobald Menü offen */
.pw-burger.open span { background: #ffffff !important; }

/* ── Overlay-Menü ── */
.pw-menu {
  position: fixed; inset: 0; z-index: 99; background: #0e1213; color: #fff;
  display: flex; flex-direction: column; justify-content: center;
  padding: var(--nav-h) var(--pad-x) 40px;
  clip-path: inset(0 0 100% 0); transition: clip-path 0.7s var(--ease);
  pointer-events: none;
}
.pw-menu.open { clip-path: inset(0 0 0 0); pointer-events: auto; }
.pw-menu-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.34); margin-bottom: 28px; }
.pw-menu-list { display: flex; flex-direction: column; }
.pw-menu-list a {
  display: flex; align-items: baseline; gap: 18px; padding: clamp(8px,1.6vh,18px) 0;
  border-top: 1px solid rgba(255,255,255,0.10); color: #fff;
  transition: opacity 0.6s var(--ease), transform 0.6s var(--ease), padding-left 0.35s var(--ease);
  opacity: 0; transform: translateY(20px);
}
.pw-menu.open .pw-menu-list a { opacity: 1; transform: none; }
.pw-menu.open .pw-menu-list a:nth-child(1) { transition-delay: 0.18s, 0.18s, 0s; }
.pw-menu.open .pw-menu-list a:nth-child(2) { transition-delay: 0.24s, 0.24s, 0s; }
.pw-menu.open .pw-menu-list a:nth-child(3) { transition-delay: 0.30s, 0.30s, 0s; }
.pw-menu.open .pw-menu-list a:nth-child(4) { transition-delay: 0.36s, 0.36s, 0s; }
.pw-menu.open .pw-menu-list a:nth-child(5) { transition-delay: 0.42s, 0.42s, 0s; }
.pw-menu.open .pw-menu-list a:nth-child(6) { transition-delay: 0.48s, 0.48s, 0s; }
.pw-menu.open .pw-menu-list a:nth-child(7) { transition-delay: 0.54s, 0.54s, 0s; }
.pw-menu-list a:hover { padding-left: 18px; }
.pw-menu-list a.is-active { color: rgba(255,255,255,0.34); pointer-events: none; }
.pw-menu-num { font-size: 0.8rem; font-weight: 400; color: rgba(255,255,255,0.34); min-width: 34px; }
.pw-menu-name { font-weight: 300; letter-spacing: -0.02em; font-size: clamp(1.8rem, 5vw, 3.4rem); line-height: 1.1; }
.pw-menu-name em { font-style: normal; color: rgba(255,255,255,0.52); transition: color 0.4s var(--ease); }
.pw-menu-list a:hover .pw-menu-name em { color: #fff; }
.pw-menu-ext { margin-left: auto; align-self: center; width: 16px; height: 16px; stroke: rgba(255,255,255,0.34); fill: none; stroke-width: 1.6; }
.pw-menu-foot { margin-top: clamp(28px,5vh,56px); display: flex; gap: 18px; flex-wrap: wrap; align-items: center; }
.pw-menu-foot .btn { background: #fff; color: #0e1213; border-color: #fff; }
.pw-menu-foot .btn::after { background: #0e1213; }
.pw-menu-foot .btn:hover { color: #fff; border-color: #fff; }
.pw-menu-foot .btn.ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.22); }
.pw-menu-foot .btn.ghost::after { background: #fff; }
.pw-menu-foot .btn.ghost:hover { color: #0e1213; border-color: #fff; }
  `;

  // Style-Tag nur 1x injizieren
  if (!document.getElementById('pw-nav-style')) {
    const style = document.createElement('style');
    style.id = 'pw-nav-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ───────── Menü-Datenstruktur ─────────
  const AREAS = [
    { key: 'bau',              num: '01', label: 'Pauschenwein <em>Bau</em>',         href: 'https://pauschenwein-bau.at' },
    { key: 'immobilien',       num: '02', label: 'Pauschenwein <em>Immobilien</em>',  href: 'https://pauschenwein-immobilien.at' },
    { key: 'wohlfuehlzentrum', num: '03', label: '<em>Wohlfühlzentrum</em>',           href: 'https://pauschenwein-wohlfuehlzentrum.at' },
    { key: 'med',              num: '04', label: 'Pauschenwein <em>Med</em>',          href: 'https://pauschenwein-med.at' },
    { key: 'kosmetik',         num: '05', label: 'Pauschenwein <em>Kosmetik</em>',     href: 'https://pauschenwein-kosmetik.at' },
    { key: 'handel',           num: '06', label: 'Pauschenwein <em>Handel</em>',       href: 'https://pauschenwein-handel.at' }
  ];

  // ───────── Container rendern ─────────
  function render(container) {
    const cfg = container.dataset;
    const active = (cfg.active || '').toLowerCase();
    const lightOnTop = cfg.lightOnTop === 'true';
    const logoHref = cfg.logoHref || '/';
    const logoSrc = cfg.logo || (CDN + '/assets/logo-white.png');
    const immoHref = cfg.immoHref || 'https://pauschenwein-immobilien.at';
    const showImmo = cfg.immoShow !== 'false' && active !== 'immobilien';
    const contactHref = cfg.contactHref || '#kontakt';
    const karriereHref = cfg.karriereHref || 'https://pauschenwein-gruppe.at/karriere/';
    const isExternal = (h) => /^https?:\/\//.test(h);

    const areaItems = AREAS.map(a => {
      const isActive = a.key === active;
      const ext = isExternal(a.href) ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${a.href}"${ext}${isActive ? ' class="is-active" aria-current="page"' : ''}>
        <span class="pw-menu-num">${a.num}</span>
        <span class="pw-menu-name">${a.label}</span>
        <svg class="pw-menu-ext" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>
      </a>`;
    }).join('');

    const karriereActive = active === 'karriere';
    const karriereExt = isExternal(karriereHref) ? ' target="_blank" rel="noopener"' : '';
    const karriereItem = `<a href="${karriereHref}"${karriereExt}${karriereActive ? ' class="is-active" aria-current="page"' : ''}>
      <span class="pw-menu-num">07</span>
      <span class="pw-menu-name"><em>Karriere</em></span>
      <svg class="pw-menu-ext" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>`;

    const immoBtn = showImmo
      ? `<a href="${immoHref}" class="pw-nav-immo" target="_blank" rel="noopener">Immobilien
           <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
         </a>`
      : '';

    container.innerHTML = `
<nav class="pw-nav${lightOnTop ? ' light-on-top' : ''}" id="pw-nav" aria-label="Hauptnavigation">
  <a href="${logoHref}" class="pw-nav-logo" aria-label="Pauschenwein"><img src="${logoSrc}" alt="Pauschenwein"></a>
  <div class="pw-nav-right">
    ${immoBtn}
    <button class="pw-burger" id="pw-burger" aria-label="Menü" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>
<div class="pw-menu" id="pw-menu" role="navigation" aria-label="Hauptmenü">
  <p class="pw-menu-label">Geschäftsbereiche</p>
  <div class="pw-menu-list">${areaItems}${karriereItem}</div>
  <div class="pw-menu-foot">
    <a href="${contactHref}" class="btn" data-pw-close><span>Kontakt aufnehmen</span><svg class="arr" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg></a>
  </div>
</div>`;

    // ── Verhalten ──
    const nav = container.querySelector('.pw-nav');
    const burger = container.querySelector('.pw-burger');
    const menu = container.querySelector('.pw-menu');

    // Scroll-state
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Menü toggle
    const setMenu = (open) => {
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      nav.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

    // ESC schließt
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  }

  // Alle Container auf der Seite rendern
  function init() {
    document.querySelectorAll('[data-pw-navbar]').forEach(render);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
