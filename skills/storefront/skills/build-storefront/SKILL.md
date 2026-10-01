---
name: build-storefront
description: Guide a colleague through building and rebranding a React SPA retail storefront from the template. Use this skill when someone wants to create a new branded storefront, rebrand an existing one, or understand how to adapt the storefront template to a new brand. Walks through collecting brand details (colours, logo, categories, loyalty programme, CDN) then applies all 14 rebranding steps with actual code changes.
---

# Build & Rebrand a Storefront

You are helping a colleague build and brand a new retail storefront site based on a proven React SPA template. The template architecture is documented in `template-design.md`.

## What you will do

1. Read `template-design.md` for full architecture context.
2. Collect brand details from the colleague.
3. Work through the 14-step rebranding checklist, making actual code changes at each step.
4. Confirm each step and deliver a final summary.

---

## Step 1 — Read the template

Read `template-design.md` using the following lookup order — stop at the first one that exists:

1. `~/claude-projects/template-design.md` — global template on the author's machine
2. The same directory this skill was loaded from (the plugin install path)
3. The current working directory

This gives you the full picture of the architecture, components, data models, design tokens, and rebranding checklist before you ask any questions.

---

## Step 2 — Collect brand details

Ask the colleague these questions **all at once** (not one at a time):

> I'm going to help you build a branded storefront. I just need a few details about your brand before we start.
>
> **Please answer all of these:**
>
> 1. **Brand name** — what's the store called? (e.g. "Zara", "ASOS", "Marks & Spencer")
> 2. **Primary colour** — the main brand colour used for buttons, nav accents, active states (hex code, e.g. `#003087`)
> 3. **Primary colour — hover/dark variant** — slightly darker version of the above (hex, e.g. `#002366`)
> 4. **Primary light tint** — a very light version used for backgrounds and highlights (hex, e.g. `#E8F0FE`)
> 5. **Accent / CTA colour** — a contrasting colour for sale badges, highlight CTAs (hex, e.g. `#FF4500`)
> 6. **Accent hover** — darker version of the accent (hex)
> 7. **Logo** — a URL to your logo image, or say "I'll add it later"
> 8. **Product categories** — list the main nav categories (e.g. Women / Men / Kids / Sale) — or say "same as template" to keep them
> 9. **Loyalty programme** — do you have one? If yes, what's it called? If no, say "none" and I'll remove those sections.
> 10. **Do you have a product CDN?** — if yes, give me the URL pattern. If no, say "use Unsplash placeholders".

Wait for all answers before proceeding.

---

## Step 3 — Confirm understanding

Summarise back what you heard in a short table:

| Setting | Value |
|---------|-------|
| Brand name | ... |
| Primary colour | ... |
| Accent colour | ... |
| Logo | ... |
| Categories | ... |
| Loyalty | ... |
| Image CDN | ... |

Ask: "Does this look right? Type yes to continue, or correct anything above."

---

## Step 4 — Work through the rebranding checklist

Work through each item below **in order**. For each step:
- Tell the colleague what you're doing ("Step 3 of 14 — updating nav items…")
- Make the actual code change
- Briefly confirm what changed

### Checklist

**1. Colour tokens — `tailwind.config.js`**
Replace all hex values under `theme.extend.colors.tu`:
- `tu.purple` → primary colour
- `tu['purple-dark']` → primary dark
- `tu['purple-light']` → primary light tint
- `tu.pink` → accent colour
- `tu['pink-dark']` → accent dark
- Keep `tu.black`, `tu.charcoal`, `tu.mid`, `tu.muted`, `tu.border`, `tu.surface`, `tu.star`, `tu.sale` as-is unless specified.

**2. Logo — `src/components/store/StoreNav.jsx`**
- Replace the logo `<img src="...">` with the brand's logo URL.
- Remove the `+` separator and any co-brand logo — these are Tu-specific.
- Update `aria-label` to `"{Brand name} home"`.

**3. Favicon and tab title — `index.html`**
- Update `<title>` to the brand name.
- If the colleague has a favicon URL, update `<link rel="icon">`.

