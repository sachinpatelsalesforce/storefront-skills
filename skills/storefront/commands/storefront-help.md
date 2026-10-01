# /storefront-help

Output a friendly help reference for the storefront plugin. Do not ask any questions — just print the help content below, then offer to run `/build-storefront` if the user wants to start.

---

Print exactly this (substituting today's date where shown):

---

## Storefront Skills — Quick Reference

A plugin for building and rebranding a React SPA retail storefront. It gives you a guided rebrand wizard, auto-copies the architecture reference into your project, and documents the full design system.

---

### Commands

| Command | What it does |
|---------|--------------|
| `/build-storefront` | **Start here.** Asks 10 questions about your brand, then applies all 14 rebranding steps with real code changes. |
| `/storefront-help` | Shows this help reference. |

---

### How `/build-storefront` works

1. Reads `template-design.md` (auto-copied into your project on first session)
2. Asks you **10 brand questions** all at once:
   - Brand name
   - Primary colour + dark variant + light tint (hex)
   - Accent / CTA colour + dark variant (hex)
   - Logo URL
   - Product categories
   - Loyalty programme (or "none")
   - Product CDN pattern (or "use Unsplash placeholders")
3. Confirms your answers before touching any code
4. Works through **14 rebranding steps** in order:

| Step | What changes |
|------|-------------|
| 1 | Colour tokens — `tailwind.config.js` |
| 2 | Logo — `StoreNav.jsx` |
| 3 | Favicon + tab title — `index.html` |
| 4 | Nav categories + mega-menu — `StoreNav.jsx` |
| 5 | Utility links — `StoreNav.jsx` |
| 6 | Promo bar messages — `HomePage.jsx` |
| 7 | Home page sections (hero, banners, tiles, carousel) |
| 8 | Product catalogue brand name + images — `womensProducts.js` |
| 9 | AI search scenarios + typeahead — `cimulateSearchData.js` |
| 10 | Concierge name + greeting flows — `DottieConcierge.jsx` |
| 11 | Shop to Store widget (keep or remove) — `WomensPDPPage.jsx` |
| 12 | Loyalty programme strip (keep or remove) — `BagPage.jsx` |
| 13 | Footer links + copyright — `StoreFooter.jsx` |
| 14 | Checkout legal copy + header logo — `CheckoutPage.jsx` |

5. Prints a summary of every change made + next steps

---

### What's in `template-design.md`

The full architecture reference for the storefront template — auto-copied into your project on first session start. Covers:

- Tech stack and routing table
- Design tokens (the colour names to rebrand)
- Every component and page documented
- AI search, concierge, and ShopToStore data models
- Product data schema
- The 14-step rebranding checklist in full

---

### Prerequisites

- Claude Code installed
- The storefront project cloned locally (React + Vite + Tailwind)
- `template-design.md` in the project root (auto-copied by this plugin on first session)

---

### After the rebrand

```bash
npm run dev          # preview at localhost:3333
railway up --detach  # deploy to Railway
```

Add your real products to `src/data/womensProducts.js` and replace any Unsplash placeholder images with your own CDN URLs.

---

Type `/build-storefront` to start, or ask me any question about the template.
