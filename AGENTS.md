# AGENTS.md — Interactive Travel Guides

A methodology for building single-file, offline-capable, beautifully-themed interactive guides for specific places. Read this before producing one.

---

## The core principle

> **The aesthetic must match the place.**

A guide to ancient ruins should look like an ancient guidebook. A jungle trek should feel like a botanist's field journal. A city trip should look like a vivid travel poster. Every typographic, chromatic, and illustrative decision flows from this match.

Reuse the *structural skeleton* (cover → contents → map → site pages → extras). Never reuse the *surface*. Two guides should never look the same unless they describe the same kind of place.

---

## Aesthetic templates

For each template: theme, palette, fonts, illustration style, ornament vocabulary, and reference works to study before designing.

### 1. Ancient sites — *Antique Grand Tour guidebook*

Suited to: classical ruins, archaeological parks, old citadels (Agrigento, Pompeii, Petra, Ephesus, Persepolis, Baalbek).

- **Theme:** weathered 18th-century scholarly guide; tinted papyrus; faint foxing
- **Palette:** aged paper `#f0e4cc`, deep ink `#2e1f12`, soft ink `#6b4d35`, pompeian red `#8b2616`, gilt `#a8801c`
- **Fonts:** `Cinzel` (titles, small caps), `EB Garamond` (body), `Italianno` (subtitles)
- **Illustrations:** stone-coloured silhouette engravings of each site in its *current* state — not reconstructions. Column flutes as 0.5px lines. Linear gradients for depth. The fallen Telamon should lie on his back among rubble; the standing one stands.
- **Ornaments:** Greek key dividers, drop caps, ribbon bookmark, decorative cartouche borders, ornament symbols (`❦` `✦` `·`)
- **Tone:** cultivated, dry, with one well-placed historical anecdote per page
- **References:** Goethe's *Italian Journey*, Piranesi etchings, the British Museum's antique guidebooks

### 2. Wilderness & nature — *Victorian botanical research journal*

Suited to: jungle hikes, national parks, biodiversity hotspots, expedition treks (Borneo, Costa Rica, Manú, Galápagos, Tasmania).

- **Theme:** explorer's leather-bound field journal; ink and wash; numbered specimen plates
- **Palette:** bone paper `#ede4d2`, iron-gall ink `#1a2418`, faded sage `#6b7a4f`, ochre `#a0782b`, single oxblood accent `#732a1a` for danger / venom / "do not touch"
- **Fonts:** `IM Fell English` or `Cormorant Garamond` (body — slightly inkier feel than Garamond), `Caveat` or `Homemade Apple` (handwritten margin labels and Latin binomials), small-caps display
- **Illustrations:** precise scientific line drawings with hand-shading; numbered figures (Fig. I, Fig. II); scale bars; **Latin binomial in italic underneath every specimen**; arranged as a multi-panel plate (4–6 specimens per page divided by faint lines)
- **Ornaments:** hand-drawn dotted reference lines, pressed-leaf shadow textures, "OBSERVATIONS" / "FIELD NOTES" stamped headers, simulated foxing in corners, occasional pinned-specimen suggestion
- **Tone:** observational, slightly clinical, occasional flicker of wonder. Always notes which species are dangerous and how — not as warning blocks but woven into the description.
- **References:** Maria Sibylla Merian's *Metamorphosis*, Joseph Banks's *Endeavour* journals, Audubon's *Birds of America*, Ernst Haeckel's *Kunstformen der Natur*, von Humboldt's notebooks

### 3. City trips — *Bold modern Reiseführer / mid-century travel poster*

Suited to: weekend city breaks, neighbourhood walks, food-and-design tours (Lisbon, Tokyo, Marrakech, Mexico City, Berlin districts).

- **Theme:** big posterised colour blocks, confident geometry; equal parts vintage SNCF poster and modern editorial design
- **Palette:** *chosen per city*. Two saturated primaries + one accent. Examples:
  - Lisbon: tile-blue `#2e6090` + sun-yellow `#f0c040` + pastel pink `#e8a8a0`
  - Marrakech: terracotta `#c14a2a` + cobalt `#1a4080` + saffron `#e8a83a`
  - Tokyo: vermilion `#c83c2a` + ink-black `#1a1a1a` + paper `#f4f0e8`
