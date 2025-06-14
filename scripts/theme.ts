import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { task } from "@haltcase/run";
import type { MantineTheme, MantineThemeOverride } from "@mantine/core";
import { DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";
import { watch } from "chokidar";

const generatePrelude = (): string => `\
@layer theme, base, mantine, components, utilities, inline;

@import "tailwindcss";
@import "@mantine/core/styles.layer.css";\
`;

const generateBreakpoints = (theme: MantineTheme): string => {
  const mantineBreakpoints = Object.entries(theme.breakpoints)
    .map(
      ([breakpointName, breakpointValue]) =>
        `  --breakpoint-${breakpointName}: ${breakpointValue};`
    )
    .join("\n");

  return `
	/* Extended breakpoints for smaller displays */
	--breakpoint-3xs: 12em; /* 192px */
	--breakpoint-2xs: 24em; /* 384px */

${mantineBreakpoints}

	/* Extended breakpoints for larger displays */
	--breakpoint-2xl: 100em; /* 1600px */
	--breakpoint-3xl: 112em; /* 1792px */
	--breakpoint-4xl: 124em; /* 1984px */
	--breakpoint-5xl: 136em; /* 2176px */
	--breakpoint-6xl: 148em; /* 2368px */
	--breakpoint-7xl: 160em; /* 2560px */\
`;
};

const generateColors = (theme: MantineTheme): string => {
  // Default shade; can be overridden for each color in the user's CSS file
  const defaultShadeIndex = 5;

  return Object.entries(theme.colors)
    .flatMap(([colorName, colorValues], colorIndex) => [
      // Unsuffixed CSS variable for default shade
      `${colorIndex > 0 ? "\n" : ""}  --color-${colorName}: var(--mantine-color-${colorName}-${defaultShadeIndex});`,

      // CSS variables for all shades
      ...colorValues.map((_colorValue, shadeIndex) => {
        const tailwindShade =
          shadeIndex === 0 ? "50" : String(shadeIndex * 100);

        return `  --color-${colorName}-${tailwindShade}: var(--mantine-color-${colorName}-${shadeIndex});`;
      }),
    ])
    .join("\n");
};

const generateFontSizes = (theme: MantineTheme): string => {
  const themeFontSizes = Object.entries(theme.fontSizes)
    .map(
      ([fontSizeName, _fontSizeValue]) =>
        `  --text-${fontSizeName}: var(--mantine-font-size-${fontSizeName});`
    )
    .join("\n");

  const themeHeadingFontSizes = Object.entries(theme.headings.sizes)
    .map(
      ([headingSizeName, _headingSizeValue]) =>
        `  --heading-${headingSizeName}: var(--mantine-${headingSizeName}-font-size);`
    )
    .join("\n");

  return `
	--text-base: var(--mantine-font-size-md);
${themeFontSizes}
${themeHeadingFontSizes}\
`;
};

const generateResolutionUtilities = () => {
  return `\
/* Resolution utilities for high DPI displays */
@custom-variant dpr-1 (@media (min-resolution: 1dppx));
@custom-variant dpr-2 (@media (min-resolution: 2dppx));
@custom-variant dpr-3 (@media (min-resolution: 3dppx));
@custom-variant dpr-4 (@media (min-resolution: 4dppx));
@custom-variant max-dpr-1 (@media (max-resolution: 1dppx));
@custom-variant max-dpr-2 (@media (max-resolution: 2dppx));
@custom-variant max-dpr-3 (@media (max-resolution: 3dppx));
@custom-variant max-dpr-4 (@media (max-resolution: 4dppx));\
`;
};

const restoreTailwindDefaultSizeUtilities = () => {
  const sizes = {
    "3xs": "16rem",
    "2xs": "18rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
  } as const;

  const sizeKeys = Object.keys(sizes) as (keyof typeof sizes)[];

  return `
	/* Restore default Tailwind CSS sizing utilities */

	/* See: https://github.com/tailwindlabs/tailwindcss/issues/16047 */

${Object.entries(sizes)
  .map(([size, sizeValue]) => `  --size-${size}: ${sizeValue};`)
  .join("\n")}

${sizeKeys.map((size) => `  --container-${size}: var(--size-${size});`).join("\n")}
${sizeKeys.map((size) => `  --width-${size}: var(--size-${size});`).join("\n")}
${sizeKeys.map((size) => `  --min-width-${size}: var(--size-${size});`).join("\n")}
${sizeKeys.map((size) => `  --max-width-${size}: var(--size-${size});`).join("\n")}
${sizeKeys.map((size) => `  --height-${size}: var(--size-${size});`).join("\n")}
${sizeKeys.map((size) => `  --min-height-${size}: var(--size-${size});`).join("\n")}
${sizeKeys.map((size) => `  --max-height-${size}: var(--size-${size});`).join("\n")}\
`;
};

interface ThemeGeneratorOptions {
  includeDefaultColors?: boolean;
  excludePrelude?: boolean;
}

const generateCssContents = (
  baseTheme: MantineThemeOverride = DEFAULT_THEME,
  options: ThemeGeneratorOptions = {}
) => {
  const theme = mergeMantineTheme(DEFAULT_THEME, baseTheme);

  const prelude = options.excludePrelude ? "" : generatePrelude();
  const breakpoints = generateBreakpoints(theme);
  const colors = generateColors(theme);
  const fontSizes = generateFontSizes(theme);
  const resolutionUtilities = generateResolutionUtilities();
  const defaultSizeUtilities = restoreTailwindDefaultSizeUtilities();

  return `\
/* stylelint-disable -- automatically generated content */
/* This file is automatically generated. Do not edit it manually. */

${prelude}

/* Mantine dark theme variant */
@custom-variant dark (&:where([data-mantine-color-scheme="dark"], [data-mantine-color-scheme="dark"] *));

${resolutionUtilities}

/*
 * Marking this theme block as static makes these variables always included
 * in the final CSS, even if they are not used in source files. Use it
 * sparingly, as it can increase the size of the final CSS.
 */
@theme static {
	/* Breakpoints */
${breakpoints}
}

@theme {
	/* Fonts */
  --font-sans: var(--mantine-font-family);
  --font-mono: var(--mantine-font-family-monospace);
  --font-headings: var(--mantine-font-family-headings);

	/* Spacing */
  --spacing-xs: var(--mantine-spacing-xs);
  --spacing-sm: var(--mantine-spacing-sm);
  --spacing-md: var(--mantine-spacing-md);
  --spacing-lg: var(--mantine-spacing-lg);
  --spacing-xl: var(--mantine-spacing-xl);

	/* Colors */
${colors}

  --color-white: var(--mantine-color-white);
  --color-black: var(--mantine-color-black);
  --color-body: var(--mantine-color-text);
  --color-error: var(--mantine-color-error);
  --color-placeholder: var(--mantine-color-placeholder);
  --color-anchor: var(--mantine-color-anchor);
  --color-default: var(--mantine-color-default-color);

	/* Font sizes */
${fontSizes}

  /* Line heights */
  --text-xs--line-height: var(--mantine-line-height-xs);
  --text-sm--line-height: var(--mantine-line-height-sm);
  --text-md--line-height: var(--mantine-line-height-md);
  --text-lg--line-height: var(--mantine-line-height-lg);
  --text-xl--line-height: var(--mantine-line-height-xl);
  --text-h1--line-height: var(--mantine-h1-line-height);
  --text-h2--line-height: var(--mantine-h2-line-height);
  --text-h3--line-height: var(--mantine-h3-line-height);
  --text-h4--line-height: var(--mantine-h4-line-height);
  --text-h5--line-height: var(--mantine-h5-line-height);
  --text-h6--line-height: var(--mantine-h6-line-height);
  --text-base--line-height: var(--mantine-line-height-md);
  --text-heading--line-height: var(--mantine-heading-line-height);
  --text-base--line-height: var(--mantine-line-height);

  /* Font weights */
  --font-weight-h1: var(--mantine-h1-font-weight);
  --font-weight-h2: var(--mantine-h2-font-weight);
  --font-weight-h3: var(--mantine-h3-font-weight);
  --font-weight-h4: var(--mantine-h4-font-weight);
  --font-weight-h5: var(--mantine-h5-font-weight);
  --font-weight-h6: var(--mantine-h6-font-weight);

	/* Border radii */
  --radius-xs: var(--mantine-radius-xs);
  --radius-sm: var(--mantine-radius-sm);
  --radius-md: var(--mantine-radius-md);
  --radius-lg: var(--mantine-radius-lg);
  --radius-xl: var(--mantine-radius-xl);
  --radius: var(--mantine-radius-default);

  /* Shadows */
  --shadow-xs: var(--mantine-shadow-xs);
  --shadow-sm: var(--mantine-shadow-sm);
  --shadow-md: var(--mantine-shadow-md);
  --shadow-lg: var(--mantine-shadow-lg);
  --shadow-xl: var(--mantine-shadow-xl);
  --shadow: var(--mantine-shadow-xs);

  /* z-index */
  --z-index-app: var(--mantine-z-index-app);
  --z-index-modal: var(--mantine-z-index-modal);
  --z-index-popover: var(--mantine-z-index-popover);
  --z-index-overlay: var(--mantine-z-index-overlay);
  --z-index-max: var(--mantine-z-index-max);

${defaultSizeUtilities}
}
`;
};

export const generate = task.strict(
  {
    outputPath: "string?",
    watch: "boolean?",
    excludePrelude: "boolean?",
  },
  async (input) => {
    const outputPath = input.outputPath
      ? String(input.outputPath)
      : "./src/theme.css";
    const outputDirectory = dirname(outputPath);

    const run = async () => {
      const { appTheme } = await import("../src/theme/index.js");
      const generatedCss = generateCssContents(appTheme, {
        excludePrelude: input.excludePrelude,
      });

      await mkdir(outputDirectory, { recursive: true });

      await writeFile(outputPath, generatedCss, {
        encoding: "utf8",
        flag: "w",
      });

      console.log(`Generated theme CSS written to ${outputPath}`);
    };

    const watchPath = resolve(import.meta.dirname, "../src/theme");

    await run();

    if (input.watch) {
      const watcher = watch(watchPath, {
        ignoreInitial: true,
        persistent: true,
      });

      watcher.on("all", run);
    }
  }
);
