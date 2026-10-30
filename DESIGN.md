---
name: Codewizard
description: Monochrome studio page on almost-white paper, with a soft black wireframe globe.
colors:
  paper: "#fcfcfb"
  ink: "#1a1a1a"
  caption: "#4a4a4a"
  dust: "#2a2a2a"
  hairline: "#e6e6e4"
  row-wash: "#f3f3f1"
  selection: "#e8e8e6"
typography:
  display:
    fontFamily: "Instrument Sans, Segoe UI, sans-serif"
    fontSize: "clamp(3.1rem, 7vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Instrument Sans, Segoe UI, sans-serif"
    fontSize: "clamp(2.2rem, 6vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Instrument Sans, Segoe UI, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 2.4rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  phrase:
    fontFamily: "Instrument Sans, Segoe UI, sans-serif"
    fontSize: "clamp(1.7rem, 5vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Instrument Sans, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.015em"
  label:
    fontFamily: "Instrument Sans, Segoe UI, sans-serif"
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
    textColor: "{colors.ink}"
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
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.25rem"
  nav-link-hover:
    textColor: "{colors.ink}"
---

# Design System: Codewizard

## Overview

**Creative North Star: "The Quiet Globe"**

The first screen is almost white, with the faintest warmth. Codewizard’s name sits in soft black on the left. Under it, one sentence, then a word that leaves and the next word arrives: build, deploy, make it happen. On the right, a sphere of evenly spaced points and links turns, drawn in the same soft black, with a little blur. Small square specks drift through the hero.

The product list continues on the same paper. Chartwizard is the entry that is actually published: platform, market, and the link to its subdomain, in the same block. Plan and prices are left to the product’s own site. The footer is one copyright line. There is no contact block yet.

The palette is paper, ink, and gray. Corners stay square. Instrument Sans does every job.

**Key Characteristics:**

- A full-viewport paper hero, then the product list on the same field
- One soft-black wireframe globe, slow, slightly blurred, paused off-screen and when the tab is hidden
- Pixel dust in the hero, sparser over the type
- One swapping phrase under the sentence, with the first word in the HTML
- No chromatic accent
- Square corners, hairline rules, one type family
- Bahasa Indonesia for the product list; the hero line is the English the owner wrote

## Colors

Black, white, and the grays between them. Hue does not carry meaning.

### Primary

There is no chromatic primary. Paper (`#fcfcfb`, `--color-paper`) is the field for the hero and the list: almost pure white, with the faintest warmth. Ink (`#1a1a1a`, `--color-ink`) is the type and the globe.

### Neutral

- **Paper** (`#fcfcfb`, `--color-paper`): The whole page, including the hero and the 404 page.
- **Ink** (`#1a1a1a`, `--color-ink`): Headings, the swapping word, actions, and the globe. Focus rings use `currentColor`.
- **Caption** (`#4a4a4a`, `--color-secondary`): The hero sentence, spec labels, the domain, the footer, and the 404 explanation.
- **Dust** (`#2a2a2a`, `--color-dust`): Pixel specks in the hero, drawn at low alpha.
- **Hairline** (`#e6e6e4`, `--color-rule`): Rules in the product list and above the footer.
- **Row wash** (`#f3f3f1`, `--color-hover`): A live product row under the pointer or keyboard.
- **Selection** (`#e8e8e6`): Text selection.

The globe is soft black at varying opacity and width, then blurred by less than a pixel. Back links and points are faint hairlines and specks; front ones are darker, thicker, and larger. That is depth, not a second color.

### Named Rules

**The Monochrome Rule.** Do not introduce a hue. Gray is the only secondary tone. A link is underlined, not recolored.

## Typography

**Display Font:** Instrument Sans (Segoe UI, sans-serif)
**Body Font:** Instrument Sans
**Label/Mono Font:** none. Spec values use the same face with tabular numbers.