- **Fonts:** heavy display sans (`Bebas Neue`, `Playfair Display 900`, `Anton`) for titles, clean modern sans (`Work Sans`, `Inter`, `Manrope`) for body, *no* italic
- **Illustrations:** flat-colour vector silhouettes with two-tone limited palette, geometric, posterised — a Lisbon tram, a Marrakech door, a Tokyo conbini at dusk. No fine line work. Bold, recognisable from across a room.
- **Ornaments:** thick brackets, ticket-stub edges, transit-icon glyphs, route-map line graphics, oversized numerals
- **Tone:** confident, present-tense, opinionated. Make recommendations, don't list options.
- **References:** vintage Pan Am posters, Saul Bass title sequences, *Monocle* travel guides, A.M. Cassandre

---

## Other aesthetics worth designing

Briefly. Develop in full when needed.

- **Coast / sailing** — captain's log + 18th-century sea chart; chart-cream + indigo + brass; rhumb lines, compass roses, depth soundings; references: Cook's voyages, Vallard Atlas
- **Mountains / alpine** — 1920s Alpine Club ledger; graph-paper grey-blue + slate + alpenrose accent; contour lines, summit silhouettes with elevation tags, hut symbols; reference: Whymper's *Scrambles Amongst the Alps*
- **Desert / oasis** — Bedouin illuminated travelogue; sand + terracotta + indigo (night sky) + sparing gold; arabesque borders, star-chart insets, dune profiles; reference: Ibn Battuta, Thesiger
- **Polar / expedition** — 1910s expedition report; glacier blue + oxidised brass + blood-red accent; ice cross-sections, animal-track silhouettes at scale, aurora bands; reference: Shackleton's diaries, Nansen
- **Religious / pilgrimage** — illuminated manuscript; vellum + lapis + gold leaf + cinnabar; foliate initials, marginalia, miniature scenes; reference: Book of Kells, Très Riches Heures

---

## Content research

### Source priority

1. **Primary:** original archaeological reports, museum catalogues, scientific descriptions, official park materials, government heritage sites
2. **Reputable secondary:** peer-reviewed papers, university websites, established long-form travel writing (Macfarlane, Theroux, Solnit, Sebald for tone)
3. **Wikipedia** for cross-checking and finding citations — never as primary source
4. **Avoid:** content-farm aggregators, Tripadvisor, blogs that exist to drive affiliate clicks, anything with "top 10" in the URL

For names, dates, dimensions: verify across at least two independent sources. Round numbers ("around 440 B.C.") are honest; precise wrong numbers ("440 B.C.") are not.

### The specific–verifiable–on-site rule

Each fact in the body must satisfy at least two of:

- **Specific** — a date, name, dimension, count, person; never "ancient", "many", "famous"
- **Verifiable** — traceable to a primary source
- **On-site verifiable** — the visitor can confirm it themselves while standing there

> ❌ "The temple is very old and beautiful."
> ✅ "Built around 440 B.C. — look up the column shafts and you can see the *entasis*, the slight optical curve that makes them appear perfectly straight to the eye."

### The two-section split

Each site/specimen has *exactly two* body sections, in this order:

- **WHAT TO LOOK FOR** (or **FLORA**, **AT THE MARKET**, **ON THE WATER** — match the aesthetic)
  Present-tense, second-person, action-oriented. *What does the visitor do when standing here?* Specific things to find, scorch marks to notice, angles to view from.
- **DID YOU KNOW** (or **HISTORY**, **LOCAL LORE**, **NATURALIA**)
  Narrative, third-person, story-driven. The reason this thing exists, the human story behind it.

The first answers "what now?". The second answers "why?". Don't blur them.

### Voice and tone

- Trust the reader. They're intelligent, curious, willing to read.
- Reward attention with specifics.
- One restrained dry observation per page is welcome. More than that becomes a tic.
- One human-interest story per site if you can find one — the bishop who exorcised the temple, the explorer who lost his fortune funding the dig, the engineer whose name the garden still carries.
- **Avoid:** superlatives ("best", "stunning"), travel-blog cliché ("hidden gem", "must-see"), exclamation marks, emoji, second-person hectoring ("you simply must…")

