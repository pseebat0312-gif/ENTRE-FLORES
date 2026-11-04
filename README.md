# Entre Flores

An original interactive floral atelier inspired by the gardens and light of Madrid. Static HTML, CSS and vanilla JavaScript; no API key, database or paid service required.

## Explore

- Editorial homepage and individually photographed floral collections.
- A living courtyard garden with 17 clickable botanical species and seasonal filters.
- Botanical descriptions, Latin names, meanings and suggested pairings.
- Bouquet atelier: add, drag, rotate, resize, reorder and remove stems.
- Automatic bouquet composition, undo/redo, named local saves and PNG export.
- Responsive mobile navigation and touch interaction.

Prices and order confirmation are demonstration content. No payments or real orders are processed. Saves remain in the visitor's browser.

## Run locally

Open a terminal in this directory and run `python -m http.server 8000`, then visit http://localhost:8000. Windows users can run INICIAR_WINDOWS.bat if Python 3 is installed.

## Deploy to GitHub Pages

Upload this project to your repository, including `index.html`, `style.css`, `app.js`, `garden-data.js`, `garden-wind.js`, `atelier-polish.css`, `assets/` and `.github/workflows/pages.yml`. In GitHub, open Settings → Pages and select GitHub Actions as the source. The included workflow publishes the static files. Asset paths are relative, so repository subpaths work.

The `dist/` directory mirrors the static website for the private working preview. `.openai/hosting.json` configures only that preview; it is not required for GitHub Pages. There is no ChatGPT login dependency in the application.

## Visual direction

Cream paper tones, terracotta accents, dark olive botanical imagery. Brand and historia: Fleur De Leah; display accents: Pinyon Script; reading text: EB Garamond. All active photography and botanical assets were generated independently, not extracted from layout screenshots. See ASSET_SOURCE.md.

## Validation

JavaScript syntax and referenced asset paths checked. Desktop browser exercised garden-to-atelier flow, collection filtering, addition and totals, automatic composition, save/clear/restore, and PNG export. Mobile layout inspected in a 390px-wide browser frame. No cross-device exhaustive compatibility claim is made.

## Dimensional garden update

The garden is a continuous photographic panorama with direct botanical hit regions. Foliage responds to a shared wind field (WebGL with a Canvas mesh fallback); the transparent swing has its own pendulum animation. On narrow screens the garden pans horizontally. The homepage uses a separate large floral foreground, CSS perspective and pointer parallax. Reduced-motion preferences disable motion.

The bouquet vase is rendered in three layers: vessel back, stems inside the mouth, vessel front. Dragging changes bloom angle and length while the stem base settles inside the vessel. Saved stems from the earlier layout are migrated to the new insertion point.

## Herbarium refinement

The cover uses EB Garamond italic and four independent photographic planes with different parallax depths and wind timings. The garden adds 23 independent foreground plants with varied height, angle and individual animation phase. Repeated blooms in the continuous background have multiple interaction regions. Foreground picking uses visible image alpha, so transparent margins do not steal clicks from adjacent flowers. Plant colors share a warm muted grade and the ground fades into the garden beds.

The burgundy herbarium card includes specimen number, flower name, Latin name, flower meaning, season, per-stem price and clickable companion species. Desktop pointer tests exercised visible rose and peony petals; the mobile layout and companion-card-to-bouquet flow were verified in a 390px-wide frame.

## Four seasons and presentation choices

The garden switches between four separately generated photographs (spring, summer, autumn, winter), with season-specific foreground flowers. Autumn includes a copper dahlia variant; winter includes white hellebores. The floral card is a small rectangular burgundy collector card with a vertical ochre tape detail.

The atelier supports the ivory ceramic bowl, olive glazed ceramic vase, amber ribbed glass and vintage newspaper wrapping. Each has a separately configured opening/front mask and stem anchor. Stem release uses damped position, angle and scale settling. Presentation choice and flower image variants are saved with the design.

On mobile the atelier has a dedicated viewport layout: composition canvas above, a scrollable flowers/presentation panel, and a compact summary with an expandable detail drawer. Vibration feedback uses feature detection and a user toggle; browsers without that API keep visual feedback.

A centered creator-watermark slot is reserved in the footer. It remains empty until the user supplies their approved mark. See AGENTS.md.

### Creator signature and full-screen cover
The supplied Beta signature is refined as a transparent `assets/beta-signature.png`, centered in the footer. Preserve the original crescent face and brush lettering when reusing it. Desktop uses a viewport-sized shell: home, garden and atelier fit between navigation and signature; longer editorial pages scroll inside the content area. All hero lines use Fleur De Leah. Scene entries fade and rise over approximately one second, respecting reduced-motion preferences.

### Independent floral foreground and more presentations
The cover uses 28 individual botanical assets in four planes, each with its own wind duration, phase and amplitude. The cover is clipped at its bottom; only the two original white anemones extend beyond the garden edge in all four seasons. No additional footer flowers are added. The atelier includes six vases and four wraps, with dedicated front occlusion and vector silhouettes. The new options are a glass soliflore, terracotta amphora, wine ceramic compote, single-flower kraft sleeve, ivory pleated wrap and burgundy paper with silk ribbon.

### Final pricing and glass detail
Paper wrap supplements: kraft €1.50, newspaper €3.50, ivory €4.50, burgundy/silk €6.50. The selected supplement appears once in the live receipt and order summary, including restored designs, and is removed when changing to a vase. Transparent glass and amber vessels display subtly refracted, tinted submerged stalks, masked to the actual vessel silhouette. Cover stems use separate damped wind oscillators with varied frequencies, directions, inertia and small downward deflection; this is a visual physical approximation, not a scientific simulation.


### Petal and glass continuity correction
The garden keeps the original two white specimens within its scene; a synchronized, noninteractive head-only overflow reveals cropped petals without adding footer stems. Responsive positioning keeps the original heads at the scene edge on wide screens. Glass stems follow the photographed stalk angle into the vessel, remain visible through a translucent front layer, and export with the composition.


Mobile UI revision: removed duplicated in-scene petals; reduced mobile garden mesh workload; changed vessel choices to a vertical two-column grid; compacted complete flower cards and restyled the small order card in burgundy/olive; added mobile atelier and order-card Volver controls.
