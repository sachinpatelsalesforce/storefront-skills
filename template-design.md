# Storefront Design System

A complete design document for a routed React SPA storefront demo. Built with React + Vite + Tailwind CSS + React Router + Express. Use this as a template to spin up a branded retail storefront and swap in your own brand tokens to make it yours.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | React 18 (functional components, hooks) |
| Routing      | React Router v6 (`BrowserRouter`)   |
| Styling      | Tailwind CSS with custom brand tokens |
| Build        | Vite (`npm run dev` → port 3333)    |
| Server       | Express (`server.js`) serving `/dist` as SPA |
| Deployment   | Railway (`railway up --detach`) or Heroku |

---

## Design Tokens (Rebrand Here)

All brand colours live in `tailwind.config.js` under `theme.extend.colors.tu`. To rebrand, swap every hex value in this block and update the logo.

```js
tu: {
  purple:        '#4A1942',   // PRIMARY — buttons, active states, borders, nav accents
  'purple-dark': '#3A1235',   // PRIMARY hover
  'purple-light':'#F5EEF8',   // Primary tint — backgrounds, highlights, AI callouts
  pink:          '#E91E8C',   // ACCENT — CTAs, sale highlights
  'pink-dark':   '#C2185B',   // Accent hover
  black:         '#1A1A1A',   // Body text, headings
  charcoal:      '#333333',   // Secondary text
  mid:           '#666666',   // Utility text, placeholder icons
  muted:         '#999999',   // Placeholders, de-emphasised labels
  border:        '#E0E0E0',   // All dividers, card borders
  surface:       '#F7F4F8',   // Page background tint, card surfaces
  star:          '#D4A017',   // Star ratings
  sale:          '#E53935',   // Sale prices, error states, badge
}
```

**Typography:** Inter (Google Font) → `font-sans`. Square/no-radius design language — set `--radius: 0` in your CSS variables to maintain it.

**Nav height constant:** `NAV_H = 132` (used as `paddingTop` on page roots and `top-[132px]` for sticky elements). Update this if you change the nav structure.

---

## Project Structure

```
src/
├── main.jsx                  → Mounts <StoreApp /> into #root
├── StoreApp.jsx              → Root: CartProvider + WishlistProvider + BrowserRouter + Layout
├── store.css                 → Store-specific CSS overrides
├── index.css                 → Tailwind base / global resets

├── components/
│   └── store/
│       ├── StoreNav.jsx      → Fixed top nav (utility bar, logo row, mega-menu, search overlay, mobile drawer)
│       ├── StoreFooter.jsx   → Site footer
│       ├── DottieConcierge.jsx → AI style advisor widget (exports IzzyConcierge + IzzyNavButton)
│       ├── NovaConcierge.jsx → Legacy AI product advisor (Dyson-style PDPs)
│       ├── ProductCard.jsx   → Shared product card (PLP grid)
│       └── ProductCarousel.jsx → Horizontal scroll carousel

├── pages/
│   ├── HomePage.jsx          → Home page (8 sections)
│   ├── PLPPage.jsx           → Dyson-style product listing
│   ├── PDPPage.jsx           → Dyson-style product detail
│   ├── WomensPLPPage.jsx     → Women's PLP (filters, sort, category tabs)
│   ├── WomensPDPPage.jsx     → Women's PDP (gallery, purchase panel, concierge, reviews)
│   ├── BagPage.jsx           → Bag / cart
│   └── CheckoutPage.jsx      → Checkout form + confirmation

├── context/
│   ├── CartContext.jsx       → Global cart state
│   └── WishlistContext.jsx   → Global wishlist state

└── data/
    ├── womensProducts.js     → Women's product catalogue (21 products + Xmas PJs)
    ├── products.js           → Dyson-style product catalogue
    ├── cimulateSearchData.js → AI search scenarios, typeahead groups, adaptive bra finder
    ├── dottieConciergeData.js → Izzy/Dottie concierge flows keyed by category
    └── novaConciergeData.js  → Nova concierge flows (legacy)
```

---

## Routing

Defined in `StoreApp.jsx`. The footer is hidden on `/bag` and `/checkout`.