**4. Nav items — `StoreNav.jsx` (`NAV_ITEMS` array)**
- If categories are "same as template", leave unchanged.
- Otherwise replace the `NAV_ITEMS` array. For each category, create a nav item with `label`, `href`, and a 2-column `menu` (explore links + more links). Keep the same data structure.

**5. Utility links — `StoreNav.jsx` (`UTILITY_LINKS`)**
- Update labels to match the brand. Replace "Nectar" with the loyalty programme name, or remove if none.

**6. Promo messages — `HomePage.jsx` (`PROMOS`)**
- Replace the 3 rotating promo messages with brand-appropriate ones. Keep them short and punchy.

**7. Home page content — `src/pages/HomePage.jsx`**
- Update `NectarBanner`: if loyalty = "none", remove it entirely; otherwise update brand name and colour.
- Update `TuCmsSection`: replace `PROMO_BUTTONS` labels/hrefs, `PORTRAIT_TILES`/`SQUARE_TILES` headings, CDN image calls (use Unsplash or provided CDN).
- Update `DoubleHero` `HERO_PANELS`: replace headings, CTA labels, images.
- Update `SaleBanner` `SALE_CATEGORIES`.
- Update `TrendingCarousel` `TREND_ITEMS`: replace names and prices.
- Update `CategoryTiles` `CATEGORIES`.

**8. Product catalogue — `src/data/womensProducts.js`**
- Update `brand` field on all products to the new brand name.
- If a CDN pattern was provided, update `images` arrays. Otherwise use Unsplash placeholders at `?w=540&h=732` aspect ratio.
- Update `womensCategories` if categories changed.

**9. Search scenarios — `src/data/cimulateSearchData.js`**
- Update `TYPEAHEAD_GROUPS` trigger keywords and suggestions to fit the brand's vocabulary.
- Update `SCENARIOS`: replace `exampleQuery` and `interpretation` strings. Keep the same number of scenarios.
- Update `brand` fields in `SEARCH_PRODUCTS`.

**10. Concierge name — `src/components/store/DottieConcierge.jsx` and `src/data/dottieConciergeData.js`**
- Ask: "Would you like to rename the AI style advisor (currently 'Izzy')? If yes, what name? If no, say 'keep as Izzy'."
- If renaming: find-and-replace `Izzy` → new name in `DottieConcierge.jsx`. Update greeting text in `dottieConciergeData.js` openers.

**11. Store locator — `src/pages/WomensPDPPage.jsx` (`STORE_DATA`)**
- Ask: "Keep the Shop to Store widget? If yes, what's your physical store chain name? If no, say 'remove it'."
- If removing: delete `ShopToStore` component and its invocation in `PurchasePanel`.
- If keeping: replace all `Sainsbury's X` names with `{chain} X` placeholders.

**12. Loyalty programme — `src/pages/BagPage.jsx`**
- If loyalty = "none": remove the Sparks strip section entirely.
- If loyalty exists: replace "SPARKS"/"Sparks" with the programme name throughout.

**13. Footer — `src/components/store/StoreFooter.jsx`**
- Replace the company name in the copyright line.
- Update footer column headings and links to match the brand.

**14. Checkout legal copy — `src/pages/CheckoutPage.jsx`**
- Replace "Tu Clothing, J Sainsbury plc" and "Globale U.K. Limited" with the brand's legal entity name (or `[Brand Legal Name]` as placeholder).
- Update the checkout header logo text from "M&S" to the brand abbreviation.

---

## Step 5 — Final summary

After all 14 steps, output:

> ✅ **Rebrand complete for {Brand name}**
>
> Here's what was changed:
> - Colour tokens updated (primary: {colour}, accent: {colour})
> - Logo updated
> - {n} nav categories set
> - Home page content updated
> - Product catalogue updated
> - Search scenarios updated
> - Concierge {renamed to X / kept as Izzy}
> - Shop to Store {updated / removed}
> - Loyalty strip {updated / removed}
> - Footer and legal copy updated
>
> **Next steps:**
> 1. Run `npm run dev` to preview at localhost:3333
> 2. Add your real product data to `src/data/womensProducts.js`
> 3. Replace any Unsplash placeholder images with your own
> 4. Deploy with `railway up --detach`