**Character:** One modern grotesque, weights 400 and 600. The hero name is large and tightly tracked. The sentence under it is caption gray. The swapping phrase is ink, smaller than the name, and stays on one line.

### Hierarchy

- **Display** (600, `clamp(3.1rem, 7vw, 5.5rem)`, line-height 0.96): “Codewizard” in the hero.
- **Headline** (600, `clamp(2.2rem, 6vw, 3.6rem)`, line-height 0.96): The 404 title.
- **Title** (600, `clamp(1.8rem, 3vw, 2.4rem)`, line-height 1.12): A product name.
- **Phrase** (600, `clamp(1.7rem, 5vw, 3rem)`, line-height 1.15): The swapping line under the hero sentence.
- **Body** (400, `1.0625rem`, line-height 1.55): Product descriptions.
- **Label** (400, `0.875rem`): Spec labels, domains, the footer.

### Named Rules

**The One Face Rule.** Do not add a serif or a monospace costume.

## Layout

The hero is `100svh`. From 721px the copy is the left column and the sphere is drawn toward the right of a canvas that covers the hero. The header sits over it: wordmark and “Produk”. On a phone a spacer holds the sphere above the name, so the type does not cross it. The field stays paper at both sizes.

The product list is paper, padded by `--space-section`, aligned to the same left edge as the hero copy (`--space-sheet-x`, or the inset that keeps a 76rem measure centered). Each product is two columns on a wide screen and one column on a phone. The footer is a single line under a hairline.

## Elevation & Depth

No drop shadows. Inside the globe, nearer points are larger and more opaque, and the canvas is blurred slightly. Product rows do not lift.

### Shadow Vocabulary

None.

### Named Rules

**The Flat Row Rule.** Hover washes the row. It does not raise it.

## Shapes

`--radius-none` is `0`. The sheet, rows, links, and focus rings are square. The only curves are the globe’s points and the links between them.

## Components

### Buttons

There is no filled button.

- **Hero link:** “Lihat produk”, ink, a 1px underline, minimum height 2.75rem. Hover shifts it 3px right. Pressed, it fades to opacity 0.65. Reduced motion keeps the fade and drops the shift.
- **Visit link:** On paper, carbon, same underline and shift. The domain sits under it in caption gray.
- **Focus:** 2px `currentColor` outline.

### Cards / Containers

- **Corner style:** square.
- **Background:** Paper. Row wash only when the row is a link and it is hovered or focused.
- **Border:** A hairline on top.
- **Padding:** `--space-8` vertically.
- **Coming soon:** The renderer still accepts `status: "segera"` as a row without a link. The live list does not include one.

### Navigation

Wordmark plus “Produk”, in ink on paper. Hover underlines. Pressed fades. Each link is at least 2.75rem tall. There is no contact link.

### The swapping phrase

Under “A small studio where we…”, the visible phrase is build, then deploy, then make it happen. The change is a short monochrome glitch, about 420ms: the old word jitters a few pixels and two bands of it slip sideways (one ink, one gray; each band has paper behind it so it reads as a slip, not a double), then the next phrase arrives as scrambled glyphs (`#/\<>_=+*01x`) that settle left to right. It steps every ~45ms so it reads as digital rather than eased. No color split. Three 2px marks under it show which phrase is up and fill over the 2.8s it stays. “build” is in the HTML. Reduced motion shows “build, deploy, make it happen” as one still line and does not cycle. A visually hidden sentence carries the full line.

### Globe

