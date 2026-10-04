# Ladenburg 3D atlas

The published guide is the self-contained `../../ladenburg.html`: geometry,
fonts, SVG fallback map, Three.js and illustrations are all embedded. It needs
no server or tile provider for reading and rendering the map.

`atlas3d.js` is the editable source of the 3D map. It imports `journey3d.js`,
the separate time-travel model. Both use `roman3d.js` for the original Roman
architecture and share one embedded Three.js bundle.
To rebuild it:

```sh
cd tools/ladenburg
npm ci
npm run build
```

The guide's other UI code and the JSON data live in its unminified final script
and `atlas-data` / `stop-data` script elements. Verify both the 3D view and SVG
fallback after editing. The model uses OSM footprints, tagged or estimated
heights, and stylised landmark miniatures. Roof forms are illustrative; the
Roman layer shows evidence locations alongside interpretive 3D forum, basilica,
bathhouse, theatre, temple and burgus models. It is not a surveyed reconstruction
of the whole Roman town. Rendering is on demand, rather than a perpetual
animation loop.

“Römische Spuren” creates the architectural geometry lazily on first reveal.
A/B/D identify the basilica, forum and burgus evidence areas; C remains a museum
collection. E is explicitly a bathhouse type model at a schematic location,
with a dashed base outline. F/G are freely designed theatre and temple types at
schematic locations, also marked with dashed buttons. The Roman street grid,
freely designed wall with gates, 28 small houses, three courtyard houses,
gardens, market stalls, pottery, cart and people are a freely interpreted city
scene. They emerge in the Roman time image and disappear before the late-antique
phase; their phase thresholds are scene transitions, not asserted construction
dates. Static geometry is batched by material to keep mobile rendering
inexpensive. The roof/floor controls use actual 3D geometry.
Selecting a building focuses the camera and scrolls it fully into the phone
viewport. “Übersicht” returns to all seven markers, while “Heute” restores the
modern city. The trace layer combines different Roman periods; the burgus is
late antique. Today’s streets remain an orientation layer. The plan fallback
keeps the markers, descriptions and sources. `#roman-spuren` opens this view
directly; the selected building can also open directly in the time-travel view.
The map sidebar, `roman-model-design` styles and map UI are authored in the
single HTML file.

The fallback works when WebGL is unavailable. External directions and source
links need a connection; GPS and speech depend on the browser/device.

The guide retains the field-book page model: cover, contents, map, eight
individual stops, field notes, practical information and sources (14 pages).
`buildBook()` and `goTo()` in the final inline script own the page state.
Only the active page is exposed to interaction and assistive technology; long
content scrolls inside that page. Horizontal swipes turn reading pages and
never compete with map gestures. On touch devices, the map scrolls with the
page until “Move map” is explicitly enabled.

The “Von Rom bis heute” view opens in a native full-screen dialog without
changing the 14-page book. It creates its renderer on first use and pauses the
atlas renderer while open. An introductory camera flight ends at a bird's-eye
view; the timeline grows selected buildings through seven historical snapshots.
Monument buttons focus the baths, forum, basilica, theatre, temple and burgus.
Roofs can be lifted off, and the bath floor can be raised to expose the modeled hypocaust, brick
pilae and furnace. On mobile, “Modell drehen” explicitly enables camera gestures.
Idle or closed scenes stop requesting frames; reduced motion skips the intro.

The bathhouse is an original architectural type model, not a surveyed Ladenburg
reconstruction. The forum and basilica use the documented size of the complex,
with interpretive elevations; completion of the ancient basilica is disputed.
Historical house clusters are symbolic and disappear before today's OSM blocks
appear. Current river and surviving wall outlines provide orientation rather
than proof of their complete ancient or medieval courses. Evidence notes and
sources are available inside the view. The dialog, its `journey-design` style
block and `journey-ui` script are authored in `ladenburg.html`, before the main
script so that the offline download contains them. Verify the time-travel view,
WebGL fallback and standalone download when changing this integration.

The visual design is a Roman antiquarian atlas in travertine and Pompeian red,
with an original SVG frontispiece, meander corners and warm paper folios. The frontispiece is a symbolic
illustration, not a geographic plan or Roman reconstruction. The cover's SVG
and the `engraved-atlas-design` / `roman-atlas-design` style blocks are authored directly in
`ladenburg.html`; fine architectural marks are added by `drawIllustration()`.
Cinzel is embedded with its OFL notice for offline Roman inscription typography.
Keep the cover's artwork, the homepage shelf illustration and mobile previews
consistent when changing the design.

Neugraben 20 is an additional mapped address in `atlas-data.extraPlaces`,
verified against OSM address node 13890854530 and building footprint 1207119183.
The model extends northeast to include its neighborhood. Its default camera
still targets the walking loop; the address shortcut focuses either the 3D
model or the SVG street plan, and the Altstadt button restores the route view.
The address does not add a numbered stop or change the measured walking loop.
