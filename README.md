# ENTRE FLORES

**An interactive floral atelier — imagined in Madrid, created by beta / BETARCHIVO.**

A botanical web experience combining an editorial floral studio, four seasonal gardens, collectible flower details, and a hands-on bouquet creator.

**Live site:** https://a045baf2.entre-flores.pages.dev/#home  
**Portfolio:** https://betarchivo.pages.dev/

## Explore the experience

- **Editorial home:** layered floral photography, botanical typography, and subtle motion.
- **Four-season garden:** spring, summer, autumn, and winter scenes with interactive flowers, seasonal atmospheres, and specimen cards.
- **Floral collections:** curated bouquet compositions and visual inspiration.
- **Create your bouquet:** choose flowers and presentation styles, arrange stems, and see an updated composition and price.
- **Personal details:** botanical names and meanings, pairing suggestions, vintage cards, and the creator's signature.
- **Responsive interaction:** desktop pointer controls and mobile-friendly garden and atelier layouts.

## Design direction

A blend of **editorial atelier** and **dark botanical** aesthetics: cream paper, olive and forest greens, terracotta, and vintage burgundy. The design uses expressive script typography alongside readable editorial text.

The garden and atelier are visual, creative experiences rather than a real flower-ordering service.

## Technology

- Static HTML, CSS, and vanilla JavaScript
- Local image and botanical assets
- Client-side interactions and browser-local saved compositions where supported
- No database, paid API, or payment integration required for the demo

## Run locally

From the project root:

```bash
python -m http.server 8000
```

Then open http://localhost:8000/ in your browser. On Windows, the included launcher may also be used if present in your source version.

## Deploy to Cloudflare Pages

This is a static website. For a **Git-connected** Cloudflare Pages project, pushing changes to its production branch triggers a new deployment when automatic builds are enabled.

For a new Pages project, configure the directory containing `index.html` as the publish/output directory. A build command is not needed for a plain HTML/CSS/JS version; if your repository uses a prebuilt `dist/` directory, verify that it contains the **latest** complete site before selecting it. Do not blindly deploy an outdated preview folder.

If the existing site is already deployed, use its existing Cloudflare Pages project rather than creating another one.

## Demo notice

ENTRE FLORES is a fictional floral studio and a creative portfolio project. Displayed prices and order summaries are illustrative; no real purchases, payments, or deliveries are offered. Saved designs, when enabled, stay in the visitor's browser.

## Credits

Concept, visual direction, and interactive experience by **beta / BETARCHIVO**. The project contains original creative assets and photography prepared for this experience. Please do not redistribute project imagery or branding without permission.

© 2026 beta / BETARCHIVO.
