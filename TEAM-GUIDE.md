# How to Build a Branded Storefront — Team Guide

This guide walks you through using the Storefront Skills plugin to spin up a fully working retail storefront demo and rebrand it to any brand in under an hour.

---

## What you'll end up with

A live, routed React SPA with:
- Homepage (hero, trending carousel, category tiles, email signup)
- Product listing page (filters, sort, category tabs)
- Product detail page (image gallery, size/colour picker, add to bag)
- AI-powered search with typeahead and adaptive flows
- AI style advisor chat widget on product pages
- Shop to Store widget (click & collect)
- Bag and full checkout with Express Pay options
- Deployable to Railway in one command

All rebranded to your brand's colours, logo, categories, and copy.

---

## Step 1 — Install Claude Code

If you don't have Claude Code yet:

```bash
npm install -g @anthropic-ai/claude-code
```

Then sign in:

```bash
claude
```

Follow the prompts to authenticate with your Anthropic account.

---

## Step 2 — Install the Storefront Skills plugin

Run these two commands once — you won't need to repeat them:

```bash
# Add the storefront marketplace
claude plugin marketplace add sachinpatelsalesforce/storefront-skills

# Install the storefront plugin
claude plugin install storefront@storefront-skills
```

That's it. The plugin is now installed globally and will be available in every Claude Code session.

---

## Step 3 — Get the storefront project

Clone the Tu Clothing storefront template:

```bash
git clone https://github.com/sachinpatelsalesforce/storefront-skills my-storefront
cd my-storefront
npm install
```

> **Or** — if you already have a copy of the project, just `cd` into it.

---

## Step 4 — Open Claude Code in your project

```bash
claude
```

The first time you open a session, the plugin automatically copies `template-design.md` into your project folder and shows a toast notification:

> *template-design.md copied to your project — run /build-storefront to get started*

---

## Step 5 — Run the help command

Type this to see a full reference of what's available:

```
/storefront-help
```

This shows you all commands, a table of the 14 rebranding steps, prerequisites, and post-deploy instructions.

---

## Step 6 — Build and rebrand your storefront

Type:

```
/build-storefront
```

Claude will ask you **10 questions** about your brand, all at once:

| # | Question | Example answer |
|---|----------|----------------|
| 1 | Brand name | `ACME Fashion` |
| 2 | Primary colour | `#003087` |
| 3 | Primary dark variant | `#002366` |
| 4 | Primary light tint | `#E8F0FE` |
| 5 | Accent / CTA colour | `#FF4500` |
| 6 | Accent dark variant | `#CC3700` |
| 7 | Logo URL | `https://...` or `I'll add it later` |
| 8 | Product categories | `Women / Men / Kids / Sale` or `same as template` |
| 9 | Loyalty programme | `ACME Rewards` or `none` |
| 10 | Product CDN | `https://cdn.acme.com/images/{id}?w=540` or `use Unsplash placeholders` |

Answer all 10, then Claude will confirm your answers and ask you to type **yes** to proceed.

---

## Step 7 — Review the changes

Claude works through 14 rebranding steps automatically, telling you what it's doing at each one:

1. Colour tokens
2. Logo
3. Favicon + tab title
4. Nav categories + mega-menu
5. Utility links
6. Promo bar messages
7. Home page sections
8. Product catalogue
9. AI search scenarios
10. AI concierge name + flows
11. Shop to Store widget
12. Loyalty programme strip
13. Footer
14. Checkout legal copy

When it's done you'll see a summary of everything that changed.

---

## Step 8 — Preview locally

```bash
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) in your browser.

---

## Step 9 — Deploy

```bash
railway up --detach
```

> First time? Install Railway CLI with `npm install -g @railway/cli` and run `railway login`.

After deploy, run `railway domain` to get your public URL.

---

## After the rebrand — what to do next

| Task | Where |
|------|-------|
| Add your real products | `src/data/womensProducts.js` |
| Replace placeholder images | `images[]` arrays in `womensProducts.js` |
| Update search scenarios | `src/data/cimulateSearchData.js` |
| Customise concierge flows | `src/data/dottieConciergeData.js` |
| Add real store locations | `STORE_DATA` in `src/pages/WomensPDPPage.jsx` |
| Change promo bar messages | `PROMOS` in `src/pages/HomePage.jsx` |

---

## Understanding the architecture

The full architecture is documented in `template-design.md` in your project root. It covers every component, page, data model, and design pattern. Read it if you want to go beyond the rebranding checklist and make deeper changes.

Key files to know:

| File | Purpose |
|------|---------|
| `src/StoreApp.jsx` | Root component, routing |
| `tailwind.config.js` | All brand colour tokens |
| `src/components/store/StoreNav.jsx` | Nav, mega-menu, search overlay |
| `src/pages/WomensPLPPage.jsx` | Product listing |
| `src/pages/WomensPDPPage.jsx` | Product detail |
| `src/pages/BagPage.jsx` | Cart |
| `src/pages/CheckoutPage.jsx` | Checkout |
| `src/data/womensProducts.js` | Product catalogue |
| `src/data/cimulateSearchData.js` | AI search scenarios |
| `src/data/dottieConciergeData.js` | AI concierge flows |

---

## Need help?

Run `/storefront-help` in any Claude Code session for a quick command reference, or just ask Claude a question — it has the full template context loaded.

---

*Built by Sachin Patel · [github.com/sachinpatelsalesforce/storefront-skills](https://github.com/sachinpatelsalesforce/storefront-skills)*