### Length discipline

Per site:
- Title + local name + meta line (date, dimension, type) — 1 line each
- WHAT TO LOOK FOR — **70–110 words**
- DID YOU KNOW — **80–120 words**

Resist the urge to keep adding. The visitor is on the move, in the sun, holding a phone.

---

## Illustrations

### Why custom SVG, not photos

1. Photos are copyright minefields
2. Photos are inconsistent in style and quality across a guide
3. Photos compete with — and usually lose to — the page typography
4. SVG embeds inline: single-file, offline, no broken images, infinitely scalable
5. Custom SVG can communicate something *specific* that a photo can't (the temple in its current ruined state, the diagnostic features of a species)

### Style consistency

- **Maximum three ink colours plus paper.** Use them across every illustration.
- **One illustration style per guide.** If site 1 is a stone silhouette engraving, site 7 is also a stone silhouette engraving. Mixing styles signals the maker didn't have one.
- **Illustrations must be informative.** Each must show something the reader can later identify or verify on-site.

### Per-aesthetic illustration rules

| Aesthetic | What each illustration shows |
|-----------|---|
| Ancient sites | The actual current state of the ruin (Concordia complete, Heracles 8 columns, Zeus rubble + fallen Telamon) |
| Botanical journal | Diagnostic features (leaf shape, flower structure, scale bar, Latin name) |
| Reiseführer poster | The single most recognisable silhouette of the place — flat colour, no detail |
| Sea chart | Cross-sections, harbour profiles, hull shapes |
| Alpine ledger | Elevation profiles, summit silhouettes with altitudes |

### SVG technical defaults

- viewBox `320 × 200` for single-subject (320 × 220 for multi-panel plates)
- Linear gradients for stone fills; flat colour for poster styles
- Paths over rasters always
- Detail lines kept at `stroke-width="0.4–0.6"` for fine work
- Drop shadow at `feGaussianBlur stdDeviation="1.5"` if needed; usually not needed

---

## Page structure

The skeleton is the same for every guide. The clothing changes.

1. **Cover** — title, local name, year, central illustration, ribbon bookmark, "swipe to begin" hint
2. **Contents** — numbered list with running distances when GPS is active; one-line evocative blurb at the bottom
3. **Map** — projected lat/lng pins, manual-tap fallback for position, compass rose, scale bar, dashed paths between sites
4. **Site pages** — one per main attraction, with the two-section structure
5. **Field-notes pages** — flora/fauna, market food, dialect words, festival calendar — diffuse content that belongs in the guide but isn't tied to one location
6. *(Optional)* **Practical** — final page with hours, tickets, transport. Keep terse — this is the only page that may go stale.

### Site data shape

```js
{
  id: 'concordia',
  num: 'II',                    // Roman numeral, or null for non-numbered extras
  name: 'TEMPLE OF CONCORDIA',  // English / display name in caps
  italian: 'Tempio della Concordia', // Local name in italic script
  meta: 'circa 440 B.C. · Doric peripteral · 6 × 13 columns',
  lat: 37.29024,                // omit for diffuse entries (flora, food, etc.)
  lng: 13.59210,
  illustration: 'concordia',    // key into illustrationSVG()
  look: `...`,                  // WHAT TO LOOK FOR — HTML-safe, may use <em>
  fact: `...`,                  // DID YOU KNOW
  isExtras: false,              // true for diffuse entries
  lookLabel: null,              // override section labels for non-site pages
  factLabel: null
}
```

---

## Technical patterns (high-level)

### Single-file HTML
Everything inline: CSS, JS, SVGs. Google Fonts CDN is acceptable; everything else inline. No build step. The output is `index.html` and that is the entire deliverable.

### Mobile-first
Primary design target: 360–430px viewport. Everything scales up gracefully but the *primary* user is holding a phone in front of the actual thing.

- Tap targets ≥ 44 × 44px
- Body text ≥ 15px
- Avoid hover-only interactions
- One-handed reachability for primary controls

### GPS philosophy

Live tracking is the goal, but it fails frequently on mobile (downloaded files, sandboxed iframes, denied permissions, cold GPS in canyons). Always provide a manual fallback. Manual is faster on-site anyway and works without permissions.

