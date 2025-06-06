import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { cyanea } from "../dist/index.mjs";

const colorSystem = cyanea();

const cssDir = join(process.cwd(), "css");
mkdirSync(cssDir, { recursive: true });

const allHues = Object.keys(colorSystem);

function generateLightCSS(hueName, colors) {
  const prefix = hueName;
  let css = `:root {\n`;

  Object.entries(colors).forEach(([tier, variants]) => {
    Object.entries(variants).forEach(([variant, value]) => {
      const varName =
        variant === "base"
          ? `--${prefix}-${tier}`
          : `--${prefix}-${tier}-${variant}`;
      css += `  ${varName}: ${value};\n`;
    });
  });

  css += "}\n";
  return css;
}

function generateDarkCSS(hueName, colors) {
  const prefix = hueName;

  let css = "";
  let variables = "";
  Object.entries(colors).forEach(([tier, variants]) => {
    Object.entries(variants).forEach(([variant, value]) => {
      const varName =
        variant === "base"
          ? `--${prefix}-${tier}`
          : `--${prefix}-${tier}-${variant}`;
      variables += `    ${varName}: ${value};\n`;
    });
  });

  // Media query for system preference (with exclusions for explicit light themes)
  css += `@media (prefers-color-scheme: dark) {\n`;
  css += `  :root {\n`;
  css += `    &:not(.light, .light-theme):not(:has(> body.light, > body.light-theme)) {\n`;
  css += variables;
  css += `    }\n`;
  css += `  }\n`;
  css += `}\n\n`;

  // Explicit dark theme classes
  css += `:root {\n`;
  css += `  &.dark,\n`;
  css += `  &.dark-theme,\n`;
  css += `  &:has(> body.dark, > body.dark-theme) {\n`;
  css += variables;
  css += `  }\n`;
  css += `}\n`;

  return css;
}

Object.entries(colorSystem).forEach(([hueName, modes]) => {
  // Light mode file (default)
  const lightCSS = generateLightCSS(hueName, modes.light);
  writeFileSync(join(cssDir, `${hueName}.css`), lightCSS);

  // Dark mode file (with your specific selectors)
  const darkCSS = generateDarkCSS(hueName, modes.dark);
  writeFileSync(join(cssDir, `${hueName}-dark.css`), darkCSS);
});

console.log(`✅ Generated CSS files for ${allHues.length} color scales`);
console.log(`📁 CSS files written to: ${cssDir}`);
console.log(`🎨 Available colors: ${allHues.join(", ")}`);
