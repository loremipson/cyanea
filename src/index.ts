import { useMode, modeOklch } from "culori";
import "culori/css";

const oklch = useMode(modeOklch);
const toOklch = (color: string) => oklch(color);

export type ColorVariant = "base" | "muted" | "elevated" | "vivid";
export type ColorTier = 1 | 2 | 3 | 4 | 5 | 6;
export type ColorMode = "light" | "dark";

interface OklchValues {
  l: number;
  c: number;
  h: number;
}

export interface ColorSystem {
  [hueName: string]: {
    light: Record<ColorTier, Record<ColorVariant, string>>;
    dark: Record<ColorTier, Record<ColorVariant, string>>;
  };
}

const DEFAULT_COLOR = "#6E56CF";

function getSemanticName(hue: number): string {
  if (hue >= 348.75 || hue < 11.25) return "ruby";
  if (hue >= 11.25 && hue < 33.75) return "red";
  if (hue >= 33.75 && hue < 56.25) return "orange";
  if (hue >= 56.25 && hue < 78.75) return "amber";
  if (hue >= 78.75 && hue < 101.25) return "yellow";
  if (hue >= 101.25 && hue < 123.75) return "lime";
  if (hue >= 123.75 && hue < 146.25) return "green";
  if (hue >= 146.25 && hue < 168.75) return "emerald";
  if (hue >= 168.75 && hue < 191.25) return "teal";
  if (hue >= 191.25 && hue < 213.75) return "cyan";
  if (hue >= 213.75 && hue < 236.25) return "sky";
  if (hue >= 236.25 && hue < 258.75) return "blue";
  if (hue >= 258.75 && hue < 281.25) return "indigo";
  if (hue >= 281.25 && hue < 303.75) return "violet";
  if (hue >= 303.75 && hue < 326.25) return "purple";
  if (hue >= 326.25 && hue < 348.75) return "pink";

  return "red";
}

function generateHues(inputColor: string): Record<string, OklchValues> {
  const result = toOklch(inputColor);
  if (!result) throw new Error("Invalid input color");

  const { l, c, h } = result;
  const inputHue = h || 0;

  const systematicHues: OklchValues[] = [];

  for (let i = 0; i < 16; i++) {
    const hueAngle = (inputHue + i * 22.5) % 360;
    systematicHues.push({
      l,
      c,
      h: hueAngle,
    });
  }

  const namedHues: Record<string, OklchValues> = {};

  systematicHues.forEach((color) => {
    const name = getSemanticName(color.h);
    namedHues[name] = color;
  });

  namedHues["slate"] = { l, c: 0.008, h: 240 };
  namedHues["mauve"] = { l, c: 0.006, h: 300 };
  namedHues["sand"] = { l, c: 0.008, h: 50 };
  namedHues["olive"] = { l, c: 0.007, h: 110 };

  return namedHues;
}

function generateLightModeTiers(
  hue: OklchValues,
): Record<ColorTier, OklchValues> {
  const { c, h } = hue;

  return {
    1: { l: 0.99, c: c * 0.05, h },
    2: { l: 0.97, c: c * 0.1, h },
    3: { l: 0.94, c: c * 0.15, h },
    4: { l: 0.87, c: c * 0.25, h },
    5: { l: 0.52, c: c * 0.8, h },
    6: { l: 0.35, c: c * 0.15, h },
  };
}

function generateDarkModeTiers(
  hue: OklchValues,
): Record<ColorTier, OklchValues> {
  const { c, h } = hue;

  return {
    1: { l: 0.11, c: c * 0.08, h },
    2: { l: 0.14, c: c * 0.12, h },
    3: { l: 0.18, c: c * 0.18, h },
    4: { l: 0.28, c: c * 0.35, h },
    5: { l: 0.52, c: c * 0.8, h },
    6: { l: 0.75, c: c * 0.1, h },
  };
}

