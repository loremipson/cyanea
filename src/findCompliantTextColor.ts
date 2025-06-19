import { oklch, wcagContrast, clampChroma, Oklch, Color } from "culori";

interface ColorCandidate {
  color: Oklch;
  contrast: number;
  distance: number;
}

type SearchDirection = "darker" | "lighter";

export function findCompliantTextColor(
  baseColor: string | Color,
  targetContrast: number = 4.5,
  searchStrategy: "minimum" | "maximum" = "maximum",
): Oklch | null {
  const baseOklch = oklch(baseColor);

  if (!baseOklch) {
    throw new Error("Invalid base color provided");
  }

  // Automatically determine direction based on background lightness
  // For very light backgrounds (>0.7): prefer darker text
  // For very dark backgrounds (<0.3): prefer lighter text
  // For middle range (0.3-0.7): try both directions, pick the closest
  const preferDarker = baseOklch.l > 0.5;

  function oklchDistance(color1: Oklch, color2: Oklch): number {
    const dl = color1.l - color2.l;
    const dc = color1.c - color2.c;
    const dh = (color1.h || 0) - (color2.h || 0);

    const dhWrapped = Math.min(Math.abs(dh), 360 - Math.abs(dh));

    // Weigh lightness more heavily as it's most important for contrast
    return Math.sqrt(
      dl * dl * 4 +
        dc * dc +
        ((dhWrapped * Math.PI) / 180) * ((dhWrapped * Math.PI) / 180),
    );
  }

  function findOptimalLightness(
    direction: SearchDirection,
    chromaMultiplier: number = 1,
  ): ColorCandidate | null {
    let bestValidResult: ColorCandidate | null = null;
    let bestContrast = searchStrategy === "minimum" ? Infinity : 0;

    // Determine search parameters
    let start: number, end: number, step: number;
    if (direction === "darker") {
      start = baseOklch.l;
      end = 0;
      step = -0.005;
    } else {
      start = baseOklch.l;
      end = 1;
      step = 0.005;
    }

    for (let l = start; step > 0 ? l <= end : l >= end; l += step) {
      let testColor: Oklch = {
        mode: "oklch",
        l: Math.max(0, Math.min(1, l)),
        c: baseOklch.c * chromaMultiplier,
        h: baseOklch.h,
        alpha: 1,
      };

      testColor = clampChroma(testColor, "oklch") as Oklch;
      const contrast = wcagContrast(baseColor, testColor);

      if (contrast >= targetContrast) {
        // TODO: Probably not necessary to verify like this?
        const verify1 = wcagContrast(baseColor, testColor);
        const minContrast = Math.min(contrast, verify1);

        if (minContrast >= targetContrast) {
          const shouldUpdate =
            searchStrategy === "minimum"
              ? minContrast < bestContrast
              : minContrast > bestContrast;

          if (shouldUpdate) {
            bestValidResult = {
              color: testColor,
              contrast: minContrast,
              distance: oklchDistance(baseOklch, testColor),
            };
            bestContrast = minContrast;
          }

          if (searchStrategy === "minimum") {
            // For minimum search, exit early if we're very close to target
            if (minContrast <= targetContrast + 0.2) break;
          } else {
            // For maximum search on elevated text, keep going for much higher contrast
            const shouldKeepSearching =
              targetContrast >= 7.0 &&
              minContrast < Math.min(targetContrast * 1.5, 15.0);
            if (!shouldKeepSearching) break;
          }
        }
      }
    }

    return bestValidResult;
  }

  let bestOverall: ColorCandidate | null = null;
  let bestDistance = Infinity;

  const isAmbiguous = baseOklch.l >= 0.3 && baseOklch.l <= 0.7;
  const strategies: Array<{
    direction: SearchDirection;
    chromaMultiplier: number;
  }> = [];

  if (isAmbiguous) {
    strategies.push(
      { direction: "darker", chromaMultiplier: 1 },
      { direction: "lighter", chromaMultiplier: 1 },
      { direction: "darker", chromaMultiplier: 0.7 },
      { direction: "lighter", chromaMultiplier: 0.7 },
      { direction: "darker", chromaMultiplier: 0.5 },
      { direction: "lighter", chromaMultiplier: 0.5 },
      { direction: "darker", chromaMultiplier: 0.3 },
      { direction: "lighter", chromaMultiplier: 0.3 },
      { direction: "darker", chromaMultiplier: 0.1 },
      { direction: "lighter", chromaMultiplier: 0.1 },
      { direction: "darker", chromaMultiplier: 0.05 }, // Nearly grayscale
      { direction: "lighter", chromaMultiplier: 0.05 },
      { direction: "darker", chromaMultiplier: 0 }, // Pure grayscale
      { direction: "lighter", chromaMultiplier: 0 },
    );
  } else {
    // Use preferred direction for clear light/dark backgrounds
    const preferredDir = preferDarker ? "darker" : "lighter";
    const fallbackDir = preferDarker ? "lighter" : "darker";

    strategies.push(
      { direction: preferredDir, chromaMultiplier: 1 },
      { direction: preferredDir, chromaMultiplier: 0.7 },
      { direction: preferredDir, chromaMultiplier: 0.5 },
      { direction: preferredDir, chromaMultiplier: 0.3 },
      { direction: preferredDir, chromaMultiplier: 0.1 },
      { direction: preferredDir, chromaMultiplier: 0 },
      { direction: fallbackDir, chromaMultiplier: 1 },
      { direction: fallbackDir, chromaMultiplier: 0.7 },
      { direction: fallbackDir, chromaMultiplier: 0.5 },
      { direction: fallbackDir, chromaMultiplier: 0.3 },
      { direction: fallbackDir, chromaMultiplier: 0.1 },
      { direction: fallbackDir, chromaMultiplier: 0 },
    );
  }

  for (const strategy of strategies) {
    const result = findOptimalLightness(
      strategy.direction,
      strategy.chromaMultiplier,
    );

    if (result && result.distance < bestDistance) {
      bestOverall = result;
      bestDistance = result.distance;

      // Early exit if we found a very close match
      if (bestDistance < 0.05) break;
    }
  }

  return bestOverall?.color || null;
}
