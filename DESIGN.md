---
name: Codewizard
description: Daylight imprint sheet for a small product studio.
colors:
  register-blue: "#0f4c6e"
  carbon-ink: "#1a1d21"
  caption-ink: "#314556"
  sheet: "#fbfbfc"
  desk: "#e4e7eb"
  hairline: "#d5dbe3"
  uninked: "#b7c0ca"
  row-wash: "#f3f6f8"
  selection-wash: "#d3e3ee"
typography:
  display:
    fontFamily: "Schibsted Grotesk, Segoe UI, sans-serif"
    fontSize: "clamp(2.4rem, 8vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Schibsted Grotesk, Segoe UI, sans-serif"
    fontSize: "clamp(2.2rem, 6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Schibsted Grotesk, Segoe UI, sans-serif"
    fontSize: "clamp(1.65rem, 3vw, 2.15rem)"
    fontWeight: 600
    lineHeight: 1.15
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
  sheet: "0"
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
  sheet-x: "clamp(1.25rem, 5vw, 4.5rem)"
  sheet-y: "clamp(1.75rem, 5vw, 4.25rem)"
  section: "clamp(3.25rem, 8vw, 6rem)"
components:
  visit-link:
    textColor: "{colors.register-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0"
  visit-link-hover:
    textColor: "{colors.register-blue}"
  product-row:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.carbon-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "2.5rem clamp(1.25rem, 5vw, 4.5rem)"
  product-row-hover:
    backgroundColor: "{colors.row-wash}"
    textColor: "{colors.carbon-ink}"
  nav-link:
    textColor: "{colors.carbon-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.25rem"
  nav-link-hover:
    textColor: "{colors.register-blue}"
---

# Design System: Codewizard

## Overview

**Creative North Star: "The Daylight Imprint"**

Codewizard’s site is one sheet of paper on a cool desk, read in ordinary daylight. The studio name is the press name. Each app is a title in the imprint, with its place of publication, platform, and price on the same entry. Nothing here pretends to be a larger company, and the page does not borrow the voice of a startup hero or a card grid.

The sheet is square-cornered, set in one grotesque, and mostly quiet. Register blue is rare at rest: it marks the title that is actually in print, and the link that opens it. A title that is not ready is drawn with an empty circle and stays uninked. Motion does one job on arrival — the live mark finds its register — and after that only answers the pointer.

**Key Characteristics:**

- One sheet, wide margins, hairline rules, lots of open paper
- Carbon ink on a cool white sheet, over a slightly darker desk
- One accent, register blue, used sparingly
- Schibsted Grotesk for every role
- Square corners; the only curve is the drawn register mark
- Bahasa Indonesia, short lines, no second language toggle

## Colors

A cool daylight palette: paper, carbon, and one steel blue.

### Primary

- **Register Blue** (`#0f4c6e`, `--color-accent`): The live product’s register mark, the visit link, focus rings, and the text caret. Hover may borrow it for a moment. It is not a fill for large areas.

### Neutral

- **Carbon Ink** (`#1a1d21`, `--color-ink`): Headings, body, and footer links at rest.
- **Caption Ink** (`#314556`, `--color-secondary`): Specification labels, the coming-soon note, and footer text. Dark enough to read on the sheet.
- **Sheet** (`#fbfbfc`, `--color-sheet`): The page surface.
- **Desk** (`#e4e7eb`, `--color-desk`): The ground around the sheet on wide screens. Phones hold the sheet full-bleed, so the desk disappears.
- **Hairline** (`#d5dbe3`, `--color-rule`): Rules between titles, under spec rows, and above the footer.
- **Uninked** (`#b7c0ca`, `--color-rule-strong`): The empty register on a title that is not out yet. Decorative only; the words beside it stay in carbon or caption ink.
- **Row Wash** (`#f3f6f8`, `--color-hover`): The live row when the pointer or keyboard is on it.
- **Selection Wash** (`#d3e3ee`, `--color-select`): Text selection. `--color-shadow` is `rgba(22, 26, 32, 0.08)`, used only by the sheet shadow.

### Named Rules

**The One Accent Rule.** At rest, register blue appears only on the live title’s mark and its visit link, plus focus. Its rarity is the point.

## Typography

**Display Font:** Schibsted Grotesk (with Segoe UI, then sans-serif)
**Body Font:** Schibsted Grotesk (same stack)
**Label/Mono Font:** none. Addresses and prices use the same face, with tabular numbers on prices.

**Character:** A contemporary newspaper grotesque. One family, two weights (400 and 600), tight display tracking, open body leading. The lead under the studio name uses `--font-size-lead` (`clamp(1.2rem, 2vw, 1.45rem)`) and stays within about 34em.

### Hierarchy

