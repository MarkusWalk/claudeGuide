# Ladenburg 3D atlas

The published guide is the self-contained `../../ladenburg.html`: geometry,
fonts, SVG fallback map, Three.js and illustrations are all embedded. It needs
no server or tile provider for reading and rendering the map.

`atlas3d.js` is the editable source of the 3D map. To rebuild its inline bundle:

```sh
cd tools/ladenburg
npm ci
npm run build
```

The guide's other UI code and the JSON data live in its unminified final script
and `atlas-data` / `stop-data` script elements. Verify both the 3D view and SVG
fallback after editing. The model uses OSM footprints, tagged or estimated
heights, and stylised landmark miniatures. Roof forms are illustrative; the
Roman layer identifies evidence locations and a museum collection, not an
archaeological reconstruction. Rendering is on demand, rather than a perpetual
animation loop.

The fallback works when WebGL is unavailable. External directions and source
links need a connection; GPS and speech depend on the browser/device.

The guide retains the field-book page model: cover, contents, map, eight
individual stops, field notes, practical information and sources (14 pages).
`buildBook()` and `goTo()` in the final inline script own the page state.
Only the active page is exposed to interaction and assistive technology; long
content scrolls inside that page. Horizontal swipes turn reading pages and
never compete with map gestures. On touch devices, the map scrolls with the
page until “Move map” is explicitly enabled.

The visual design is a gilt green town atlas with an original SVG frontispiece,
ornamented cover corners and warm paper folios. The frontispiece is a symbolic
illustration, not a geographic plan or Roman reconstruction. The cover's SVG
and the `engraved-atlas-design` style block are authored directly in
`ladenburg.html`; fine architectural marks are added by `drawIllustration()`.
Keep the cover's artwork, the homepage shelf illustration and mobile previews
consistent when changing the design.