| Path                      | Component         | Notes                              |
|---------------------------|-------------------|------------------------------------|
| `/`                       | `HomePage`        |                                    |
| `/air-treatment`          | `PLPPage`         | Accepts `?category=` query param   |
| `/products/:slug`         | `PDPPage`         | Dyson-style PDP                    |
| `/women`                  | `WomensPLPPage`   | Accepts `?category=` query param   |
| `/women/products/:slug`   | `WomensPDPPage`   | Women's PDP with concierge         |
| `/bag`                    | `BagPage`         | Cart; footer hidden                |
| `/checkout`               | `CheckoutPage`    | Checkout; footer hidden            |
| `*`                       | `HomePage`        | Catch-all                          |

---

## Global State

### CartContext (`src/context/CartContext.jsx`)

Wraps entire app. Provides `useCart()` hook.

```
items[]   → { key, product, colour, size, fit, qty }
count     → total item count (badge in nav)
addItem(product, { colour, size, fit, qty })
updateQty(key, qty)
removeItem(key)
clear()
```

Item `key` is a compound string (`${product.id}-${colour}-${size}-${fit}`) so the same product in different sizes/colours are separate line items.

### WishlistContext (`src/context/WishlistContext.jsx`)

```
ids[]      → Set of wishlisted product IDs
count      → total wishlisted
toggle(id) → add or remove
isWishlisted(id) → boolean
```

---

## Components

### StoreNav (`src/components/store/StoreNav.jsx`)

**Fixed** to top (`position: fixed; z-index: 50`). Three rows:

1. **Utility bar** (desktop only, `h-8`) — delivery message left, utility links (Help / Find a store / Delivery / Returns / Nectar) right.
2. **Logo + search + icons row** (`h-14`) — brand logo (swap `src` for your logo), search bar (desktop), Sign in / Wishlist / Basket icons, mobile hamburger.
3. **Primary nav tabs** (`h-10`) — horizontal scrollable tab list. Each tab has a mega-menu on hover.

**Mega-menu:** 2-column dropdown (Explore + Collections/Help/More) activated on `mouseEnter` with a 120ms close debounce.

**Search overlay** — drops below the nav header, full-width. Three modes:
- *Idle* — blank (no popular searches shown unless typeahead triggers)
- *Typeahead* — when query matches `TYPEAHEAD_GROUPS` keywords (`xmas/christmas/festive` → Xmas suggestions; `style/wardrobe/capsule/outfit` → style suggestions). Renders 5 full-width suggestion rows.
- *Standard results* — keyword match via `findScenario()`. Shows AI interpretation callout + 4-column `SearchProductCard` grid + optional "View all" link + "Try another search" chips.
- *Adaptive flow* — triggered by bra-finder queries. 3-question step-by-step then 4 personalised products.
- *No result* — shows search suggestion chips.

**Mobile drawer** — slides in from top on hamburger click. Search bar + accordion nav + utility links.

**IzzyNavButton** — `<IzzyNavButton />` rendered as the last nav tab. Opens the Izzy concierge drawer directly. Import from `DottieConcierge.jsx`.

---

### StoreFooter (`src/components/store/StoreFooter.jsx`)

Dark footer (`bg-tu-black`). Four columns: Help / Shopping with us / Company / Socials. Copyright row.

---

### ProductCard (`src/components/store/ProductCard.jsx`)

Used on PLP grids. Portrait `3/4` aspect image with:
- Hover: image swap to second image + scale + wishlist button fades in
- Badges: New (purple) / Sale (red) / Best Seller (black)
- Colour swatches (up to 5 + overflow count)
- Star rating
- Price with strikethrough for sale

---

### ProductCarousel (`src/components/store/ProductCarousel.jsx`)

Horizontal scroll with prev/next arrow buttons (desktop only). `scroll-snap-type: x mandatory`. Used on `HomePage` Trending section.

---

### IzzyConcierge / DottieConcierge (`src/components/store/DottieConcierge.jsx`)