- **Display** (600, `clamp(2.4rem, 8vw, 4.5rem)`, line-height 0.96): The studio name on the home sheet.
- **Headline** (600, `clamp(2.2rem, 6vw, 3.5rem)`, line-height 0.96): The 404 title.
- **Title** (600, `clamp(1.65rem, 3vw, 2.15rem)`, line-height 1.15): A product name.
- **Body** (400, `1.0625rem`, line-height 1.55): Descriptions. Measure stays near 34–38em.
- **Label** (400, `0.875rem`, line-height 1.55): Spec labels, the domain, the footer.

### Named Rules

**The One Face Rule.** Do not add a serif, a monospace costume, or a second family for “technical” details.

## Layout

The sheet is `min(70rem, 100% - 3rem)`, centered, with at least `1.5rem` of desk around it, and it is at least as tall as the viewport. Inside, padding is `--space-sheet-y` by `--space-sheet-x`. The masthead is a wrapping row: the name on the baseline, Produk and Kontak beside it. The catalog starts after `--space-section`. Each product is two columns from 721px up (story, then specs and the visit link) and one column below that. Rules run the full width of the sheet, including through the side padding. The footer sits at the bottom of the sheet when the list is short.

Spacing steps `--space-1` through `--space-9` are 0.25rem apart, starting at 0.25rem. Fluid spaces (`sheet-x`, `sheet-y`, `section`) are for the margins that should breathe.

## Elevation & Depth

Depth is mostly tonal. The desk is darker than the sheet; rules separate entries. One shadow exists, and only under the sheet on wide screens, offset downward: `--shadow-sheet` = `0 16px 40px var(--color-shadow)`. Phones drop the shadow because the sheet is the screen. Rows do not lift.

### Shadow Vocabulary

- **Sheet** (`box-shadow: 0 16px 40px rgba(22, 26, 32, 0.08)`): The paper sitting on the desk. Not used on rows, links, or the phone layout.

### Named Rules

**The Flat Row Rule.** A product row does not float. Hover changes its wash, not its elevation.

## Shapes

Corners are square: `--radius-none` and `--radius-sheet` are both `0`, and the sheet, rows, and links use them. The register mark is a drawn circle with crosshairs, not a rounded rectangle. The coming-soon mark is the circle alone.

## Components

### Buttons

There is no filled button. The visit link is the only primary action.

- **Shape:** square (radius 0).
- **Primary:** Register blue text. The action line is weight 600; the domain under it is 0.875rem and underlined. Minimum height 2.75rem.
- **Hover / Focus:** The action shifts 3px to the right. Pressing it settles to 1px and drops to opacity 0.72. The row behind it takes the row wash. Focus draws a 2px register-blue outline around the whole row.
- **Secondary:** Text links in the masthead and footer. Carbon at rest, register blue on hover, opacity 0.72 when pressed. No fill.

### Cards / Containers

- **Corner Style:** square.
- **Background:** Sheet, row wash on hover only when the row is a link.
- **Shadow Strategy:** none on the row. See the sheet shadow above.
- **Border:** a hairline across the top. No side borders.
- **Internal Padding:** `--space-8` (2.5rem) vertically, sheet padding horizontally.
- **Coming soon:** same structure, empty register, no link, no wash.

### Navigation

- **Style:** two text links, Produk and Kontak, sharing the masthead baseline with the wordmark.
- **Typography:** `--font-size-nav` (0.9375rem), carbon ink.
- **States:** hover turns register blue and underlines; pressed fades to opacity 0.72; focus uses the global outline.
- **Mobile:** the links wrap under the wordmark. Each link is at least 2.75rem tall.

### Register mark

A 1.05rem circle. The live title adds crosshairs in register blue. On the first live title, those crosshairs start 3px low and to the right at opacity 0.45 and ease into place over 680ms (`--ease-arrive`). The circle does not move, and the words are visible throughout. Later live titles, if any, stay still. The coming-soon circle is uninked and does not animate.

### Specification list

A two-column definition list. The label is caption ink at 5.8rem; the value is carbon ink with tabular numbers. Rows are separated by hairlines.

## Do's and Don'ts

### Do:

- **Do** keep new products as imprint rows fed by `products.js`, with the same fields: name, summary, specs, https link, and domain.
- **Do** leave one uninked “Segera hadir” row until that product has a real subdomain.
- **Do** keep copy visible without JavaScript. The script only replaces the same list.
- **Do** keep `prefers-reduced-motion` spatial movement off, and keep color and opacity feedback on.

### Don't:

- **Don't** add a second accent, a gradient, a filled pill, or a drop shadow on a row.
- **Don't** round the sheet or turn products into icon-plus-heading tiles.
- **Don't** set type in a monospace face to look technical.
- **Don't** hide the register circle or the product names behind an entrance animation.
- **Don't** imply this studio is CODE WIZARD INC or Code Wiz, and don't invent prices, platforms, or screenshots.
