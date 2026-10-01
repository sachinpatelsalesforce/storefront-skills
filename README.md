# Storefront Skills

Claude Code skills for building and rebranding a React SPA retail storefront.

## Installation

```bash
# 1. Add this repo as a marketplace (one-time)
claude plugin marketplace add YOUR_GITHUB_USERNAME/storefront-skills

# 2. Install the storefront skill plugin
claude plugin install storefront@storefront-skills
```

## Usage

Once installed, open any Claude Code session in your storefront project and run:

```
/build-storefront
```

Claude will:
1. Read the `template-design.md` architecture document
2. Ask you 10 questions about your brand (name, colours, logo, categories, etc.)
3. Confirm your answers
4. Apply all 14 rebranding changes with actual code edits
5. Give you a summary and next steps

## What's included

| Skill | Description |
|-------|-------------|
| `storefront:build-storefront` | Guided rebrand — collects brand details and applies all 14 code changes |

## Requirements

- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- A copy of the storefront project (cloned from the template repo)
- `template-design.md` present in the project root

## Template

The storefront template is a React + Vite + Tailwind CSS + React Router SPA with:
- Homepage, PLP, PDP, Bag, Checkout pages
- AI-powered search overlay with typeahead and adaptive flows
- AI style advisor concierge widget (Izzy)
- Shop-to-store widget
- Cart + Wishlist context
- Full checkout with Express Pay options

See `template-design.md` for the complete architecture reference.
