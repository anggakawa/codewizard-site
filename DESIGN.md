---
name: Codewizard
description: Monochrome studio page with a slow wireframe globe.
colors:
  night: "#0c0c0c"
  paper: "#f6f6f6"
  ink: "#141414"
  inverse: "#f4f4f4"
  caption: "#454545"
  caption-inverse: "#c8c8c8"
  hairline: "#e3e3e3"
  hairline-inverse: "#2c2c2c"
  row-wash: "#ececec"
  selection: "#dedede"
  selection-inverse: "#3a3a3a"
typography:
  display:
    fontFamily: "Schibsted Grotesk, Segoe UI, sans-serif"
    fontSize: "clamp(3.1rem, 7vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Schibsted Grotesk, Segoe UI, sans-serif"
    fontSize: "clamp(2.2rem, 6vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Schibsted Grotesk, Segoe UI, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 2.4rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Schibsted Grotesk, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.02em"
  label:
    fontFamily: "Schibsted Grotesk, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
rounded:
  none: "0"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "7": "2rem"
  "8": "2.5rem"
  "9": "3rem"
  "10": "4rem"
  sheet-x: "clamp(1.25rem, 4vw, 3.5rem)"
  section: "clamp(4rem, 8vw, 6.5rem)"
components:
  visit-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0"
  visit-link-hover:
    textColor: "{colors.ink}"
  hero-link:
    textColor: "{colors.inverse}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0"
  product-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "2.5rem 0"
  product-row-hover:
    backgroundColor: "{colors.row-wash}"
    textColor: "{colors.ink}"
  nav-link:
    textColor: "{colors.inverse}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.25rem"
  nav-link-hover:
    textColor: "{colors.inverse}"
---

# Design System: Codewizard

## Overview

**Creative North Star: "The Quiet Globe"**

The first screen is a night field. Codewizard’s name sits in white on the left. On the right, a sphere of points and short links turns slowly, like a planet drawn as a network. Depth is only size and opacity. Nothing else moves on arrival.

Under that, the page returns to paper. Products are a list, not a grid of tiles. Chartwizard is the entry that is actually published: platform, market, price, and the link to its subdomain, in the same block. The footer is one copyright line. There is no contact block yet.

The palette is black, white, and gray. Corners stay square. Schibsted Grotesk does every job.

**Key Characteristics:**

- A full-viewport monochrome hero, then a paper product list
- One wireframe globe, slow, paused off-screen and when the tab is hidden
- White type on night, carbon type on paper
- No chromatic accent
- Square corners, hairline rules, one type family
- Bahasa Indonesia

## Colors

Black, white, and the grays between them. Hue does not carry meaning.

### Primary

There is no chromatic primary. Night (`#0c0c0c`, `--color-night`) is the hero field. Inverse ink (`#f4f4f4`, `--color-ink-inverse`) is the type and the globe on that field.

### Neutral

- **Paper** (`#f6f6f6`, `--color-paper`): The product list and the 404 page.
- **Ink** (`#141414`, `--color-ink`): Headings and body on paper. Focus rings use `currentColor`, so they flip with the field.
- **Caption** (`#454545`, `--color-secondary`): Spec labels, the domain, the footer, and the 404 explanation.
- **Caption on night** (`#c8c8c8`, `--color-secondary-inverse`): The hero sentence.
- **Hairline** (`#e3e3e3`, `--color-rule`): Rules in the product list and above the footer.
- **Hairline on night** (`#2c2c2c`, `--color-rule-inverse`): Reserved. The hero has no rules.
- **Row wash** (`#ececec`, `--color-hover`): A live product row under the pointer or keyboard.
- **Selection** (`#dedede` / `#3a3a3a`): Text selection on paper and on night.

The globe is white at varying opacity. Back points are faint; front points are brighter and larger. That is depth, not a second color.

### Named Rules

**The Monochrome Rule.** Do not introduce a hue. Gray is the only secondary tone. A link is underlined, not recolored.

