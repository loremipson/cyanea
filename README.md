# :octopus: cyanea

> ⚠️ **Alpha Release**: Version 3.x of this library is in active development. Breaking changes are expected. Do not use in production.

Named after the Cyanea Octopus for its remarkable color-changing abilities, cyanea is a systematic color palette generator that creates perceptually uniform design tokens from any input color.

Inspired by [Radix Colors](https://www.radix-ui.com/colors), cyanea generates comprehensive color systems with automatic light/dark mode support and works out-of-the-box with `prefers-color-scheme` to eliminate annoying initial mode flickering.

## Installation

```shell
npm install cyanea
```

## Quick Start

### Option 1: Use Pre-generated CSS (Recommended)

Import ready-to-use CSS custom properties, just like Radix Colors:

```css
@import "cyanea/css/indigo.css";
@import "cyanea/css/indigo-dark.css";
@import "cyanea/css/slate.css";
@import "cyanea/css/slate-dark.css";

.button {
  background: var(--indigo-5-base);
  color: var(--slate-6-base);
}

.button:hover {
  background: var(--violet-5-vivid);
}
```

Automatic light/dark mode support with `prefers-color-scheme`:

```css
/* Automatically switches between light/dark modes */
.card {
  background: var(--slate-1-base);
  border: 1px solid var(--slate-4-muted);
  color: var(--slate-6-base);
}
```

### Option 2: Generate Colors Programmatically

```js
import { cyanea } from "cyanea";

const colors = cyanea("#6E56CF");
console.log(colors.violet.light[5].base); // "oklch(0.52 0.8 300)"
```

## What You Get

From a single input color, cyanea generates:

- **20 semantic hues**: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, pink, ruby, plus neutrals (slate, mauve, sand, olive)
- **6 systematic tiers** per hue (1-6, from lightest to darkest)
- **4 semantic variants** per tier: `base`, `muted`, `elevated`, `vivid`
- **Automatic light/dark modes** that work with `prefers-color-scheme`
- **OKLCH color space** for perceptually uniform scaling

## Color System Structure

```js
const colors = cyanea("#6E56CF");

// Access any color with: colors[hue][mode][tier][variant]
colors.violet.light[1].base; // Very light violet
colors.violet.light[5].vivid; // Vibrant accent violet
colors.violet.dark[6].muted; // Dark mode text violet

colors.slate.light[2].elevated; // Light mode section
colors.slate.dark[3].base; // Dark mode component
```

### Systematic Tiers

Each tier serves a specific purpose in your design system:

- Tier 1: Surface backgrounds (cards, tooltips, overlays, flyout menus)
- Tier 2: App/section backgrounds (main content areas, sidebars)
- Tier 3: Component backgrounds (buttons, inputs, interactive elements)
- Tier 4: Borders (dividers, component outlines, focus rings)
- Tier 5: Wild card (contains your original input color - useful for accents, highlights, and primary actions like Radix's tier 9)
- Tier 6: Text (readable text colors, icons)

## Differences from Radix Colors

While inspired by Radix's systematic approach, cyanea adds:

- **More variants per tier**: 4 semantic options instead of single colors
- **Less tiers**: 6 tiers instead of 12. The idea is to utilize variants more effectively
- **No flicker**: Works seamlessly with `prefers-color-scheme` media queries
- **Systematic generation**: Create entire color systems from any starting color
- **OKLCH-first**: Perceptually uniform scaling across all hues

## Browser Support

Requires modern browsers with OKLCH support:

- Chrome 111+ (March 2023)
- Firefox 113+ (May 2023)
- Safari 16.4+ (March 2023)

## Development Status

This library is in **alpha**. Colors are currently being test and will likely need tweaking, additional tiers, etc. The API will change frequently as we refine the color generation algorithms and DX. Feedback and contributions welcome!
