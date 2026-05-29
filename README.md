# Pauschenwein Design System

Shared navbar, footer, design tokens and assets for **all Pauschenwein-Gruppe websites**. Wird per [jsDelivr CDN](https://www.jsdelivr.com/) ohne Build-Step in jede Seite eingebunden.

## Quickstart

Im `<head>` einer Seite:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/tokens.css">
```

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

Am Ende des `<body>` (für den Footer):

```html
<div data-pw-footer
     data-site-name="Pauschenwein Bau"
     data-phone="+43 3136 20990"
     data-email="bau@pauschenwein-gruppe.at"
     data-address="8511 St. Stefan ob Stainz 16,<br>Weststeiermark"
     data-back-href="https://pauschenwein-gruppe.at"></div>
<script src="https://cdn.jsdelivr.net/gh/Tes-Sites/pauschenwein-design-system@main/footer.js" defer></script>
```

## Komponenten

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