### TTS philosophy

`window.speechSynthesis` works offline once a voice is cached. Pick the best available voice. Stop speaking on page-flip. Show animation while speaking so the user knows it's working.

### Hosting

Geolocation requires HTTPS or `file://` — and many mobile browsers block it from downloaded files. The reliable path:

1. Push the file to a public GitHub repo as `index.html`
2. Repo Settings → Pages → Source: `main` / `(root)` → Save
3. Visit `https://<user>.github.io/<repo>/` after ~60 seconds

---

## Code architecture

This is the actual implementation playbook. Patterns below are what survived after building the Agrigento guide.

### File layout

A single `index.html`, organised top to bottom:

```
<!DOCTYPE html>
<html>
<head>
  <meta viewport>
  <title>
  <link to Google Fonts>      ← Cinzel + Garamond + Italianno (or per aesthetic)
  <style>
    :root { --css-vars }       ← all theme colours/sizes as CSS custom properties
    * { reset }
    body { ... }
    /* ===== BOOK ===== */     ← the page-flip system
    /* ===== ORNAMENTS ===== */
    /* ===== COVER ===== */
    /* ===== TOC ===== */
    /* ===== SITE PAGE ===== */
    /* ===== MAP ===== */
    /* ===== CONTROLS ===== */
    /* ===== TTS BUTTON ===== */
    @media queries
  </style>
</head>
<body>
  <!-- Top-level controls (fixed-positioned) -->
  <button class="gps-btn">
  <button class="tts-btn">

  <!-- The book -->
  <div class="book">
    <div class="pages">
      <div class="page cover">      ← static
      <div class="page toc">        ← static
      <div class="page map">        ← static
      <!-- site pages injected by JS -->
    </div>
  </div>

  <!-- Bottom nav -->
  <div class="controls">

  <script>
    const sites = [...]            ← data
    function illustrationSVG(type) ← per-aesthetic dispatcher
    function buildPages()          ← DOM generation
    function buildMap()
    function goTo(targetPage)      ← navigation + animation
    GPS handling
    TTS handling
    init()
  </script>
</body>
</html>
```

### CSS: theme tokens as custom properties

Define every colour and size once. Per-aesthetic guides change *only* the `:root` block.

```css
:root {
  --paper:        #f0e4cc;   /* aged paper */
  --ink:          #2e1f12;   /* primary text */
  --ink-soft:     #6b4d35;   /* secondary text */
  --ink-faint:    #8a7458;   /* tertiary, dotted lines */
  --pompeian:     #8b2616;   /* primary accent */
  --pompeian-deep:#621a0f;   /* hover/active accent */
  --gilt:         #a8801c;   /* gold rule lines */
  --gilt-soft:    #c9a449;   /* lighter gilt */
  --shadow:       rgba(46, 31, 18, 0.18);
}
```

For a Reiseführer guide, the same five-to-eight names take wildly different values. Names stay consistent so the rest of the CSS stays unchanged.

### CSS: the paper texture trick

Two layered effects on every `.page`:

```css
.page::before {
  /* Soft warm blotches via radial gradients */
  background-image:
    radial-gradient(circle at 20% 30%, rgba(160, 120, 70, 0.06), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(120, 80, 40, 0.08), transparent 50%);
  mix-blend-mode: multiply;
}
.page::after {
  /* SVG fractal noise as a paper grain */
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.12 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  mix-blend-mode: multiply;
  opacity: 0.4;
}
```

For a Reiseführer, replace the noise with a flat colour block; for a botanical journal, increase the noise frequency and add a faint horizontal ruling.

### CSS: the page-flip system

Pages are stacked absolutely. Only `.active` is visible; `.leaving-*` plays an exit animation.

