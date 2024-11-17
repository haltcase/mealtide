// based on:
// https://github.com/Sajarin-M/tailwind-plugin-mantine

import type { MantineColorsTuple, MantineThemeOverride } from "@mantine/core";
import {
	DEFAULT_THEME as defaultMantineTheme,
	mergeMantineTheme
} from "@mantine/core";
import defaultTailwindColors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

const filledVariants = ["filled", "filled-hover"];
const lightVariants = ["light", "light-hover", "light-color"];
const outlineVariants = ["outline", "outline-hover"];
const otherColors = [
	"text",
	"body",
	"error",
	"placeholder",
	"dimmed",
	"bright",
	"anchor",
	"default",
	"default-hover",
	"default-color",
	"default-border"
];

/** Convert a hex color to an RGB one suitable for a Tailwind theme */
const hexToRgb = (hex: string) => {
	const bareHex = hex.replace("#", "");

	const red = Number.parseInt(bareHex.slice(0, 2), 16);
	const green = Number.parseInt(bareHex.slice(2, 4), 16);
	const blue = Number.parseInt(bareHex.slice(4, 6), 16);

	return `${red} ${green} ${blue}`;
};

const makeVariantColors = (colorName: string): Record<string, string> => {
	const concatenatedVariants = [
		...filledVariants,
		...lightVariants,
		...(colorName === "primary" ? [] : outlineVariants)
	];

	return Object.fromEntries(
		concatenatedVariants.map((variant) => {
			const value =
				colorName === "primary"
					? `var(--mantine-primary-color-${variant})`
					: `var(--mantine-color-${colorName}-${variant})`;

			return [variant, value];
		})
	);
};

const getPrimaryColorShades = (
	theme: MantineThemeOverride
): Record<string, string> => {
	const { primaryColor } = theme;

	return {
		...Object.fromEntries(
			Array.from({ length: 10 }).map((_, index) => [
				Math.max(index * 100, 50),
				`var(--mantine-color-${primaryColor}-${index})`
			])
		),
		DEFAULT: `var(--mantine-primary-color-filled)`,
		...makeVariantColors("primary")
	};
};

type ColorShades = {
	DEFAULT: string;
	variants: ReturnType<typeof makeVariantColors>;
} & Record<string, unknown>;

const getColorShades = (
	colorName: string,
	colorsTuple: MantineColorsTuple,
	defaultShade = 5
): ColorShades => {
	return {
		...Object.fromEntries(
			colorsTuple.map((hexValue, index) => [
				Math.max(index * 100, 50),
				`rgb(${hexToRgb(hexValue)} / <alpha-value>)`
			])
		),
		DEFAULT: `rgb(${hexToRgb(colorsTuple[defaultShade])} / <alpha-value>)`,

		variants: makeVariantColors(colorName)
	};
};

export interface MantineTailwindPluginOptions<
	TTheme extends MantineThemeOverride
> {
	/** If Mantine and Tailwind both define a color, prefer Tailwind's. */
	preferTailwindColors?: boolean;
	defaultColorShadeOverrides?: Partial<
		Record<
			keyof NonNullable<TTheme["colors"]>,
			// eslint-disable-next-line @typescript-eslint/ban-types
			(0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) | (number & {})
		>
	>;
}

export const mantineTailwindPlugin = <TTheme extends MantineThemeOverride>(
	theme: TTheme,
	options: MantineTailwindPluginOptions<TTheme> = {}
): ReturnType<typeof plugin> => {
	const resolvedTheme = mergeMantineTheme(defaultMantineTheme, theme);

	const colors = {
		primary: getPrimaryColorShades(theme),

		...Object.fromEntries(
			Object.entries(resolvedTheme.colors)
				.filter(([colorName]) => {
					if (options.preferTailwindColors) {
						return !(colorName in defaultTailwindColors);
					}

					return true;
				})
				.map(([colorName, colorTuple]) => {
					const shades = getColorShades(
						colorName,
						colorTuple,
						options.defaultColorShadeOverrides?.[colorName]
					);

					return [colorName, shades];
				})
		),

		...Object.fromEntries(
			otherColors.map((otherColor) => [
				otherColor,
				`var(--mantine-color-${otherColor})`
			])
		)
	};

	return plugin(
		() => {
			/** nothing */
		},
		{
			darkMode: ["class", `[data-mantine-color-scheme="dark"]`],
			theme: {
				extend: {
					colors,
					fontSize: resolvedTheme.fontSizes,
					lineHeight: resolvedTheme.lineHeights,
					boxShadow: {
						...resolvedTheme.shadows,
						DEFAULT: resolvedTheme.shadows.xs
					},
					borderRadius: {
						...resolvedTheme.radius,
						DEFAULT: "var(--mantine-radius-default)"
					},
					spacing: resolvedTheme.spacing,
					zIndex: {
						app: "var(--mantine-z-index-app)",
						modal: "var(--mantine-z-index-modal)",
						popover: "var(--mantine-z-index-popover)",
						overlay: "var(--mantine-z-index-overlay)",
						max: "var(--mantine-z-index-max)"
					}
				}
			}
		}
	);
};