A canvas behind the hero. Points sit evenly on a tilted sphere (a Fibonacci spiral, offset so none sits on a pole) and are linked by its triangulation, the convex hull, so every link is about the same length and the mesh reads as a calm geodesic net, drawn in soft black. On load the points start as scattered dust and gather into the sphere over about 2.4s (wall-clock time, so dropped frames do not stretch it), then the links draw out. Among the mesh, a few wave bands (four on a wide screen, three on a phone) wrap the sphere like latitudes and turn with it: slow uneven swells with an occasional tall, narrow, rounded peak, taken from the logo's Sasirangan lines. They are seeded, so they keep one shape on every load, lighter than the links at every depth, and they draw out along their length once the sphere has closed. Links, waves, and points are sorted into eight depth layers and drawn back to front: the back of the sphere is 0.45px hairlines at about 5% opacity, the front about 0.95px at about 50%, and points grow from specks to 2px dots toward the viewer. One 0.75px hairline at about 11% marks the silhouette. A few signals run along front-facing links, a short stroke that fades toward its tail with a round head, easing in and out; the node a signal reaches swells briefly. There are no rings. The sphere leans toward a mouse pointer, drifts up as the hero scrolls away, and spins faster for a moment after a scroll. Pixel dust is small squares (1.5–2px, snapped to device pixels) on the same canvas, drifting upward, thinner over the type. The canvas is blurred by 0.3px. The sphere turns at about 0.18 rad/s. Device pixel ratio is capped at 2, and at 1.5 below 720px. The canvas size is read on resize, not every frame. The loop stops when the tab is hidden or the canvas leaves the screen. `prefers-reduced-motion` draws one still frame and does not start the loop. If the script fails, the hero type remains, including the first phrase.

### Chart band

The Chartwizard row opens with a canvas across both columns (`chart.js`), the globe’s idea told as a chart. When the row scrolls in, dust gathers into candlesticks, then a seven-candle moving average draws out from the left. Rising candles are hollow and falling candles solid, so one ink is enough. The tape then slides left and new candles enter on the right. Every few seconds a scan line sweeps across; where a candle is the low or high of the five on each side, it leaves corner brackets around five candles and a small square at the turn, then fades. At most three brackets show at once. A mouse over the row draws a dashed crosshair that snaps to a candle. The data is a seeded random walk: no prices, no axis labels, nothing that reads as a capture of the app. It pauses off-screen and when the tab is hidden; reduced motion draws one still, assembled frame.

### Specification list

Label column 5.8rem in caption gray. Values in ink, tabular numbers, hairline between rows.

### Motion

One entrance and one reveal. On load the header fades in and the hero lines rise out of their masks, staggered over about 0.8s. The product list reveals once as it scrolls in: the hairline draws from the left, then the words and spec rows follow. Links share one underline that leaves to the right and returns from the left on hover. A product row washes in from the left under the pointer. The header gains a paper backdrop with a blur and a hairline once the page scrolls. `prefers-reduced-motion` turns all of this off and shows everything in place.

### Logo and icons

The emblem is an ink circle filled with parallel, organic wave lines with now and then a sharp, rounded peak, after the Sasirangan *gigi haruan* motif of Banjar cloth. It has no nodes. `brand/emblem.svg` is the master; `brand/icon.svg` is the simplified six-line icon for 16–127px. Both are ink `#1a1a1a` on no background. The favicons (`favicon.ico`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`) are the icon on paper. `og.png` is built from `brand/og.html`: the name, the sentence and the first phrase on the left, the emblem on the right. The header keeps the text wordmark; there is no emblem in the page UI yet.

## Do's and Don'ts

### Do:

- **Do** add a product in `products.js` and mirror the article in `index.html`.
- **Do** keep the globe monochrome, slow, and out of the product list.
- **Do** keep the wave bands lighter than the mesh; the mesh is what reads first.
- **Do** keep hero type off the sphere, especially on a phone.
- **Do** leave the footer as a copyright line until a contact block is asked for.

### Don't:

- **Don't** add a colored accent, a gradient fill, or a glow on the globe.
- **Don't** put a second field color behind the product list.
- **Don't** hide the hero sentence behind the animation or behind a failed script.
- **Don't** invent products, prices, or screenshots.
- **Don't** imply this studio is CODE WIZARD INC or Code Wiz.