```css
.pages {
  position: relative;
  width: 100%; height: 100%;
  perspective: 1800px;
  transform-style: preserve-3d;
}
.page {
  position: absolute; inset: 0;
  opacity: 0;
  pointer-events: none;
  transform: rotateY(-12deg) translateX(-30px) scale(0.96);
  transform-origin: left center;
  transition:
    opacity 0.55s cubic-bezier(.2,.7,.3,1),
    transform 0.65s cubic-bezier(.2,.7,.3,1);
}
.page.active {
  opacity: 1;
  pointer-events: auto;
  transform: rotateY(0) translateX(0) scale(1);
  z-index: 2;
}
.page.leaving-right { transform: rotateY(-72deg) translateX(-50px) scale(0.92); }
.page.leaving-left  { transform: rotateY(0) translateX(40px) scale(0.96); }
```

Use `cubic-bezier(.2,.7,.3,1)` — feels like paper. Linear easing feels like software.

### CSS: ornamental dividers as inline SVG data URLs

Greek key example (for ancient-site aesthetic):

```css
.greek-key {
  height: 12px;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 12'><path d='...' fill='%23a8801c'/></svg>");
  background-repeat: repeat-x;
  opacity: 0.7;
}
```

For a botanical journal, this becomes a hand-drawn dotted line. For a Reiseführer, a thick horizontal bar in an accent colour. Pattern stays the same; SVG content changes.

### JavaScript: site data drives DOM

One array of objects. `buildPages()` iterates. **Never** hand-author site page HTML — always render from data.

```js
const sites = [
  {
    id: 'concordia',
    num: 'II',                          // null for un-numbered extras
    name: 'TEMPLE OF CONCORDIA',
    italian: 'Tempio della Concordia',
    meta: 'circa 440 B.C. · Doric peripteral · 6 × 13 columns',
    lat: 37.29024,                      // omit for diffuse entries
    lng: 13.59210,
    illustration: 'concordia',          // key into illustrationSVG()
    look: `Walk slowly around all four sides...`,  // may contain <em>
    fact: `It only survived because, in 597 A.D...`,
    isExtras: false,                    // true → no map pin, no GPS pill
    lookLabel: null,                    // override 'WHAT TO LOOK FOR'
    factLabel: null                     // override 'DID YOU KNOW'
  },
  // ...
];
```

`buildPages()` then:

```js
sites.forEach((s, i) => {
  // TOC entry (skip distance widget for extras)
  const distSpan = s.isExtras ? '' : `<span class="toc-distance" data-id="${s.id}"></span>`;
  // ...
  tocList.appendChild(tocItem);

  // Site page
  const headerNum = s.num ? `— ${s.num} —` : '— field notes —';
  const lookLbl = s.lookLabel || 'WHAT TO LOOK FOR';
  const factLbl = s.factLabel || 'DID YOU KNOW';
  const gpsPill = s.isExtras ? '' : `<span class="gps-pill" ...></span>`;
  // template string with all of the above
  pagesEl.appendChild(page);
});
buildMap();
```

### JavaScript: illustration dispatcher

Each illustration is a function that returns an SVG string. Switch by type. Keep one shared colour palette via local consts at the top.

```js
function illustrationSVG(type) {
  const stone = '#3a2817';
  const stoneSoft = '#6b4d35';

  if (type === 'concordia') {
    return `<svg viewBox="0 0 320 200" xmlns="...">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="${stone}"/>
          <stop offset="100%" stop-color="${stoneSoft}"/>
        </linearGradient>
      </defs>
      <!-- stylobate, columns, capitals, entablature, pediment -->
    </svg>`;
  }

  if (type === 'naturalia') {
    // multi-panel botanical plate at viewBox 320 × 220
    return `<svg ...>...</svg>`;
  }
  // ...
}
```

> ⚠ **Pitfall:** every `${variable}` inside an SVG template string must be a real const in the function scope. A typo like `${ink}` when the variable is `${stone}` will silently produce broken SVG attributes. Validate by piping the script through `node -e "new Function(scriptText)"` after editing.

### JavaScript: map projection

Hardcode a bounding box that comfortably contains every pin. Project lat/lng into the SVG viewBox.

```js
const MAP_BBOX = {
  minLat: 37.2870, maxLat: 37.2985,
  minLng: 13.5780, maxLng: 13.5965
};

function projectToMap(lat, lng) {
  const x = ((lng - MAP_BBOX.minLng) / (MAP_BBOX.maxLng - MAP_BBOX.minLng)) * 320;
  const y = 220 - ((lat - MAP_BBOX.minLat) / (MAP_BBOX.maxLat - MAP_BBOX.minLat)) * 220;
  return { x, y };
}
```

