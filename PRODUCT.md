# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS with one small script and no build step, served by GitHub Pages from the default branch root. Confirmed in the brief: plain HTML/CSS is preferred so Pages can serve the site as-is. Inferred label: no framework, no bundler.

## Users

People arriving at codewizard.id to find which apps the studio makes and where each one lives. The first concrete audience is someone evaluating Chartwizard, a Windows desktop app for charting and screening stocks on the Indonesia Stock Exchange (IDX/BEI). Inferred from the brief; not separately interviewed. This session had no structured question tool, and the decision page cannot start before this file exists, so unmarked facts below are taken from the task brief and marked where they are inference.

## Product Purpose

Codewizard is a small product studio and the home of several apps. This site is the umbrella landing page at the apex domain codewizard.id. Each product lives on its own subdomain, `<product>.codewizard.id`. Success means a visitor understands the studio, can open Chartwizard, and a maintainer can add the next product from one data list.

## Positioning

A short studio index, not a product manual and not a company brochure. The page names the studio, lists real products with their real homes, and stays quiet about apps that do not exist yet. It does not speak for chart.codewizard.id and does not describe itself as affiliated with CODE WIZARD INC (codewizard.com) or Code Wiz (codewiz.com).

## Operating Context

Visitors open the apex domain in a browser, on a phone or a laptop, often in ordinary daylight. GitHub Pages serves the files. The first product is sold elsewhere (Lynk) and documented on its own subdomain; this page only introduces it and links out.

## Capabilities and Constraints

- Bahasa Indonesia is the page language. An English toggle was optional and is skipped so the page stays uncluttered.
- Products render from one list (`products.js`). A no-JS fallback repeats those same entries in the HTML.
- The first product is Chartwizard: a Windows desktop app for charting and screening IDX/BEI stocks, with pattern scanning, screeners, and sector analysis. Pro is about Rp19rb/month or Rp150rb/year, sold via Lynk; the owner asked (2026-10-29) to keep plan and prices off this page, so the card shows platform and market only. The card links to https://chart.codewizard.id.
- The live list is Chartwizard only. A `segera` status still renders a row without a link if one is added later. There is no coming-soon slot on the page right now.
- `CNAME` contains exactly `codewizard.id`. A designed `404.html` is required.
- Do not change anything related to chart.codewizard.id or the repository anggakawa/chartwizard-releases. Do not invent customers, testimonials, benchmarks, or features beyond the brief.
- No contact section for now. The footer is the copyright line only.
- Copyright line names Codewizard.

## Brand Commitments

- The name is Codewizard, one word. Do not restyle it as “Code Wizard” or reuse names, logos, or taglines from codewizard.com or codewiz.com.
- Visual direction, revised by the owner: almost-white paper (lightened from gray on 2026-10-29), a soft black wireframe globe with a little blur and pixel dust, then the product list. The hero line is “A small studio where we…” with build, deploy, and make it happen swapping one at a time. Black, white, and gray only. No contact section yet. Recorded in `DESIGN.md` and `styles.css`.
- Proper title, description, and Open Graph tags. A simple original favicon.
- Footer: copyright Codewizard only, until a contact block is requested.
- The visual system is recorded in `DESIGN.md` and applied through custom properties in `styles.css`. Normative values live in those two files and must stay in step.

## Design System

Monochrome. Paper field, soft black globe. Tokens are CSS custom properties.

Color: `--color-paper`, `--color-ink`, `--color-secondary`, `--color-rule`, `--color-hover`, `--color-select`, `--color-dust`. No hue token. Paper is the field. The sphere and the dust are soft black.

Type: `--font-sans` (Instrument Sans), `--font-size-display`, `--font-size-headline`, `--font-size-title`, `--font-size-lead`, `--font-size-phrase`, `--font-size-body`, `--font-size-nav`, `--font-size-label`, `--font-size-mark`, `--font-weight-regular`, `--font-weight-semibold`, `--line-height-display`, `--line-height-title`, `--line-height-lead`, `--line-height-body`, `--letter-spacing-display`, `--letter-spacing-title`, `--letter-spacing-lead`, `--letter-spacing-action`.

Spacing: `--space-1` through `--space-10`, plus `--space-sheet-x` and `--space-section`.

Radius: `--radius-none` is `0`.

Motion: `--ease-arrive`, `--ease-leave`, `--ease-swap`, `--duration-feedback` (150ms), `--duration-state` (180ms), `--duration-wash`, `--duration-wipe`, `--duration-entrance`, `--duration-reveal`. One load entrance for the hero and one scroll reveal for the list; details in `DESIGN.md`. The globe and the pixel dust in `globe.js` share one loop. It pauses when the tab is hidden or the canvas is off-screen, caps device pixel ratio, and draws one still frame for `prefers-reduced-motion`. The hero phrase in `site.js` swaps with opacity and transform; reduced motion shows the three phrases as one still line. The first phrase is in the HTML. Link hovers may shift 3px; reduced motion drops that shift and keeps opacity changes.

## Evidence on Hand

- Repository started as a README only (`codewizard-site`).
- Product facts are only those in the task brief. There is no screenshot, logo file, or price page in this repo.
- Absence: do not fabricate Chartwizard interface captures, user counts, or review quotes.

## Product Principles

- Say only what the studio can point to.
- One list of products, easy to extend.
- The apex page introduces; each product speaks on its own subdomain.
- Stay light, fast, and readable in Indonesian.
- Keep the other “code wizard” brands out of the work entirely.

## Accessibility & Inclusion

The page is public and static. It should be readable without JavaScript, keyboard-reachable, and legible on a phone and a desktop. No product-specific accessibility standard beyond that was stated.
