/* ─────────────────────────────────────────────────────────────
 * Pauschenwein Design-System · Smooth Scroll
 * Lädt Lenis (https://github.com/darkroomengineering/lenis) und
 * aktiviert smoothes Scrollen + smoothes Anker-Klick-Verhalten.
 * Standard auf allen Pauschenwein-Seiten.
 *
 * Einbindung (am Ende des <body>, defer ist okay):
 *   <script src="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/smooth-scroll.js" defer></script>
 *
 * Respektiert prefers-reduced-motion (kein Smooth-Scroll).
 * ───────────────────────────────────────────────────────────── */
(function () {
  if (window.__pwSmoothScrollInit) return;
  window.__pwSmoothScrollInit = true;

  /* Lenis wird aus dem Design-System selbst ausgeliefert (siehe vendor/).
     Die Basis-URL wird aus der URL DIESES Skripts abgeleitet: lokal gehostet
     entsteht damit keine Drittanbieter-Anfrage (DSGVO), per jsDelivr geladen
     verhält sich alles wie vorher. Überschreibbar per window.PW_DS_BASE. */
  const LENIS_CDN = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
  const LENIS_LOCAL = (function () {
    if (window.PW_DS_BASE) {
      return String(window.PW_DS_BASE).replace(/\/+$/, '') + '/vendor/lenis-1.1.13.min.js';
    }
    const self = document.currentScript;
    if (self && self.src) {
      try { return new URL('./vendor/lenis-1.1.13.min.js', self.src).href; } catch (e) {}
    }
    return LENIS_CDN;
  })();

  // 1) Lenis-Pflicht-CSS — damit nichts gegen Lenis kämpft
  const css = `
    html.lenis, html.lenis body { height: auto; }
    .lenis.lenis-smooth { scroll-behavior: auto !important; }
    .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
    .lenis.lenis-stopped { overflow: hidden; }
  `;
  const style = document.createElement('style');
  style.setAttribute('data-pw-smooth-scroll', '');
  style.textContent = css;
  document.head.appendChild(style);

  // 2) Lenis dynamisch laden, dann initialisieren
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NAV_OFFSET = 70;

  function bindAnchors(lenis) {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      if (a.__pwSmoothBound) return;
      a.__pwSmoothBound = true;
      a.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (!id || id === '#') return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(t, { offset: -NAV_OFFSET, duration: 1.25 });
        } else {
          const y = t.getBoundingClientRect().top + scrollY - NAV_OFFSET;
          scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  function init() {
    let lenis = null;
    if (!reduceMotion && typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        lerp: 0.1
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      window.__pwLenis = lenis;
    }
    bindAnchors(lenis);
    // Nach kurzer Verzögerung re-binden (für Anker in Navbar/Footer, die später injiziert werden)
    setTimeout(() => bindAnchors(lenis), 400);
    setTimeout(() => bindAnchors(lenis), 1200);
  }

  if (reduceMotion) {
    // Auch ohne Lenis: native Smooth-Anchor-Links
    bindAnchors(null);
    return;
  }

  if (typeof Lenis !== 'undefined') {
    init();
  } else {
    const s = document.createElement('script');
    s.src = LENIS_LOCAL;
    s.defer = true;
    s.onload = init;
    // Fällt auf jsDelivr zurück, falls die lokale Kopie fehlt (z. B. Site noch
    // nicht gesynct). Schlägt auch das fehl: native Anchor-Links.
    s.onerror = () => {
      if (s.src === LENIS_CDN) { bindAnchors(null); return; }
      const f = document.createElement('script');
      f.src = LENIS_CDN;
      f.defer = true;
      f.onload = init;
      f.onerror = () => bindAnchors(null);
      document.head.appendChild(f);
    };
    document.head.appendChild(s);
  }
})();