After building, **always sanity-check** projected positions in a quick Node script — confirm pins land where they should geographically (north pin near top, eastern pin near right, etc.).

For the **inverse projection** (manual-tap-to-place), use `SVG.createSVGPoint` and the screen CTM:

```js
mapSvg.addEventListener('click', (e) => {
  if (e.target.closest('.map-pin')) return;       // pin handler fires instead
  const pt = mapSvg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  const sp = pt.matrixTransform(mapSvg.getScreenCTM().inverse());
  const lng = MAP_BBOX.minLng + (sp.x / 320) * (MAP_BBOX.maxLng - MAP_BBOX.minLng);
  const lat = MAP_BBOX.minLat + ((220 - sp.y) / 220) * (MAP_BBOX.maxLat - MAP_BBOX.minLat);
  setManualPosition(lat, lng);
});
```

> ⚠ **Pitfall:** pin click handlers must `e.stopPropagation()` or the map's tap-to-place handler will fire as well. Cleaner: check `e.target.closest('.map-pin')` in the map handler and bail out, as above.

### JavaScript: navigation state machine

Three classes drive every page transition:

```js
function goTo(targetPage) {
  if (targetPage < 0 || targetPage >= totalPages) return;
  if (targetPage === currentPage) return;

  if (speaking) stopSpeech();   // always stop TTS on flip

  const direction = targetPage > currentPage ? 'next' : 'prev';
  document.querySelectorAll('.page').forEach(p => {
    const idx = parseInt(p.dataset.page);
    p.classList.remove('active', 'leaving-right', 'leaving-left');
    if (idx === currentPage) {
      p.classList.add(direction === 'next' ? 'leaving-right' : 'leaving-left');
    }
    if (idx === targetPage) {
      setTimeout(() => p.classList.add('active'), 30);  // small delay for exit
    }
  });

  currentPage = targetPage;
  updateIndicator();
  updateNavButtons();

  // Reset scroll on the new page (or you'll start mid-paragraph)
  setTimeout(() => {
    const inner = document.querySelector('.page.active .page-inner');
    if (inner) inner.scrollTop = 0;
  }, 100);
}
```

Bind keyboard, button, swipe, and TOC clicks all to `goTo(n)`. Single source of truth.

### JavaScript: GPS

Two reads — one fast, one continuous:

```js
function startGps() {
  if (!navigator.geolocation) { setGpsLabel('NO GPS'); return; }
  setGpsLabel('LOCATING…');

  // Quick first fix
  navigator.geolocation.getCurrentPosition(
    onGpsSuccess, onGpsError,
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
  );

  // Live tracking
  if (watchId === null) {
    watchId = navigator.geolocation.watchPosition(
      onGpsSuccess,
      () => { /* silent on watch errors after first fix */ },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 }
    );
  }
}

function onGpsError(err) {
  let msg = 'GPS ERROR';
  if (err.code === 1) msg = 'BLOCKED';     // PERMISSION_DENIED
  else if (err.code === 2) msg = 'NO SIGNAL';   // POSITION_UNAVAILABLE
  else if (err.code === 3) msg = 'TIMEOUT';
  setGpsLabel(msg);

  // After a delay, offer the manual fallback
  setTimeout(() => {
    if (!gpsActive) { setGpsLabel('TRY DEMO'); gpsBtn.dataset.fallback = 'demo'; }
  }, 2200);
}
```

Distance is just the haversine formula:

```js
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;                        // metres
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2
          + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
```

> ⚠ **Pitfalls:**
> - `enableHighAccuracy: true` drains the battery; only request once per fix
> - `maximumAge` of 30s on first read is fine; on watch reduce to 5s
> - When iterating `sites` to compute distances, **skip entries with `isExtras` or no `lat`** — otherwise haversine will return NaN

### JavaScript: TTS voice picker

Voices load asynchronously in some browsers (notably iOS Safari). Subscribe to `voiceschanged`.

