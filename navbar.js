/* ──────────────────────────────────────────────────────────────────────
   PAUSCHENWEIN DESIGN SYSTEM · navbar.js
   Selbst-injizierende Navbar mit Burger-Menü-Overlay für alle
   Pauschenwein-Seiten. CSS + HTML + Verhalten in einer Datei.

   Usage (Standard-Subsite: eigene Menüpunkte in der Bar):
     <div data-pw-navbar
          data-active="bau"
          data-nav-items='[{"label":"Leistungen","href":"#leistungen"},{"label":"Referenzen","href":"#referenzen"}]'
          data-contact-href="#kontakt"></div>
     <script src="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/navbar.js" defer></script>

   Usage (Gruppen-Spezialfall: nur Logo + Immobilien-Quicklink + Burger):
     <div data-pw-navbar
          data-active="gruppe"
          data-immo-show="true"
          data-light-on-top="true"
          data-contact-href="#kontakt"></div>

   Alle data-Attribute sind optional — sinnvolle Defaults sind gesetzt.
   data-active = einer von: bau | immobilien | wohlfuehlzentrum | med |
                            kosmetik | handel | karriere | gruppe
   data-light-on-top = "true"  → Navbar-Text dunkel solange nicht gescrollt
                                 (für Seiten mit hellem Hero, z.B. Gruppe)
   data-immo-show   = "true"  → Immobilien-Quicklink in der Bar
                                 (Default: false → Spezialität der Gruppen-Site)
   data-nav-items   = JSON-Array [{label, href, external?}, …]
                                 Eigene Menüpunkte rechts in der Bar (Desktop).
                                 Auf Mobile via Burger erreichbar (im Menü unter
                                 den Geschäftsbereichen als „Auf dieser Seite").
   data-karriere-show = "false" → Karriere-Eintrag in „Weiteres" ausblenden (Default: true)
   data-karriere-href = URL des Karriere-Bereichs (Default: gruppen-Karriereseite)
   data-news-show    = "false" → News-Eintrag in „Weiteres" ausblenden (Default: true)
   data-news-href    = URL des News-Bereichs (Default: gruppen-News-Seite)
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
.pw-nav-items { display: flex; align-items: center; gap: 22px; }
.pw-nav-item {
  font-size: 0.78rem; font-weight: 500; letter-spacing: 0.06em;
  color: var(--paper); transition: color 0.4s var(--ease); white-space: nowrap;
  position: relative;
}
.pw-nav-item::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 1px;
  background: currentColor; transform: scaleX(0); transform-origin: right center;
  transition: transform 0.4s var(--ease);
}
.pw-nav-item:hover::after { transform: scaleX(1); transform-origin: left center; }
.pw-nav-item.is-active { color: var(--muted); }
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
@media (max-width: 940px) {
  .pw-nav-immo { display: none; }
  .pw-nav-items { display: none; }
}

/* ── Light-Mode (Navbar über hellem Hero, nicht gescrollt, Menü zu) ── */
.pw-nav.light-on-top:not(.scrolled):not(.menu-open) .pw-nav-logo img { filter: invert(1) brightness(0); }
.pw-nav.light-on-top:not(.scrolled):not(.menu-open) .pw-nav-immo { color: rgba(14,18,19,0.7); }
.pw-nav.light-on-top:not(.scrolled):not(.menu-open) .pw-nav-immo:hover { color: var(--ink); }
.pw-nav.light-on-top:not(.scrolled):not(.menu-open) .pw-nav-item { color: var(--ink); }
.pw-nav.light-on-top:not(.scrolled):not(.menu-open) .pw-nav-item.is-active { color: rgba(14,18,19,0.5); }
.pw-nav.light-on-top:not(.scrolled):not(.menu-open) .pw-burger span { background: var(--ink); }