**Exports:** `default IzzyConcierge` (widget on Women's PDPs) and `IzzyNavButton` (nav tab button).

The concierge is a chat-style drawer widget rendered inline on the PDP purchase panel. It reads the current `product` prop and looks up `IZZY_FLOWS[product.category]`.

**Flow structure:**
1. **Opener** — greeting message with product name
2. **Q1** — first fit/style question (e.g. "What's your usual dress size?")
3. **Q2** — second question keyed by Q1 answer
4. **Verdict** — keyed `"q1answer|q2answer"`. Returns `{ fit: 'perfect'|'good'|'consider', advice, products[] }`. Colour-coded card (purple/yellow/orange).
5. **Outfit builder** — 3-question flow → 3 product picks → "Add all to bag" button

**Nightwear auto-play demo:** When `category === 'Nightwear'`, the concierge auto-plays a scripted conversation after a delay: user asks about the product → Izzy responds with `ProductInfoCard` (image carousel + colour swatches + size pills) → customer says "add to basket" → Izzy shows inline express checkout (Apple Pay QR + 10s countdown / Google Pay / Card tabs).

**Free-text fallback:** If user types anything not matching a flow step, keyword-matched replies are returned.

**To add a new category flow:** Add a key to `IZZY_FLOWS` in `dottieConciergeData.js` following the same schema.

---

### NovaConcierge (`src/components/store/NovaConcierge.jsx`)

Legacy AI product advisor used on Dyson-style PDPs. Reads `NOVA_FLOWS` from `novaConciergeData.js`. Similar chat widget pattern but simpler (no outfit builder, no auto-play). Categories: `hair-dryers`, `air-purifiers`, `fan-purifiers`.

---

## Pages

### HomePage (`src/pages/HomePage.jsx`)

Eight stacked sections (top to bottom):

| Section | Component | Description |
|---------|-----------|-------------|
| 1 | `PromoBar` | Auto-rotating promo messages (4s interval). Prev/next arrows. |
| 2 | `NectarBanner` | Dismissable loyalty programme banner (persists dismissal in `localStorage`). Red (`#CC0000`). |
| 3 | `TuCmsSection` | Real CMS-style content: 4 red promo buttons, 3 portrait tiles (CDN images), Klarna strip, 2 square tiles, 2 full-width banners. |
| 4 | `DoubleHero` | 2-column hero grid. Each panel: full-bleed portrait image + dark overlay + label/heading/CTA button. |
| 5 | `SaleBanner` | Dark background (`bg-tu-black`) + large sale headline in accent pink + category link pills. |
| 6 | `TrendingCarousel` | 8-item horizontal scroll carousel. `scroll-snap-type: x mandatory`. Prev/next arrows (desktop). |
| 7 | `CategoryTiles` | 5-column grid (2 on mobile). Each tile: full-bleed portrait image + dark overlay + label + "Shop now →". |
| 8 | `EmailSignup` | Email capture form on `bg-tu-surface`. Toggles to success message on submit. |

**To rebrand:** Replace image URLs, heading copy, promo messages, and link hrefs. The CDN pattern (`https://media.4rgos.it/i/Argos/{id}?w=...`) is Tu-specific — replace with your own CDN or static image paths.

---

### WomensPLPPage (`src/pages/WomensPLPPage.jsx`)

Route: `/women?category={categoryId}`

**Layout structure:**
```
[Breadcrumb]
[Hero banner — category title + product count + trust badges]
[Sticky category tabs — scrollable horizontal pills, top-[132px]]
[Toolbar — filter toggle | item count | active filter chips | sort dropdown]
[2-column layout]
  [Left: FilterPanel (collapsible sidebar, desktop only)]
  [Right: Product grid — 2–5 cols depending on filter state]
```

**FilterPanel:** Collapsible accordion sidebar. Filter groups: Fit / Colour / Price / Brand. Each group uses custom checkbox UI (`div` styled as checkbox). Active filters shown as dismissable chips in the toolbar.

**Sort options:** Featured / Price Low–High / Price High–Low / Top Rated / New In.

**Product grid columns:** `grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` (filters visible) or `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5` (filters hidden).

**Category tabs** are sourced from `womensCategories` in `womensProducts.js`. Active tab filters `womensProducts` array.

---

### WomensPDPPage (`src/pages/WomensPDPPage.jsx`)

Route: `/women/products/:slug`

**Layout structure:**
```
[Breadcrumb — Home / Women / {category} / {product name}]
[2-column grid (lg:grid-cols-2)]
  [Left: Gallery]
    [Thumbnail column (desktop) | Main image]
    [ProductDetails accordions (desktop — below gallery)]
  [Right: PurchasePanel (sticky top-[148px] on desktop)]
    [Brand + product name + tagline]
    [Rating]
    [Price (sale price + strikethrough if discounted)]
    [Colour selector — swatch buttons]
    [Fit selector — text pills (only if product.fits.length > 1)]
    [Size selector — size pills with "Please select a size" error state]
    [Add to Bag button → /bag]
    [ShopToStore widget]
    [IzzyConcierge widget]
    [Delivery info block (Free Standard / Free Returns)]
    [Klarna instalment copy]
[ProductDetails accordions (mobile — below purchase panel)]
[Features strip — "Why we love it" checklist]
[Reviews — star summary + AI summary callout + individual reviews (expand/collapse)]
[You May Also Like — 4-column grid of same-category products]
```

**Gallery:** Left thumbnail column (desktop) + main image. Mobile: prev/next arrow buttons + dot indicators. Active thumbnail has `border-tu-black`.

**ShopToStore widget:** Collapsible section. Postcode form → 900ms simulated lookup → 4 nearby stores with `instock/limited/outofstock` status. Each non-OOS store has "Reserve free →" button → 700ms simulated reserve → confirmation with `TU-XXXXXX` reference and 48-hour hold note. Region detection by postcode prefix (SW/SE/E etc → London, M → Manchester, etc.).

**AI Review Summary:** Fixed callout block (`bg-tu-surface`, left border `border-l-4 border-tu-purple`, `✦` icon). Static copy (swap for real AI summary).

**You May Also Like:** Filters same-category products. Override slugs via `YMAL_OVERRIDES` object for specific product IDs.

---

### BagPage (`src/pages/BagPage.jsx`)

Route: `/bag`

**Layout:** 2-column (`1fr 320px` on large screens).

**Left column:**
- Empty state: centred message + "Continue Shopping" CTA
- Item table with header row (desktop): Item / Each / Qty / Total
- Each item: thumbnail, brand label, product name link, colour+size+fit, star rating, "Save for later" + "Remove" actions, qty dropdown (1–10), unit price, line total
- Saved for later list (appears when items are saved)
- Delivery & collection options — `<details>` accordion. Two options: Standard (free over £50) / Express

**Right column (sticky):**
- Promo code input (`TU10` = 10% off)
- Order total breakdown (subtotal / promo discount / total excl. delivery)
- Checkout button → `/checkout`
- "Secure checkout" trust signal

**Below the grid:**
- Sparks loyalty sign-up strip (dark green `#1b4332` background)
- Ways to pay section (payment method badges + Klarna)
- Inline mini-footer

---

### CheckoutPage (`src/pages/CheckoutPage.jsx`)

Route: `/checkout`

Has its own header (replaces StoreNav) with lock icon, brand name, and payment trust logos.

**Sections (top to bottom):**
1. **Order summary table** — item rows (name/qty/price/total) + subtotal row
2. **Express checkout** — PayPal / Amazon Pay / G Pay buttons (full-width, 3-column)
3. **Billing address form** — First/Last name, email, country dropdown, address lines, city, postcode, state, phone, marketing opt-in checkbox
4. **Delivery address** — radio: Same as billing / Add alternative
5. **Shipping method** — radio: Free standard (5–8 days) / Express £5.99 (3–5 days)
6. **Payment section** — method tabs (VISA/MC / PayPal / Klarna / G Pay), card form (number, expiry month/year dropdowns, CVV), redirect message for PayPal/GPay, Klarna instalment breakdown
7. **Billing summary sidebar** — items total / delivery / promo / order total

**Confirmation screen:** Replaces the form on successful submit. Shows order total, email confirmation message, "Continue Shopping" button → `/`.

**Validation:** Client-side required field validation. Errors highlight fields in `border-tu-sale bg-red-50`. `clear()` called on cart after successful submit.

---

## AI Search (`src/data/cimulateSearchData.js`)

The search overlay in `StoreNav` is powered by this data file.

**Key exports:**

| Export | Description |
|--------|-------------|
| `SEARCH_PRODUCTS` | Flat catalogue with `{ id, name, category, price, image, slug, rating, reviewCount, relevanceReason }` |
| `SCENARIOS` | Array of `{ id, exampleQuery, keywords[], phrases[], interpretation, resultSummary, products[], viewAllUrl?, viewAllLabel? }` |
| `TYPEAHEAD_GROUPS` | Two groups: `xmas` and `style`, each with `label` and 5 `suggestions[]` strings |
| `getSuggestions(query)` | Returns matching typeahead group or `null` |
| `findScenario(query)` | Keyword/phrase match → scenario or `null` |
| `resolveProducts(scenario)` | Looks up full product objects from `SEARCH_PRODUCTS` |
| `ADAPTIVE_SCENARIO_ID` | ID of the scenario that triggers the adaptive flow |
| `ADAPTIVE_QUESTIONS` | Array of `{ id, text, options[] }` (3 questions for bra finder) |
| `getAdaptiveProducts(answers)` | Returns 4 products based on answers |
| `ENABLE_SIMULATED_CIMULATE_SEARCH` | Toggle to disable simulated search |

**To add a new search scenario:**
1. Add products to `SEARCH_PRODUCTS`
2. Add a scenario to `SCENARIOS` with `keywords`, `phrases`, `interpretation`, and `products` (ids from `SEARCH_PRODUCTS`)

---

## Product Data Model

### Women's products (`src/data/womensProducts.js`)

```js
{
  id: string,             // e.g. 'v-neck-knitted-vest'
  slug: string,           // URL slug (matches /women/products/:slug)
  name: string,
  brand: string,          // e.g. 'Tu Clothing'
  category: string,       // one of womensCategories ids
  tagline: string,
  shortDesc: string,
  price: number,
  originalPrice?: number, // if set and > price, shows sale styling
  rating: number,         // 0–5
  reviewCount: number,
  badge?: 'Sale' | 'Best Seller' | null,
  isNew?: boolean,
  colours: [{ name, swatch: '#hex', productId: 'tuc...' }],
  sizes: string[],        // e.g. ['6', '8', '10', '12']
  fits: string[],         // e.g. ['Petite', 'Regular', 'Long']
  images: string[],       // CDN URLs (Tu CDN: media.4rgos.it pattern)
  features: string[],
  fabric: string,
  care: string,
  description: string,
  specs: { [label]: value },
  reviews: [{ author, location, rating, date, title, text }],
}
```

**Image CDN pattern (Tu-specific):**
```
https://media.4rgos.it/s/Argos/{productId}_R_SET/{n}?w=540&h=732&qlt=75
```
where `productId` is a `tuc\d{9}` code and `n` is image index (1, 2, 3…).
Replace this with your own CDN when rebranding.

**womensCategories** — ordered array of `{ id, label }` used for category tabs. Categories: all / Dresses / Tops / Trousers / Jeans / Knitwear / Jackets & Coats / Skirts / Sportswear / Nightwear.

---

## Concierge Flow Data Model

### `dottieConciergeData.js` (Izzy flows)

```js
IZZY_FLOWS = {
  [categoryName]: {
    opener: (product) => string,   // greeting message
    q1: {
      text: string,                // question text
      options: [{ value, label }]
    },
    q2: {
      [q1AnswerValue]: {
        text: string,
        options: [{ value, label }]
      }
    },
    searching: string,             // "thinking…" message shown briefly
    verdicts: {
      '[q1answer|q2answer]': {
        fit: 'perfect' | 'good' | 'consider',
        advice: string,
        products: [{              // recommendation cards
          name, price, slug, image, badge?
        }]
      }
    }
  }
}
```

**Fit rating colours:**
- `perfect` → purple (`bg-tu-purple-light`, `border-tu-purple`)
- `good` → yellow (`bg-yellow-50`, `border-yellow-400`)
- `consider` → orange (`bg-orange-50`, `border-orange-300`)

---

## Design Patterns

### Square-corner design language
All interactive elements use no border radius (`rounded-none` or default 0). This is set globally via `--radius: 0` in `src/index.css`. Keep this when rebranding unless your brand uses rounded corners.

### Star rating component
Implemented as two overlapping `★★★★★` strings — grey base + coloured overlay clipped to `width: {pct}%`. Used in Nav search results, PLP cards, PDP, Bag.

### Sticky purchase panel
On desktop PDPs, the right-column purchase panel uses `lg:sticky lg:top-[148px] self-start`. The `148px` accounts for `NAV_H (132)` + category tab height.

### Breadcrumb
Used on PLP and PDP. Format: `Home / {section} / {category} / {product name}`. Last item is non-clickable.

### AI callout block
Reusable pattern: `bg-tu-surface border border-tu-border p-4` with a `w-7 h-7 bg-tu-purple text-white flex items-center justify-center` icon and heading + body copy. Used for AI review summaries, search interpretation banners.

### Section bar (Checkout)
`bg-tu-black text-white px-4 py-2.5 flex items-center justify-between` with uppercase tracking-widest label + optional right badge. Used to head each checkout section.

### Promo/info bar
Single-row `bg-tu-surface border-b border-tu-border h-9` centred text with pipe separators. Used at top of Bag page.

---

## Rebranding Checklist

To adapt this site to a new brand, change these files:

### 1. Colour tokens — `tailwind.config.js`
Replace all `tu.*` hex values. Keep the same token names so all components work without changes.

### 2. Logo — `src/components/store/StoreNav.jsx`
Replace the `<img src="...">` in the logo row with your brand's logo. Remove the `+` and Salesforce logo if not needed.

### 3. Favicon and tab title — `index.html`
Update `<link rel="icon" href="/favicon.svg">` and `<title>`.

### 4. Nav items — `StoreNav.jsx` (`NAV_ITEMS` array)
Replace categories, department labels, and mega-menu link trees.

### 5. Utility links — `StoreNav.jsx` (`UTILITY_LINKS` array)
Replace with your own support/account links.

### 6. Promo messages — `StoreNav.jsx` (or `HomePage.jsx` `PROMOS`)
Replace rotating promo bar messages.

### 7. Product catalogue — `src/data/womensProducts.js` and `src/data/products.js`
Replace with your products. Keep the same data shape.

### 8. Search scenarios — `src/data/cimulateSearchData.js`
Replace `SEARCH_PRODUCTS`, `SCENARIOS`, and `TYPEAHEAD_GROUPS` with your catalogue and search logic.

### 9. Concierge flows — `src/data/dottieConciergeData.js`
Replace `IZZY_FLOWS` with flows relevant to your product categories. Remove the Nightwear auto-play demo if not needed.

### 10. Home page content — `src/pages/HomePage.jsx`
Replace image URLs, headings, sale categories, promo button labels, category tiles.

### 11. Footer — `src/components/store/StoreFooter.jsx`
Replace link lists, company name, copyright.

### 12. CDN image pattern — `src/data/womensProducts.js`
The Tu CDN pattern (`media.4rgos.it/s/Argos/{id}...`) is retailer-specific. Replace image URLs with your own CDN or Unsplash placeholders.

### 13. Loyalty programme — `BagPage.jsx` (Sparks strip), `StoreNav.jsx` (Nectar banner)
Replace with your own loyalty programme or remove these sections.

### 14. Store locator data — `WomensPDPPage.jsx` (`STORE_DATA`)
Replace Sainsbury's store data with your own store locations, or remove the `ShopToStore` widget.

---

## Naming Conventions

| Pattern | Meaning |
|---------|---------|
| `tu-*` Tailwind classes | Brand colour tokens (rebrand these) |
| `NAV_H = 132` | Nav height constant; used for `paddingTop` and sticky offsets |
| `*PLP*` | Product Listing Page |
| `*PDP*` | Product Detail Page |
| `Izzy` / `Dottie` | Same component — `IzzyConcierge` is the public-facing name |
| `IZZY_FLOWS` / `DOTTIE_FLOWS` | Same export — aliased in the data file |
| `YMAL_OVERRIDES` | "You May Also Like" per-product overrides on PDP |
| `adaptiveState: 'off'|'questioning'|'result'` | State machine for adaptive search flow |
| `searchState: 'idle'|'loading'|'results'|'noresult'` | State machine for search overlay |
| `phase: 'idle'|'loading'|'results'` | State machine for ShopToStore postcode lookup |
| `fit: 'perfect'|'good'|'consider'` | Concierge verdict tiers |