```js
function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const prefs = [
    v => v.lang === 'en-GB' && /natural|neural|enhanced|premium/i.test(v.name),
    v => v.lang === 'en-GB',
    v => v.lang === 'en-US' && /natural|neural|enhanced|premium/i.test(v.name),
    v => v.lang === 'en-US',
    v => v.lang.startsWith('en')
  ];
  for (const test of prefs) {
    const found = voices.find(test);
    if (found) return found;
  }
  return voices[0];
}

window.speechSynthesis.addEventListener('voiceschanged', () => {
  voicePref = pickVoice();
});
voicePref = pickVoice();   // also try synchronously
```

Always strip HTML before speaking:

```js
function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || '';
}
```

> ⚠ **Pitfalls:**
> - iOS Safari only starts speech synthesis after a user gesture — never call `speak()` on page load
> - Some browsers cap utterance length; for very long pages, split on sentence boundaries
> - Always `cancel()` any prior utterance before starting a new one, or they queue

### JavaScript: touch swipe

```js
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  // Only horizontal swipes ≥ 50px and clearly more horizontal than vertical
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    if (dx < 0) goTo(currentPage + 1);
    else        goTo(currentPage - 1);
  }
}, { passive: true });
```

The `1.5x` ratio prevents accidental flips when the user is scrolling vertically inside a long page.

### Validation: always run a syntax check before shipping

Template strings that interpolate variables in SVG markup are easy to typo. Validate the script block via Node:

```bash
node -e "
const html = require('fs').readFileSync('index.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
try { new Function(m[1]); console.log('✓ syntax OK'); }
catch (e) { console.error('✗', e.message); }
"
```

Plus a projection sanity check for the map:

```bash
node -e "
const BBOX = { minLat: 37.2870, maxLat: 37.2985, minLng: 13.5780, maxLng: 13.5965 };
const proj = (lat, lng) => ({
  x: (((lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * 320).toFixed(0),
  y: (220 - ((lat - BBOX.minLat) / (BBOX.maxLat - BBOX.minLat)) * 220).toFixed(0)
});
[['Site A', 37.2900, 13.5900], ['Site B', 37.2970, 13.5889]].forEach(
  ([n, lat, lng]) => console.log(n, proj(lat, lng))
);
"
```

If any pin lands outside `[0, 320] × [0, 220]`, widen the bbox.

### Browser-storage rule

If the guide eventually needs persistence (visited-checkpoints, notes), use `localStorage` only when delivered as a real hosted page (`https://` or `file://`). Inside Anthropic-rendered Claude.ai artifacts, `localStorage` is blocked — use React state or in-memory variables instead. For a GitHub Pages deployment this restriction does not apply.

---

## What to avoid

- **Generic AI aesthetic.** Purple gradients, glassmorphism, neon. These signal that the maker chose nothing.
- **Same look for every destination.** A guide to the Vatican should not look like a guide to Bali should not look like a guide to Nuuk.
- **Stock photos.** See above.
- **Bullet lists for body content.** Paragraphs are denser, more elegant, and better for TTS. Lists are for navigation, not narrative.
- **Padding the content.** No fact, no sentence. Move on.
- **Forgetting the visitor is moving.** Every design decision should consider: *easier to use one-handed, in sun, with one bar of signal, while looking at the actual thing?*
- **Trusting your training data on present-day facts.** Verify hours, ticket prices, leadership, road closures via web search before writing them.

---

## Pre-build checklist

Before writing a single line:

1. **What's the place?** Specific destination, not a country. ("Valle dei Templi", not "Sicily".)
2. **What's the visit shape?** 3-hour walk? Full day? 5-day trek? This sets pacing and depth.
3. **Which aesthetic?** Consult §"Aesthetic templates" or design a new one. Justify the choice in one sentence.
4. **What are the 5–9 must-see sites/specimens?** Fewer than 5 is thin; more than 9 is exhausting on mobile.
5. **What's the *thematic extra*?** The page that elevates it beyond a list of points: flora/fauna for nature, market food for cities, dialect for a region, festival calendar for a season.
6. **GPS or just map?** Some places need live tracking; some just need orientation.
7. **Where will it be hosted?** GitHub Pages by default; hand-deliver the repo setup steps.

Then build. Single file. Mobile-first. Match the place.

— *fin*