function generateLightVariants(
  baseColor: OklchValues,
  tier: ColorTier,
): Record<ColorVariant, string> {
  const { l, c, h } = baseColor;

  if (tier === 6) {
    return {
      base: `oklch(${l} ${c} ${h})`,
      muted: `oklch(${Math.min(l + 0.25, 0.6)} ${c * 0.9} ${h})`,
      elevated: `oklch(${Math.max(l - 0.12, 0.15)} ${c * 1.1} ${h})`,
      vivid: `oklch(${Math.max(l - 0.05, 0.15)} ${Math.min(c + 0.05, 0.2)} ${h})`,
    };
  }

  if (tier <= 3) {
    return {
      base: `oklch(${l} ${c} ${h})`,
      muted: `oklch(${Math.max(l - 0.005, 0.9)} ${Math.max(c - 0.001, 0)} ${h})`,
      elevated: `oklch(${Math.min(l + 0.01, 0.99)} ${Math.min(c + 0.002, 0.4)} ${h})`,
      vivid: `oklch(${l} ${Math.min(c + 0.005, 0.4)} ${h})`,
    };
  }

  return {
    base: `oklch(${l} ${c} ${h})`,
    muted: `oklch(${Math.max(l - 0.02, 0.2)} ${Math.max(c - 0.02, 0)} ${h})`,
    elevated: `oklch(${Math.min(l + 0.03, 0.95)} ${Math.min(c + 0.03, 0.4)} ${h})`,
    vivid: `oklch(${l} ${Math.min(c + 0.06, 0.4)} ${h})`,
  };
}

function generateDarkVariants(
  baseColor: OklchValues,
  tier: ColorTier,
): Record<ColorVariant, string> {
  const { l, c, h } = baseColor;

  if (tier === 6) {
    return {
      base: `oklch(${l} ${c} ${h})`,
      muted: `oklch(${Math.max(l - 0.15, 0.5)} ${c * 0.9} ${h})`,
      elevated: `oklch(${Math.min(l + 0.08, 0.95)} ${c * 1.1} ${h})`,
      vivid: `oklch(${Math.min(l + 0.05, 0.9)} ${Math.min(c + 0.02, 0.15)} ${h})`,
    };
  }

  if (tier <= 3) {
    return {
      base: `oklch(${l} ${c} ${h})`,
      muted: `oklch(${Math.max(l - 0.01, 0.08)} ${Math.max(c - 0.002, 0)} ${h})`,
      elevated: `oklch(${Math.min(l + 0.02, 0.25)} ${Math.min(c + 0.005, 0.4)} ${h})`,
      vivid: `oklch(${Math.min(l + 0.005, 0.22)} ${Math.min(c + 0.01, 0.4)} ${h})`,
    };
  }

  return {
    base: `oklch(${l} ${c} ${h})`,
    muted: `oklch(${Math.max(l - 0.03, 0.15)} ${Math.max(c - 0.03, 0)} ${h})`,
    elevated: `oklch(${Math.min(l + 0.05, 0.7)} ${Math.min(c + 0.05, 0.4)} ${h})`,
    vivid: `oklch(${Math.min(l + 0.02, 0.6)} ${Math.min(c + 0.08, 0.4)} ${h})`,
  };
}

function isValidColorTier(tier: string): tier is `${ColorTier}` {
  return ["1", "2", "3", "4", "5", "6"].includes(tier);
}

function generateColorSystem(inputColor: string): ColorSystem {
  const oklchColor = toOklch(inputColor);
  if (!oklchColor) throw new Error("Invalid input color");

  const hues = generateHues(inputColor);
  const colorSystem: ColorSystem = {};

  Object.entries(hues).forEach(([hueName, hue]) => {
    const lightTiers = generateLightModeTiers(hue);
    const darkTiers = generateDarkModeTiers(hue);

    colorSystem[hueName] = {
      light: {} as Record<ColorTier, Record<ColorVariant, string>>,
      dark: {} as Record<ColorTier, Record<ColorVariant, string>>,
    };

    Object.entries(lightTiers).forEach(([tierString, color]) => {
      if (isValidColorTier(tierString)) {
        const tier = Number(tierString) as ColorTier;
        colorSystem[hueName].light[tier] = generateLightVariants(color, tier);
      }
    });

    Object.entries(darkTiers).forEach(([tierString, color]) => {
      if (isValidColorTier(tierString)) {
        const tier = Number(tierString) as ColorTier;
        colorSystem[hueName].dark[tier] = generateDarkVariants(color, tier);
      }
    });
  });

  return colorSystem;
}

export function cyanea(inputColor?: string): ColorSystem {
  const color = inputColor || DEFAULT_COLOR;
  return generateColorSystem(color);
}

export default cyanea;
