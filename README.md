# Pauschenwein Design System

Shared navbar, footer, design tokens, Poppins-Fonts und Assets für **alle Pauschenwein-Gruppe-Websites**. Ohne Build-Step. Wird per `sync.sh` in jede Site kopiert und von deren eigener Domain ausgeliefert (self-hosted); die alte jsDelivr-Einbindung funktioniert weiterhin, ist aber nicht mehr der Standard — siehe unten.

## ⚠️ Verbindlich seit 31.08.2026: Design-System self-hosted einbinden

Die Einbindung per **jsDelivr** und die Einbindung von **Google Fonts** sind
**nicht mehr der Standard**. Beides sind Drittanbieter-Anfragen, bei denen die
IP-Adresse jedes Besuchers an einen Dritten übertragen wird — ohne
Einwilligung und ohne dass das in den Datenschutzerklärungen der Seiten
abgebildet wäre. Ein Datenschutz-Check (Förderberatung Aichbauer, 24.07.2026)
hat das für das Wohlfühlzentrum ausdrücklich als **rechtlich riskant**
bewertet; derselbe Befund gilt für **alle** Pauschenwein-Seiten, weil alle
dieselbe Einbindung verwenden. Dazu kostet der Cross-Origin-Roundtrip
messbar Ladezeit (render-blockierend, extra DNS + TLS).

**Deshalb gilt jetzt:** jede Site hält eine lokale Kopie des Design-Systems
unter `assets/pw-ds/` und liefert sie von der eigenen Domain aus.

### Schritt 1 — Sync (einmalig pro Site, danach zum Aktualisieren)

Im Wurzelverzeichnis der Site (dort, wo `index.html` liegt):

```bash
curl -sL https://raw.githubusercontent.com/Tes-Sites/pauschenwein-design-system/main/sync.sh | bash
```

Das legt `assets/pw-ds/` an (Tokens, Fonts, Navbar, Footer, Smooth-Scroll,
Logos, Lenis) und schreibt `assets/pw-ds/VERSION.txt` mit dem Quell-Commit.

### Schritt 2 — Einbindung in der Site

```html
<!-- <head> -->
<link rel="preload" href="/assets/pw-ds/fonts/poppins-300-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/pw-ds/fonts/poppins-700-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/pw-ds/fonts.css">
<link rel="stylesheet" href="/assets/pw-ds/tokens.css">
```

```html
<!-- Ende <body> -->
<script src="/assets/pw-ds/navbar.js" defer></script>
<script src="/assets/pw-ds/footer.js" defer></script>
<script src="/assets/pw-ds/smooth-scroll.js" defer></script>
```

Die `<link rel="preconnect">` zu `fonts.googleapis.com` / `fonts.gstatic.com`
und der Google-Fonts-`<link>` sind dabei **zu entfernen**.

`navbar.js`, `footer.js` und `smooth-scroll.js` leiten ihre Basis-URL
**automatisch aus ihrer eigenen Skript-URL** ab (`document.currentScript`).
Logo, Wortmarke, Temmer-Signet und Lenis werden dadurch ebenfalls lokal
geladen — ohne jede zusätzliche Konfiguration. Notfalls lässt sich die
Basis mit `window.PW_DS_BASE = '/assets/pw-ds'` (vor den Skripten) erzwingen.

### Aktualisieren

`sync.sh` erneut ausführen und committen. Der Ordner `assets/pw-ds/` wird
**nie manuell editiert** — Änderungen gehören in dieses Repo, damit alle
Seiten davon profitieren.

### Cache

Weil die Dateien jetzt von der eigenen Domain kommen, gehören sie in die
`_headers` der Site mit langer Cache-Zeit (der Ordnername wechselt beim
Update nicht, deshalb **revalidierend**, nicht `immutable`):

```
/assets/pw-ds/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
```

### jsDelivr weiterhin möglich (Legacy)

Die alte Einbindung funktioniert unverändert weiter — die Skripte erkennen,
dass sie von jsDelivr kommen, und laden ihre Assets dann von dort. Neue Seiten
sollen sie aber nicht mehr verwenden.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/tokens.css">
```

## Quickstart (Markup)

Am Anfang des `<body>` (für die Navbar) — **Standard-Subsite** mit eigenen Menüpunkten:

```html
<div data-pw-navbar
     data-active="bau"
     data-nav-items='[
       {"label":"Leistungen","href":"#leistungen"},
       {"label":"Referenzen","href":"#referenzen"},
       {"label":"Über uns","href":"#ueber-uns"}
     ]'
     data-contact-href="#kontakt"></div>