/* X immer auf weiß sobald Menü offen */
.pw-burger.open span { background: #ffffff !important; }

/* ── Overlay-Menü ── */
.pw-menu {
  position: fixed; inset: 0; z-index: 99; background: #0e1213; color: #fff;
  display: flex; flex-direction: column;
  /* safe center: zentriert nur wenn Inhalt passt; sonst flex-start (kein Überlappen mit Navbar) */
  justify-content: safe center;
  padding: calc(var(--nav-h) + clamp(8px,2vh,28px)) var(--pad-x) clamp(20px,3vh,40px);
  clip-path: inset(0 0 100% 0); transition: clip-path 0.7s var(--ease);
  pointer-events: none; overflow-y: auto;
}
/* Fallback für Browser ohne safe-Keyword: bei knappen Viewports erzwungen oben verankern */
@media (max-height: 1100px) {
  .pw-menu { justify-content: flex-start; }
}
.pw-menu.open { clip-path: inset(0 0 0 0); pointer-events: auto; }
.pw-menu-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.34); margin-bottom: clamp(12px,2vh,28px); }
.pw-menu-list { display: flex; flex-direction: column; }
.pw-menu-list a {
  display: flex; align-items: baseline; gap: 18px; padding: clamp(5px,1.2vh,18px) 0;
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
.pw-menu-name { font-weight: 300; letter-spacing: -0.02em; font-size: clamp(1.4rem, min(4.5vw, 5.5vh), 3.4rem); line-height: 1.1; }
.pw-menu-name b { font-weight: 700; }
.pw-menu-name em { font-style: normal; font-weight: 300; color: rgba(255,255,255,0.52); transition: color 0.4s var(--ease); }
.pw-menu-list a:hover .pw-menu-name em { color: #fff; }
.pw-menu-ext { margin-left: auto; align-self: center; width: 16px; height: 16px; stroke: rgba(255,255,255,0.34); fill: none; stroke-width: 1.6; }
/* ── Weiteres-Sektion (Karriere, News … abgetrennt von Geschäftsbereichen) ── */
.pw-menu-extra { margin-top: clamp(16px,3vh,48px); padding-top: clamp(12px,2vh,30px); border-top: 1px solid rgba(255,255,255,0.10); }
.pw-menu-extra-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.34); margin-bottom: clamp(8px,1.4vh,22px); }
.pw-menu-extra-list { display: flex; flex-direction: column; }
.pw-menu-extra-list a {
  display: flex; align-items: baseline; gap: 18px; padding: clamp(4px,0.7vh,11px) 0;
  color: #fff; font-weight: 300; letter-spacing: -0.01em;
  font-size: clamp(1rem, min(2.2vw, 2.6vh), 1.55rem); line-height: 1.2;
  transition: opacity 0.6s var(--ease), transform 0.6s var(--ease), padding-left 0.35s var(--ease), color 0.3s var(--ease);
  opacity: 0; transform: translateY(20px);
}
.pw-menu.open .pw-menu-extra-list a { opacity: 1; transform: none; }
.pw-menu.open .pw-menu-extra-list a:nth-child(1) { transition-delay: 0.60s, 0.60s, 0s, 0s; }
.pw-menu.open .pw-menu-extra-list a:nth-child(2) { transition-delay: 0.66s, 0.66s, 0s, 0s; }
.pw-menu.open .pw-menu-extra-list a:nth-child(3) { transition-delay: 0.72s, 0.72s, 0s, 0s; }
.pw-menu-extra-list a:hover { padding-left: 14px; }
.pw-menu-extra-list a.is-active { color: rgba(255,255,255,0.34); pointer-events: none; }
.pw-menu-extra-arrow { margin-left: auto; align-self: center; width: 14px; height: 14px; stroke: rgba(255,255,255,0.4); fill: none; stroke-width: 1.6; transition: stroke 0.4s var(--ease), transform 0.4s var(--ease); }
.pw-menu-extra-list a:hover .pw-menu-extra-arrow { stroke: #fff; transform: translateX(4px); }

.pw-menu-foot { margin-top: clamp(16px,3vh,56px); display: flex; gap: 18px; flex-wrap: wrap; align-items: center; }
.pw-menu-foot .btn { background: #fff; color: #0e1213; border-color: #fff; }
.pw-menu-foot .btn::after { background: #0e1213; }
.pw-menu-foot .btn:hover { color: #fff; border-color: #fff; }
.pw-menu-foot .btn.ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.22); }
.pw-menu-foot .btn.ghost::after { background: #fff; }
.pw-menu-foot .btn.ghost:hover { color: #0e1213; border-color: #fff; }

/* ── Site-local Nav-Items im Menü (nur Mobile, falls vorhanden) ── */
.pw-menu-sublabel {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
  color: rgba(255,255,255,0.34); margin: 28px 0 14px;
}
.pw-menu-sublist { display: flex; flex-direction: column; gap: 4px; }
.pw-menu-sublist a {
  color: #fff; font-weight: 300; font-size: clamp(1rem, 2.4vw, 1.2rem);
  padding: 8px 0; border-top: 1px solid rgba(255,255,255,0.10);
  transition: padding-left 0.35s var(--ease);
}
.pw-menu-sublist a:hover { padding-left: 14px; }
@media (min-width: 941px) {
  .pw-menu-sublabel, .pw-menu-sublist { display: none; }
}
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
    { key: 'bau',              num: '01', label: '<b>PAUSCHENWEIN</b> <em>bau</em>',         href: 'https://www.pauschenwein-bau.at' },
    { key: 'immobilien',       num: '02', label: '<b>PAUSCHENWEIN</b> <em>immobilien</em>',  href: 'https://www.pauschenwein-immobilien.at' },
    { key: 'wohlfuehlzentrum', num: '03', label: '<b>PAUSCHENWEIN</b> <em>wohlfühlzentrum</em>', href: 'https://www.pauschenwein-zentrum.at' },
    { key: 'med',              num: '04', label: '<b>PAUSCHENWEIN</b> <em>med</em>',          href: 'https://www.pauschenwein-med.at' },
    { key: 'kosmetik',         num: '05', label: '<b>PAUSCHENWEIN</b> <em>kosmetik</em>',     href: 'https://www.pauschenwein-kosmetik.at' },
    { key: 'handel',           num: '06', label: '<b>PAUSCHENWEIN</b> <em>handel</em>',       href: 'https://www.pauschenwein-handel.at' }
  ];

  // ───────── Container rendern ─────────
  function render(container) {
    const cfg = container.dataset;
    const active = (cfg.active || '').toLowerCase();
    const lightOnTop = cfg.lightOnTop === 'true';
    const logoHref = cfg.logoHref || '/';
    const logoSrc = cfg.logo || (CDN + '/assets/logo-white.png');
    const immoHref = cfg.immoHref || 'https://www.pauschenwein-immobilien.at';
    // Default: KEIN Immo-Quicklink. Nur die Gruppen-Site setzt data-immo-show="true".
    const showImmo = cfg.immoShow === 'true' && active !== 'immobilien';
    const contactHref = cfg.contactHref || '#kontakt';
    const karriereHref = cfg.karriereHref || 'https://pauschenwein-gruppe.at/karriere/';
    const karriereShow = cfg.karriereShow !== 'false';
    const newsHref = cfg.newsHref || 'https://pauschenwein-gruppe.at/news/';
    const newsShow = cfg.newsShow !== 'false';
    const isExternal = (h) => /^https?:\/\//.test(h);

    // Site-eigene Nav-Items in der Bar (für alle Subsites außer Gruppe)
    let navItems = [];
    if (cfg.navItems) {
      try { navItems = JSON.parse(cfg.navItems); } catch (e) {
        console.warn('[pw-navbar] data-nav-items ist kein gültiges JSON:', e);
      }
    }

    const areaItems = AREAS.map(a => {
      const isActive = a.key === active;
      const ext = isExternal(a.href) ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${a.href}"${ext}${isActive ? ' class="is-active" aria-current="page"' : ''}>
        <span class="pw-menu-num">${a.num}</span>
        <span class="pw-menu-name">${a.label}</span>
        <svg class="pw-menu-ext" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>
      </a>`;
    }).join('');

    // Weiteres-Sektion (Karriere, News) — visuell abgetrennt von den Geschäftsbereichen
    const extraEntries = [];
    if (karriereShow) extraEntries.push({ key: 'karriere', label: 'Karriere', href: karriereHref });
    if (newsShow) extraEntries.push({ key: 'news', label: 'News', href: newsHref });

    const extraSection = extraEntries.length ? `
      <div class="pw-menu-extra">
        <p class="pw-menu-extra-label">Weiteres</p>
        <div class="pw-menu-extra-list">${extraEntries.map(e => {
          const isAct = e.key === active;
          const ext = isExternal(e.href) ? ' target="_blank" rel="noopener"' : '';
          return `<a href="${e.href}"${ext}${isAct ? ' class="is-active" aria-current="page"' : ''}>
            <span>${e.label}</span>
            <svg class="pw-menu-extra-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>`;
        }).join('')}</div>
      </div>` : '';

    const immoBtn = showImmo
      ? `<a href="${immoHref}" class="pw-nav-immo" target="_blank" rel="noopener">Immobilien
           <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
         </a>`
      : '';

    const navItemsBar = navItems.length
      ? `<div class="pw-nav-items">${navItems.map(n => {
          const ext = n.external || isExternal(n.href || '') ? ' target="_blank" rel="noopener"' : '';
          const cls = n.active ? ' is-active' : '';
          return `<a href="${n.href || '#'}" class="pw-nav-item${cls}"${ext}>${n.label || ''}</a>`;
        }).join('')}</div>`
      : '';

    const navItemsMenu = navItems.length
      ? `<p class="pw-menu-sublabel">Auf dieser Seite</p>
         <div class="pw-menu-sublist">${navItems.map(n => {
            const ext = n.external || isExternal(n.href || '') ? ' target="_blank" rel="noopener"' : '';
            return `<a href="${n.href || '#'}"${ext}>${n.label || ''}</a>`;
          }).join('')}</div>`
      : '';

    container.innerHTML = `
<nav class="pw-nav${lightOnTop ? ' light-on-top' : ''}" id="pw-nav" aria-label="Hauptnavigation">
  <a href="${logoHref}" class="pw-nav-logo" aria-label="Pauschenwein"><img src="${logoSrc}" alt="Pauschenwein"></a>
  <div class="pw-nav-right">
    ${navItemsBar}
    ${immoBtn}
    <button class="pw-burger" id="pw-burger" aria-label="Menü" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>
<div class="pw-menu" id="pw-menu" role="navigation" aria-label="Hauptmenü">
  <p class="pw-menu-label">Geschäftsbereiche</p>
  <div class="pw-menu-list">${areaItems}</div>
  ${extraSection}
  ${navItemsMenu}
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

  /* ─────────────────────────────────────────────────────────────────────
     VARIANT 2 · "inline" — Desktop hat die Menüpunkte direkt in der Bar
     (kein Burger auf Desktop), Mobile öffnet einen schlanken Overlay
     ausschließlich mit den site-lokalen Links (keine Geschäftsbereiche).

     Use:
       <div data-pw-navbar-inline
            data-logo-text="Dr. Anna Pauschenwein"
            data-light-on-top="true"
            data-nav-items='[{"label":"Über mich","href":"#ueber-mich"}, …]'
            data-cta-label="Kontakt"
            data-cta-href="#kontakt"
            data-menu-invert="true"></div>

     Optional:
       data-logo            URL zum Bild-Logo (statt data-logo-text)
       data-logo-href       Link-Ziel des Logos (Default: "/")
       data-active          Für aria-current Markierung im Menü
       data-menu-invert     "true" → Overlay weiß statt Ink (med-Look)
     ───────────────────────────────────────────────────────────────────── */
  const CSS_INLINE = `
.pw-navi {
  position: fixed; inset: 0 0 auto 0; z-index: 100; height: var(--nav-h);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 var(--pad-x); gap: 24px;
  background: transparent; border-bottom: 1px solid transparent;
  transition: background 0.5s var(--ease), border-color 0.5s ease, height 0.4s var(--ease);
}
.pw-navi.scrolled { height: 70px; background: rgba(14,18,19,0.86); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom-color: var(--line); }
.pw-navi-logo { flex-shrink: 0; display: inline-flex; align-items: center; gap: 12px; color: #fff; text-decoration: none; }
.pw-navi-logo img { height: 46px; width: auto; transition: height 0.4s var(--ease), filter 0.5s var(--ease); display: block; }
.pw-navi.scrolled .pw-navi-logo img { height: 38px; }
.pw-navi-logo-text { font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; font-size: 0.95rem; color: #fff; transition: color 0.5s var(--ease); white-space: nowrap; }
.pw-navi.scrolled .pw-navi-logo-text { font-size: 0.85rem; }
.pw-navi-right { display: flex; align-items: center; gap: 36px; }
.pw-navi-items { display: flex; align-items: center; gap: 30px; }
.pw-navi-items a {
  font-size: 0.78rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
  color: rgba(255,255,255,0.82); transition: color 0.4s var(--ease); white-space: nowrap;
  position: relative; text-decoration: none;
}
.pw-navi-items a::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right center; transition: transform 0.4s var(--ease); }
.pw-navi-items a:hover::after { transform: scaleX(1); transform-origin: left center; }
.pw-navi-items a.is-active { color: rgba(255,255,255,0.5); }
.pw-navi-cta {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 0.78rem 1.5rem; font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: #0e1213; border: 1px solid #ffffff;
  background: #ffffff; border-radius: 0;
  transition: color 0.4s var(--ease), background 0.4s var(--ease), border-color 0.4s var(--ease);
  text-decoration: none; white-space: nowrap;
}
.pw-navi-cta:hover { background: transparent; color: #ffffff; }
.pw-navi-burger { display: none; flex-direction: column; gap: 6px; background: none; border: none; cursor: pointer; padding: 6px; }
.pw-navi-burger span { display: block; width: 26px; height: 1.5px; background: #fff; transition: transform 0.4s var(--ease), opacity 0.3s, background 0.4s var(--ease); }
.pw-navi-burger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
.pw-navi-burger.open span:nth-child(2) { opacity: 0; }
.pw-navi-burger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

/* ── Light-on-top: bei Scroll 0 dunkler Text auf hellem Hero ── */
.pw-navi.light-on-top:not(.scrolled):not(.menu-open) .pw-navi-logo img { filter: invert(1) brightness(0); }
.pw-navi.light-on-top:not(.scrolled):not(.menu-open) .pw-navi-logo-text { color: #0e1213; }
.pw-navi.light-on-top:not(.scrolled):not(.menu-open) .pw-navi-items a { color: rgba(14,18,19,0.78); }
.pw-navi.light-on-top:not(.scrolled):not(.menu-open) .pw-navi-items a:hover { color: #0e1213; }
.pw-navi.light-on-top:not(.scrolled):not(.menu-open) .pw-navi-burger span { background: #0e1213; }
.pw-navi.light-on-top:not(.scrolled):not(.menu-open) .pw-navi-cta {
  color: #ffffff; background: #0e1213; border-color: #0e1213;
}
.pw-navi.light-on-top:not(.scrolled):not(.menu-open) .pw-navi-cta:hover {
  background: transparent; color: #0e1213;
}

@media (max-width: 900px) {
  .pw-navi-items, .pw-navi-cta { display: none; }
  .pw-navi-burger { display: flex; }
}

/* ── Mobile Overlay-Menü (Standard: ink-bg, weiß-Text) ── */
.pw-navi-menu {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: #0e1213; z-index: 99;
  padding: calc(var(--nav-h) + 32px) var(--pad-x) 40px;
  display: flex; flex-direction: column; overflow-y: auto;
  visibility: hidden; opacity: 0; pointer-events: none;
  transition: opacity 0.28s var(--ease), visibility 0.28s var(--ease);
}
.pw-navi-menu.open { visibility: visible; opacity: 1; pointer-events: auto; }
.pw-navi-menu-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 14px; }
.pw-navi-menu-list { display: flex; flex-direction: column; margin-bottom: 36px; }
.pw-navi-menu-list a {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 1.4rem; font-weight: 300; letter-spacing: -0.01em;
  color: #fff; text-decoration: none;
  padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.10);
  transition: padding-left 0.35s var(--ease), color 0.3s var(--ease);
  opacity: 0; transform: translateY(12px);
}
.pw-navi-menu.open .pw-navi-menu-list a { opacity: 1; transform: none; transition: opacity 0.5s var(--ease), transform 0.5s var(--ease), padding-left 0.35s var(--ease); }
.pw-navi-menu.open .pw-navi-menu-list a:nth-child(1) { transition-delay: 0.10s; }
.pw-navi-menu.open .pw-navi-menu-list a:nth-child(2) { transition-delay: 0.16s; }
.pw-navi-menu.open .pw-navi-menu-list a:nth-child(3) { transition-delay: 0.22s; }
.pw-navi-menu.open .pw-navi-menu-list a:nth-child(4) { transition-delay: 0.28s; }
.pw-navi-menu.open .pw-navi-menu-list a:nth-child(5) { transition-delay: 0.34s; }
.pw-navi-menu.open .pw-navi-menu-list a:nth-child(6) { transition-delay: 0.40s; }
.pw-navi-menu-list a:hover { padding-left: 10px; }
.pw-navi-menu-foot { margin-top: auto; }
.pw-navi-menu-foot a {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 0.9rem 1.6rem; font-size: 0.78rem; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: #0e1213; background: #fff; border: 1px solid #fff;
  text-decoration: none; transition: background 0.4s var(--ease), color 0.4s var(--ease);
}
.pw-navi-menu-foot a:hover { background: transparent; color: #fff; }

/* ── Menu-Invert: weiß-bg + dunkle Schrift (med-Look) ── */
.pw-navi-menu.invert { background: #ffffff; }
.pw-navi-menu.invert .pw-navi-menu-label { color: rgba(14,18,19,0.5); }
.pw-navi-menu.invert .pw-navi-menu-list a { color: #0e1213; border-bottom-color: rgba(14,18,19,0.10); }
.pw-navi-menu.invert .pw-navi-menu-foot a { background: #0e1213; color: #fff; border-color: #0e1213; }
.pw-navi-menu.invert .pw-navi-menu-foot a:hover { background: transparent; color: #0e1213; }
/* Burger-X folgt der Hintergrundfarbe: bei invert dunkel, sonst weiß */
.pw-navi.menu-open.menu-invert .pw-navi-burger span { background: #0e1213 !important; }
.pw-navi.menu-open:not(.menu-invert) .pw-navi-burger span { background: #ffffff !important; }
/* Bei offenem Menü übernimmt das Overlay den Hintergrund — Navbar selbst transparent
   damit der Streifen nicht gegen die Overlay-Farbe arbeitet */
.pw-navi.menu-open { background: transparent !important; border-bottom-color: transparent !important; }
`;

  if (!document.getElementById('pw-nav-inline-style')) {
    const styleI = document.createElement('style');
    styleI.id = 'pw-nav-inline-style';
    styleI.textContent = CSS_INLINE;
    document.head.appendChild(styleI);
  }

  function renderInline(container) {
    const cfg = container.dataset;
    const lightOnTop = cfg.lightOnTop === 'true';
    const menuInvert = cfg.menuInvert === 'true';
    const logoHref = cfg.logoHref || '/';
    const logoText = cfg.logoText || '';
    const logoSrc = cfg.logo || '';
    const ctaLabel = cfg.ctaLabel || 'Kontakt';
    const ctaHref = cfg.ctaHref || cfg.contactHref || '#kontakt';
    const isExternal = (h) => /^https?:\/\//.test(h);

    let navItems = [];
    if (cfg.navItems) {
      try { navItems = JSON.parse(cfg.navItems); } catch (e) {
        console.warn('[pw-navbar-inline] data-nav-items ist kein gültiges JSON:', e);
      }
    }

    const logoInner = logoSrc
      ? `<img src="${logoSrc}" alt="${logoText || 'Pauschenwein'}">`
      : `<span class="pw-navi-logo-text">${logoText}</span>`;

    const navItemsHTML = navItems.map(n => {
      const ext = n.external || isExternal(n.href || '') ? ' target="_blank" rel="noopener"' : '';
      const cls = n.active ? ' class="is-active"' : '';
      return `<a href="${n.href || '#'}"${cls}${ext}>${n.label || ''}</a>`;
    }).join('');

    const menuItemsHTML = navItems.map(n => {
      const ext = n.external || isExternal(n.href || '') ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${n.href || '#'}"${ext}>${n.label || ''}</a>`;
    }).join('');

    const ctaExt = isExternal(ctaHref) ? ' target="_blank" rel="noopener"' : '';

    container.innerHTML = `
<nav class="pw-navi${lightOnTop ? ' light-on-top' : ''}${menuInvert ? ' menu-invert' : ''}" aria-label="Hauptnavigation">
  <a href="${logoHref}" class="pw-navi-logo" aria-label="Startseite">${logoInner}</a>
  <div class="pw-navi-right">
    ${navItemsHTML ? `<div class="pw-navi-items">${navItemsHTML}</div>` : ''}
    <a href="${ctaHref}" class="pw-navi-cta"${ctaExt}>${ctaLabel}</a>
    <button class="pw-navi-burger" aria-label="Menü" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>
<div class="pw-navi-menu${menuInvert ? ' invert' : ''}" role="navigation" aria-label="Hauptmenü">
  <p class="pw-navi-menu-label">Navigation</p>
  <div class="pw-navi-menu-list">${menuItemsHTML}</div>
  <div class="pw-navi-menu-foot">
    <a href="${ctaHref}"${ctaExt}>${ctaLabel}</a>
  </div>
</div>`;

    const nav = container.querySelector('.pw-navi');
    const burger = container.querySelector('.pw-navi-burger');
    const menu = container.querySelector('.pw-navi-menu');

    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const setMenu = (open) => {
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      nav.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  }

  // Alle Container auf der Seite rendern
  function init() {
    document.querySelectorAll('[data-pw-navbar]').forEach(render);
    document.querySelectorAll('[data-pw-navbar-inline]').forEach(renderInline);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