## Typography

**Display Font:** Schibsted Grotesk (Segoe UI, sans-serif)
**Body Font:** Schibsted Grotesk
**Label/Mono Font:** none. Prices use the same face with tabular numbers.

**Character:** One grotesque, weights 400 and 600. The hero name is large and tightly tracked. The sentence under it stays near 28em and is set in caption-on-night, not a second family.

### Hierarchy

- **Display** (600, `clamp(3.1rem, 7vw, 5.5rem)`, line-height 0.94): “Codewizard” in the hero.
- **Headline** (600, `clamp(2.2rem, 6vw, 3.6rem)`, line-height 0.94): The 404 title.
- **Title** (600, `clamp(1.8rem, 3vw, 2.4rem)`, line-height 1.12): A product name.
- **Body** (400, `1.0625rem`, line-height 1.55): Product descriptions.
- **Label** (400, `0.875rem`): Spec labels, domains, the footer.

### Named Rules

**The One Face Rule.** Do not add a serif or a monospace costume.

## Layout

The hero is `100svh`, two columns from 721px: copy on the left, the canvas on the right. The header sits over the hero: wordmark and “Produk”. On a phone the globe is the top of the hero and the name sits under it, still on night, so the sphere is in the first screen and the type does not cross it.

The product list is paper, padded by `--space-section`, aligned to the same left edge as the hero copy (`--space-sheet-x`, or the inset that keeps a 76rem measure centered). Each product is two columns on a wide screen and one column on a phone. The footer is a single line under a hairline.

## Elevation & Depth

No drop shadows. The night field against the paper field is the only large depth change. Inside the globe, nearer points are larger and more opaque. Product rows do not lift.

### Shadow Vocabulary

None.

### Named Rules

**The Flat Row Rule.** Hover washes the row. It does not raise it.

## Shapes

`--radius-none` is `0`. The sheet, rows, links, and focus rings are square. The only curves are the globe’s points and the links between them.

## Components

### Buttons

There is no filled button.

- **Hero link:** “Lihat produk”, white, a 1px underline, minimum height 2.75rem. Hover shifts it 3px right. Pressed, it fades to opacity 0.65. Reduced motion keeps the fade and drops the shift.
- **Visit link:** On paper, carbon, same underline and shift. The domain sits under it in caption gray.
- **Focus:** 2px `currentColor` outline.

### Cards / Containers

- **Corner style:** square.
- **Background:** Paper. Row wash only when the row is a link and it is hovered or focused.
- **Border:** A hairline on top.
- **Padding:** `--space-8` vertically.
- **Coming soon:** The renderer still accepts `status: "segera"` as a row without a link. The live list does not include one.

### Navigation

Wordmark plus “Produk”. On the hero they are inverse ink; on the 404 page they are carbon. Hover underlines. Pressed fades. Each link is at least 2.75rem tall. There is no contact link.

### Globe

A canvas in the hero. Points sit on a tilted sphere and connect to a few nearby neighbors. It rotates about once a minute. Device pixel ratio is capped at 2, and at 1.5 below 720px. The loop stops when the tab is hidden or the canvas leaves the screen. `prefers-reduced-motion` draws one still frame and does not start the loop. If the script fails, the hero type remains.

### Specification list

Label column 5.8rem in caption gray. Values in ink, tabular numbers, hairline between rows.

## Do's and Don'ts

### Do:

- **Do** add a product in `products.js` and mirror the article in `index.html`.
- **Do** keep the globe monochrome, slow, and out of the product list.
- **Do** keep hero type off the sphere, especially on a phone.
- **Do** leave the footer as a copyright line until a contact block is asked for.

### Don't:

- **Don't** add a colored accent, a gradient fill, or a glow on the globe.
- **Don't** put the product list on the night field.
- **Don't** hide the hero sentence behind the animation or behind a failed script.
- **Don't** invent products, prices, or screenshots.
- **Don't** imply this studio is CODE WIZARD INC or Code Wiz.