<script src="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/navbar.js" defer></script>
```

**Gruppen-Spezialfall** (minimal: nur Logo + Immobilien-Quicklink + Burger):

```html
<div data-pw-navbar
     data-active="gruppe"
     data-immo-show="true"
     data-light-on-top="true"
     data-contact-href="#kontakt"></div>
```

Am Ende des `<body>` (für den Footer + Smooth-Scroll):

```html
<div data-pw-footer
     data-site-name="Pauschenwein Bau"
     data-phone="+43 3136 20990"
     data-email="bau@pauschenwein-gruppe.at"
     data-address="8511 St. Stefan ob Stainz 16,<br>Weststeiermark"
     data-back-href="https://pauschenwein-gruppe.at"></div>
<script src="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/footer.js" defer></script>

<!-- Smooth-Scroll (Standard auf allen Pauschenwein-Seiten) -->
<script src="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/smooth-scroll.js" defer></script>
```

> **Wichtig:** `smooth-scroll.js` ist der **verbindliche Standard** für alle Pauschenwein-Seiten. Bitte nicht weglassen — die Sites sollen sich konsistent anfühlen. Wenn eine Seite bereits eine eigene Lenis-Initialisierung hat, ist diese ersatzlos zu entfernen und durch das Design-System-Skript zu ersetzen. Auch die CSS-Regel `html { scroll-behavior: smooth }` ist zu entfernen — Lenis übernimmt das.

## Komponenten

### `fonts.css` + `fonts/` — Poppins, lokal gehostet
Poppins in 300/400/500/600/700, Subsets `latin` + `latin-ext`, als `woff2`
(je ~8 KB, gesamt 80 KB). `font-display: swap`. Ersetzt die Google-Fonts-
Einbindung vollständig — **keine** Anfrage mehr an `fonts.googleapis.com`
oder `fonts.gstatic.com`. Die `@font-face`-Regeln verweisen relativ auf
`./fonts/…`, dadurch funktioniert die Datei an jedem Ort, an den `sync.sh`
sie kopiert.

Kritische Schnitte (300 für Body, 700 für Hero-H1) sollten in der Site
per `<link rel="preload" … crossorigin>` vorgeladen werden.

### `vendor/lenis-1.1.13.min.js` — Lenis, lokal
Wird von `smooth-scroll.js` geladen. Vorher kam Lenis von jsDelivr;
jetzt aus dem Design-System selbst, mit jsDelivr nur noch als Fallback.


### `tokens.css` — Brand-Variablen + Base-Reset + Typo-Primitive

CSS Custom Properties für Farben, Fonts, Spacing, Easing.
Body-Reset (margins, font-family, etc.).
Wiederverwendbare Klassen: `.display`, `.h2`, `.kicker`, `.lede`, `.small`, `.btn`, `.reveal`, `.clip`, `.wrap`, `.pad`, `.rule`.

**Theme-Switching:**

```html
<html data-pw-theme="dark">    <!-- Standard: helle Schrift auf #0e1213 -->
<html data-pw-theme="light">   <!-- Invertiert: dunkle Schrift auf #fff -->
```

### `navbar.js` — Fixed Navbar + Burger-Overlay-Menü

Vollständig selbst-injizierend. Lädt CSS, rendert HTML, bindet Verhalten (Scroll-State, Burger, ESC-Schließen) ein.

**Data-Attribute am Container:**

| Attribut | Default | Zweck |
|---|---|---|
| `data-active` | — | Markiert aktuellen Bereich: `bau`, `immobilien`, `wohlfuehlzentrum`, `med`, `kosmetik`, `handel`, `karriere`, `gruppe` |
| `data-light-on-top` | `false` | `true` → Navbar-Text dunkel solange nicht gescrollt (für Seiten mit hellem Hero) |
| `data-immo-href` | `https://pauschenwein-immobilien.at` | Ziel des Immobilien-Quicklinks |
| `data-immo-show` | `false` | Immobilien-Quicklink in der Bar zeigen. **Nur die Gruppen-Site setzt `true`** — alle anderen Subsites verwenden stattdessen `data-nav-items`. |
| `data-nav-items` | `[]` | JSON-Array `[{label, href, external?, active?}, …]` mit Site-eigenen Menüpunkten in der Bar (Desktop). Auf Mobile via Burger erreichbar (Sektion „Auf dieser Seite"). |
| `data-contact-href` | `#kontakt` | Ziel des „Kontakt aufnehmen"-Buttons im Menü-Footer |
| `data-karriere-href` | `https://pauschenwein-gruppe.at/karriere/` | Ziel des Karriere-Menüpunkts |
| `data-logo-href` | `/` | Logo-Klick-Ziel |
| `data-logo` | CDN-`logo-white.png` | Logo-Bild-URL (überschreibbar) |

### `footer.js` — Editorial Full-Bleed Footer mit Riesen-Wortmarke

Vollständig selbst-injizierend mit Cursor-folgender Hover-Animation auf der Wortmarke.

**Data-Attribute am Container:**

| Attribut | Default | Zweck |
|---|---|---|
| `data-site-name` | „Pauschenwein Gruppe" | Wird unten rechts angezeigt |
| `data-phone` | „+43 3136 20990" | Telefonnummer (sichtbar) |
| `data-phone-href` | abgeleitet | `tel:`-Link |
| `data-email` | „office@pauschenwein-gruppe.at" | E-Mail (sichtbar) |
| `data-email-href` | abgeleitet | `mailto:`-Link |
| `data-address` | „8511 St. Stefan ob Stainz 16,\<br\>Weststeiermark" | HTML erlaubt |
| `data-address-href` | `#kontakt` | Ziel beim Klick auf Adresse |
| `data-newsletter-headline` | „Erstgespräch sichern." | Headline der Newsletter-Sektion |
| `data-newsletter-email` | „office@pauschenwein-gruppe.at" | Empfänger des Newsletter-Forms |
| `data-back-href` | leer (= „Nach oben") | URL für die Wortmarke. Wenn gesetzt: Label = „Zur Pauschenwein Gruppe" |
| `data-wordmark-href` | `#` / `data-back-href` | Überschreibt Wortmarken-Link |
| `data-wordmark-label` | „Nach oben" / „Zur Pauschenwein Gruppe" | Text im Cursor-Bubble |
| `data-nav-links` | JSON | Mittlere Navi-Spalte. Default = Gruppe-Links |
| `data-social-links` | JSON | Rechte Social-Spalte |
| `data-legal-links` | JSON | Untere Legal-Reihe (Impressum/Datenschutz/AGB etc.) |

**JSON-Format für `data-nav-links` / `data-social-links` / `data-legal-links`:**

```html
data-nav-links='[{"label":"Leistungen","href":"#leistungen"},{"label":"Projekte","href":"#projekte"}]'
```

### `smooth-scroll.js` — Lenis-Wrapper (Standard auf allen Sites)

Lädt [Lenis](https://github.com/darkroomengineering/lenis) dynamisch nach und initialisiert smoothes Scrolling mit den projektweiten Defaults:

- `duration: 1.15`, `lerp: 0.1`, ease-out-Exponential — gleicher Charakter auf allen Pauschenwein-Sites.
- `smoothWheel: true` (Mausrad smooth), Touch bleibt nativ.
- Bindet automatisch alle `a[href^="#"]`-Anker an `lenis.scrollTo()` mit `-70 px` Nav-Offset.
- Respektiert `prefers-reduced-motion` (kein Smooth, nur native Anker).
- Re-bindet nach 400 ms + 1200 ms, damit auch Anker in später injizierter Navbar/Footer erfasst werden.

**Keine Konfiguration nötig** — einfach einbinden:

```html
<script src="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/smooth-scroll.js" defer></script>
```

**Wenn eine Seite eigene Lenis-Logik hat:** entfernen und durch das Design-System-Skript ersetzen. Doppelte Lenis-Instanzen kämpfen gegeneinander.

## Versioning

`@main` lädt immer den neuesten Stand vom `main`-Branch. Für stabile Pins:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@v1.0.0/tokens.css">
```

(Tag dafür im Repo setzen.)

## CDN-Cache

jsDelivr cached aggressiv (~12h). Bei Änderungen am Design-System:
1. Push to main
2. Optional: `https://purge.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/<file>` aufrufen
3. Eingebundene Seiten brauchen einen Hard-Refresh (Cmd+Shift+R)
