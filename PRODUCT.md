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
- The first product is Chartwizard: a Windows desktop app for charting and screening IDX/BEI stocks, with pattern scanning, screeners, and sector analysis. Pro is about Rp19rb/month or Rp150rb/year, sold via Lynk. The card links to https://chart.codewizard.id.
- One tasteful “Segera hadir” placeholder slot.
- `CNAME` contains exactly `codewizard.id`. A designed `404.html` is required.
- Do not change anything related to chart.codewizard.id or the repository anggakawa/chartwizard-releases. Do not invent customers, testimonials, benchmarks, or features beyond the brief.
- Contact in the footer is the GitHub account anggakawa (https://github.com/anggakawa). No public email was given; none is invented.
- Copyright line names Codewizard.

## Brand Commitments

- The name is Codewizard, one word. Do not restyle it as “Code Wizard” or reuse names, logos, or taglines from codewizard.com or codewiz.com.
- Visual direction pinned by the owner: light and minimal, a product-studio feel, lots of whitespace, clean typography, one restrained accent, responsive, fast, and suitable for good Lighthouse scores.
- Proper title, description, and Open Graph tags. A simple original favicon.
- Footer: contact, GitHub anggakawa, copyright Codewizard.
- The visual system is recorded in `DESIGN.md` and applied through custom properties in `styles.css`. Normative values live in those two files and must stay in step.

## Design System

Light, minimal, product-studio. The page is one daylight sheet with wide margins. Tokens are CSS custom properties. There is no dark theme.

Color: `--color-desk`, `--color-sheet`, `--color-ink`, `--color-secondary`, `--color-rule`, `--color-rule-strong`, `--color-accent`, `--color-hover`, `--color-select`, `--color-shadow`.

Type: `--font-sans` (Schibsted Grotesk), `--font-size-display`, `--font-size-headline`, `--font-size-title`, `--font-size-lead`, `--font-size-body`, `--font-size-nav`, `--font-size-label`, `--font-size-mark`, `--font-weight-regular`, `--font-weight-semibold`, `--line-height-display`, `--line-height-title`, `--line-height-lead`, `--line-height-body`, `--letter-spacing-display`, `--letter-spacing-title`, `--letter-spacing-lead`, `--letter-spacing-action`.

Spacing: `--space-1` through `--space-9`, plus `--space-sheet-x`, `--space-sheet-y`, `--space-section`, `--space-section-end`, `--space-error`.

Radius: `--radius-none` and `--radius-sheet`, both `0`. Corners stay square.

Motion: `--ease-arrive`, `--duration-feedback` (150ms), `--duration-state` (180ms), `--duration-focal` (680ms). The focal moment is the live title’s register mark finding alignment. Cards and links only change color, opacity, or a few pixels of translation. `prefers-reduced-motion` drops the spatial movement and keeps color and opacity feedback. Copy stays visible without JavaScript.

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
