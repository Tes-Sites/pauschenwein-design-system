/* ──────────────────────────────────────────────────────────────────────
   PAUSCHENWEIN DESIGN SYSTEM · footer.js
   Selbst-injizierender Footer für alle Pauschenwein-Seiten.
   CSS + HTML + Verhalten (Cursor-folgende Wortmarke) in einer Datei.

   Usage (alle data-Attribute sind optional, Defaults siehe unten):
     <div data-pw-footer
          data-site-name="Pauschenwein Bau"
          data-phone="+43 3136 20990"
          data-phone-href="tel:+43313620990"
          data-email="bau@pauschenwein-gruppe.at"
          data-address="8511 St. Stefan ob Stainz 16,<br>Weststeiermark"
          data-newsletter-headline="Erstgespräch sichern."
          data-newsletter-email="office@pauschenwein-gruppe.at"
          data-wordmark-href="#"
          data-wordmark-label="Nach oben"
          data-back-href=""
          data-nav-links='[{"label":"Bereiche","href":"#bereiche"},{"label":"Kontakt","href":"#kontakt"}]'></div>
     <script src="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/footer.js" defer></script>

   data-nav-links: JSON-Array für die mittlere Navi-Spalte. Wenn nicht
                   gesetzt, wird der Default-Set für die Gruppen-Seite
                   verwendet.
   ────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────────────
     Basis-URL für eigene Assets (Logos, Wortmarke, Fonts, Lenis).
     Wird aus der URL DIESES Skripts abgeleitet. Dadurch funktioniert die
     Datei unverändert in beiden Betriebsarten:
       • per jsDelivr geladen  → Assets kommen von jsDelivr
       • lokal gehostet (self-hosted, DSGVO-konform, schneller)
         → Assets kommen von der eigenen Domain
     Überschreibbar per window.PW_DS_BASE (ohne Slash am Ende).
     ────────────────────────────────────────────────────────────────────── */
  const DS_FALLBACK = 'https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main';
  const CDN = (function () {
    if (typeof window !== 'undefined' && window.PW_DS_BASE) {
      return String(window.PW_DS_BASE).replace(/\/+$/, '');
    }
    // document.currentScript ist während der Top-Level-Ausführung gesetzt
    // (gilt auch für defer-Skripte) — deshalb hier sofort auslesen.
    const self = document.currentScript;
    if (self && self.src) {
      try { return new URL('.', self.src).href.replace(/\/+$/, ''); } catch (e) {}
    }
    return DS_FALLBACK;
  })();

  const CSS = `
.pwfooter { background: #080d0e; color: rgba(255,255,255,0.6); position: relative; font-family: var(--font, 'Poppins', sans-serif); }
.pwfooter a { color: inherit; text-decoration: none; transition: color 0.25s ease; }
.pwfooter--fre { padding: 90px 0 34px; border-top: 1px solid rgba(255,255,255,0.06); overflow: hidden; }
.pwfooter--fre .pwf-container { width: 100%; margin: 0 auto; padding: 0 var(--pad-x, clamp(20px, 5vw, 80px)); }

.pwfooter--fre .pwf-top { display: grid; grid-template-columns: 1.6fr 1fr 0.7fr; gap: 56px; align-items: start; }
.pwfooter--fre .pwf-news h3 { font-size: clamp(1.4rem, 2.2vw, 1.9rem); font-weight: 600; color: #fff; letter-spacing: -0.01em; margin-bottom: 30px; }
.pwfooter--fre .pwf-news-form { display: flex; align-items: center; gap: 16px; max-width: 420px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 12px; }
.pwfooter--fre .pwf-news-form input { flex: 1; background: none; border: none; outline: none; color: #fff; font-family: inherit; font-size: 0.95rem; }
.pwfooter--fre .pwf-news-form input::placeholder { color: rgba(255,255,255,0.4); }
.pwfooter--fre .pwf-news-form button { background: none; border: none; cursor: pointer; color: #fff; display: flex; padding: 0; }
.pwfooter--fre .pwf-news-form button svg { width: 26px; height: 26px; stroke: currentColor; fill: none; stroke-width: 1.6; transition: transform 0.25s; }
.pwfooter--fre .pwf-news-form button:hover svg { transform: translateX(4px); }

/* Newsletter-CTA (Typeform-Popup statt E-Mail-Feld) */
.pwfooter--fre .pwf-news-cta {
  display: inline-flex; align-items: center; gap: 12px; cursor: pointer;
  background: #fff; color: #0e1213; border: 1px solid #fff; border-radius: 0;
  font-family: inherit; font-size: 0.78rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  padding: 16px 26px; transition: background 0.3s ease, color 0.3s ease;
}
.pwfooter--fre .pwf-news-cta svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.7; transition: transform 0.35s ease; }
.pwfooter--fre .pwf-news-cta:hover { background: transparent; color: #fff; }
.pwfooter--fre .pwf-news-cta:hover svg { transform: translate(4px,-4px); }

.pwfooter--fre .pwf-nav { display: flex; flex-direction: column; gap: 12px; }
.pwfooter--fre .pwf-nav a { font-size: 1.35rem; font-weight: 500; color: #fff; letter-spacing: -0.01em; }
.pwfooter--fre .pwf-nav a:hover { color: rgba(255,255,255,0.55); }

.pwfooter--fre .pwf-social-col { display: flex; flex-direction: column; gap: 12px; }
.pwfooter--fre .pwf-social-col a { font-size: 0.92rem; color: rgba(255,255,255,0.6); }
.pwfooter--fre .pwf-social-col a:hover { color: #fff; }

.pwfooter--fre .pwf-contact { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 64px; max-width: 760px; }
.pwfooter--fre .pwf-label { display: block; font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 12px; }
.pwfooter--fre .pwf-contact-item a, .pwfooter--fre .pwf-contact-item span.value { font-size: 0.92rem; color: rgba(255,255,255,0.8); line-height: 1.6; display: block; }
.pwfooter--fre .pwf-contact-item a:hover { color: #fff; }

.pwfooter--fre .pwf-wordmark { margin: 56px 0 40px; display: block; position: relative; cursor: none; }
.pwfooter--fre .pwf-wordmark img { display: block; width: 100%; height: auto; transition: opacity 0.45s ease; }
.pwfooter--fre .pwf-wordmark.is-hovering img { opacity: 0.55; }
.pwfooter--fre .pwf-wordmark-cursor {
  position: absolute; top: 0; left: 0; pointer-events: none;
  display: inline-flex; align-items: center; justify-content: center;
  width: 168px; height: 168px; border-radius: 50%;
  background: #0a0f10; color: #fff;
  font-family: inherit; font-size: 0.95rem; font-weight: 400;
  line-height: 1.35; letter-spacing: 0.01em; text-align: center;
  opacity: 0; transform: translate(0,0) translate(-50%,-50%) scale(0.7);
  transition: opacity 0.32s ease, scale 0.4s cubic-bezier(.2,.9,.3,1.2);
  box-shadow: 0 18px 50px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.35);
  will-change: transform;
}
.pwfooter--fre .pwf-wordmark-cursor-label { display: block; padding: 0 14px; }
.pwfooter--fre .pwf-wordmark.is-hovering .pwf-wordmark-cursor { opacity: 1; scale: 1; }
@media (hover: none) {
  .pwfooter--fre .pwf-wordmark { cursor: pointer; }
  .pwfooter--fre .pwf-wordmark-cursor { display: none; }
}

.pwfooter--fre .pwf-bottom { padding-top: 26px; border-top: 1px solid rgba(255,255,255,0.07); display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 24px; }
.pwfooter--fre .pwf-legal { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.pwfooter--fre .pwf-legal a { font-size: 0.78rem; color: rgba(255,255,255,0.45); }
.pwfooter--fre .pwf-legal a:hover { color: #fff; }
.pwfooter--fre .pwf-name { font-size: 0.8rem; color: rgba(255,255,255,0.6); white-space: nowrap; }

.pwfooter--fre .pwf-credit { display: inline-flex; align-items: center; gap: 10px; font-size: 0.76rem; color: rgba(255,255,255,0.4); white-space: nowrap; }
.pwfooter--fre .pwf-credit img { height: 22px; width: auto; opacity: 0.7; transition: opacity 0.25s ease; display: inline-block; }
.pwfooter--fre .pwf-credit a:hover img { opacity: 1; }

@media (max-width: 1024px) {
  .pwfooter--fre .pwf-top { grid-template-columns: 1.4fr 1fr; gap: 40px; }
  .pwfooter--fre .pwf-social-col { grid-column: 2; margin-top: 18px; }
}
@media (max-width: 768px) {
  .pwfooter--fre { padding: 64px 0 28px; }
  .pwfooter--fre .pwf-top { grid-template-columns: 1fr; gap: 40px; }
  .pwfooter--fre .pwf-social-col { grid-column: 1; flex-direction: row; gap: 20px; margin-top: 0; }
  .pwfooter--fre .pwf-contact { grid-template-columns: 1fr; gap: 26px; margin-top: 48px; }
  .pwfooter--fre .pwf-wordmark { margin: 44px 0 32px; }
  .pwfooter--fre .pwf-bottom { grid-template-columns: 1fr; justify-items: center; text-align: center; gap: 18px; }
  .pwfooter--fre .pwf-legal { justify-content: center; }
}
  `;

  if (!document.getElementById('pw-footer-style')) {
    const style = document.createElement('style');
    style.id = 'pw-footer-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ───────── Default-Daten ─────────
  const DEFAULT_NAV = [
    { label: 'Bereiche',   href: 'https://pauschenwein-gruppe.at/#bereiche' },
    { label: 'Über uns',   href: 'https://pauschenwein-gruppe.at/#intro' },
    { label: 'Karriere',   href: 'https://pauschenwein-gruppe.at/karriere/' },
    { label: 'Referenzen', href: 'https://pauschenwein-gruppe.at/#referenzen' },
    { label: 'Kontakt',    href: 'https://pauschenwein-gruppe.at/#kontakt' }
  ];

  const DEFAULT_SOCIAL = [
    { label: 'Facebook',  href: 'https://www.facebook.com/p/Pauschenwein-Partner-GmbH-Co-KG-100065271079351/' },
    { label: 'Instagram', href: 'https://www.instagram.com/pauschenweingruppe/' },
    { label: 'LinkedIn',  href: 'https://linkedin.com/company/pauschenweingruppe/' }
  ];

  const DEFAULT_LEGAL = [
    { label: 'Impressum',  href: 'https://www.pauschenwein-gruppe.at/impressum' },
    { label: 'Datenschutz', href: 'https://www.pauschenwein-gruppe.at/datenschutz' },
    { label: 'AGB',         href: 'https://www.pauschenwein-gruppe.at/agb' }
  ];

  function parseJSON(s, fallback) {
    if (!s) return fallback;
    try { return JSON.parse(s); } catch (e) { return fallback; }
  }

  function render(container) {
    const cfg = container.dataset;
    const siteName    = cfg.siteName     || 'Pauschenwein Gruppe';
    const phone       = cfg.phone        || '+43 3136 20990';
    const phoneHref   = cfg.phoneHref    || ('tel:' + phone.replace(/[^+0-9]/g, ''));
    const email       = cfg.email        || 'office@pauschenwein-gruppe.at';
    const emailHref   = cfg.emailHref    || ('mailto:' + email);
    const address     = cfg.address      || '8511 St. Stefan ob Stainz 16,<br>Weststeiermark';
    const addressHref = cfg.addressHref  || '#kontakt';
    const nlHead      = cfg.newsletterHeadline || 'Erstgespräch sichern.';
    const nlEmail     = cfg.newsletterEmail || 'office@pauschenwein-gruppe.at';
    const nlPh        = cfg.newsletterPlaceholder || 'Ihre E-Mail-Adresse';
    const nlTypeform  = cfg.newsletterTypeform || '';   // Typeform-ID → CTA-Button statt E-Mail-Feld
    const nlCtaLabel  = cfg.newsletterCta || 'Jetzt anfragen';
    const wordmarkHref  = cfg.wordmarkHref || (cfg.backHref || '#');
    const wordmarkLabel = cfg.wordmarkLabel || (cfg.backHref ? 'Zur Pauschenwein<br>Gruppe' : 'Nach<br>oben');
    const wordmarkImg = cfg.wordmarkImg || (CDN + '/assets/pw-wordmark.png');
    const temmerImg   = cfg.temmerImg || (CDN + '/assets/temmer-footer-white.svg');
    const year = new Date().getFullYear();

    const navLinks   = parseJSON(cfg.navLinks,    DEFAULT_NAV);
    const socials    = parseJSON(cfg.socialLinks, DEFAULT_SOCIAL);
    const legalLinks = parseJSON(cfg.legalLinks,  DEFAULT_LEGAL);

    const navHTML = navLinks.map(l => {
      const ext = /^https?:\/\//.test(l.href) ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${l.href}"${ext}>${l.label}</a>`;
    }).join('');
    const socialHTML = socials.map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('');
    const legalHTML = legalLinks.map(l => {
      const ext = /^https?:\/\//.test(l.href) ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${l.href}"${ext}>${l.label}</a>`;
    }).join('');

    const isExt = /^https?:\/\//.test(wordmarkHref);
    const wmExt = isExt ? ' target="_blank" rel="noopener"' : '';

    container.innerHTML = `
<footer class="pwfooter pwfooter--fre" role="contentinfo">
  <div class="pwf-container">
    <div class="pwf-top">
      <div class="pwf-news">
        <h3>${nlHead}</h3>
        ${nlTypeform ? `
        <button class="pwf-news-cta" type="button" data-tf-popup="${nlTypeform}" data-tf-iframe-props="title=Anfrage" data-tf-medium="footer-cta" aria-label="${nlCtaLabel}">
          <span>${nlCtaLabel}</span>
          <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>` : `
        <form class="pwf-news-form" action="mailto:${nlEmail}" method="post" enctype="text/plain">
          <input type="email" name="email" placeholder="${nlPh}" aria-label="E-Mail-Adresse" required>
          <button type="submit" aria-label="Absenden">
            <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></svg>
          </button>
        </form>`}
      </div>
      <nav class="pwf-nav" aria-label="Footer-Navigation">${navHTML}</nav>
      <div class="pwf-social-col">${socialHTML}</div>
    </div>

    <div class="pwf-contact">
      <div class="pwf-contact-item">
        <span class="pwf-label">Zentrale</span>
        <a href="${addressHref}">${address}</a>
      </div>
      <div class="pwf-contact-item">
        <span class="pwf-label">E-Mail</span>
        <a href="${emailHref}">${email}</a>
      </div>
      <div class="pwf-contact-item">
        <span class="pwf-label">Anruf</span>
        <a href="${phoneHref}">${phone}</a>
      </div>
    </div>

    <a class="pwf-wordmark" href="${wordmarkHref}"${wmExt} aria-label="${wordmarkLabel.replace(/<[^>]+>/g, ' ')}">
      <img src="${wordmarkImg}" alt="Pauschenwein">
      <span class="pwf-wordmark-cursor" aria-hidden="true">
        <span class="pwf-wordmark-cursor-label">${wordmarkLabel}</span>
      </span>
    </a>

    <div class="pwf-bottom">
      <nav class="pwf-legal" aria-label="Rechtliches">
        ${legalHTML}
        <a href="https://www.pauschenwein-gruppe.at/" target="_blank" rel="noopener">PAUSCHENWEIN gruppe</a>
      </nav>
      <span class="pwf-name">${siteName}</span>
      <span class="pwf-credit">© ${year} · Marketing by <a href="https://temmermethode.com" target="_blank" rel="noopener"><img src="${temmerImg}" alt="Temmermethode"></a></span>
    </div>
  </div>
</footer>`;

    // ── Typeform-Embed-Script laden (für den Newsletter-CTA-Popup) ──
    if (nlTypeform && !document.getElementById('pw-typeform-embed')) {
      const tfScript = document.createElement('script');
      tfScript.id = 'pw-typeform-embed';
      tfScript.src = 'https://embed.typeform.com/next/embed.js';
      document.head.appendChild(tfScript);
    }

    // ── Cursor-folgende Wortmarke ──
    const link = container.querySelector('.pwf-wordmark');
    if (!link || matchMedia('(hover: none)').matches) return;
    const cursor = link.querySelector('.pwf-wordmark-cursor');
    if (!cursor) return;
    let rect = null, tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    const tick = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) raf = requestAnimationFrame(tick);
      else raf = null;
    };
    link.addEventListener('mouseenter', (e) => {
      rect = link.getBoundingClientRect();
      tx = cx = e.clientX - rect.left; ty = cy = e.clientY - rect.top;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      link.classList.add('is-hovering');
    });
    link.addEventListener('mousemove', (e) => {
      if (!rect) rect = link.getBoundingClientRect();
      tx = e.clientX - rect.left; ty = e.clientY - rect.top;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    link.addEventListener('mouseleave', () => { rect = null; link.classList.remove('is-hovering'); });
  }

  function init() {
    document.querySelectorAll('[data-pw-footer]').forEach(render);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
