import type {
	DefaultMantineColor,
	MantineColorsTuple,
	MantineThemeOverride
} from "@mantine/core";

export type CustomColors =
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";

type ExtendedCustomColors = CustomColors | DefaultMantineColor;

declare module "@mantine/core" {
	export interface MantineThemeColorsOverride {
		colors: Record<ExtendedCustomColors, MantineColorsTuple>;
	}
}

export const colors = {
	primary: [
		"#f1f9fa",
		"#ddeff0",
		"#bedfe3",
		"#91c9cf",
		"#5da9b3",
		"#43919d",
		"#397481",
		"#33606b",
		"#315059",
		"#2c444d",
		"#192c33"
	],
	secondary: [
		"#f5f5fa",
		"#ebecf3",
		"#d2d4e5",
		"#aab0cf",
		"#7d87b3",
		"#5c669b",
		"#484f81",
		"#424874",
		"#343858",
		"#2f324b",
		"#1f2032"
	],
	success: [
		"#f1fcf3",
		"#dff9e4",
		"#c1f1ca",
		"#a1e8af",
		"#59cf71",
		"#33b44d",
		"#25943c",
		"#207532",
		"#1e5d2c",
		"#1b4c26",
		"#092a12"
	],
	warning: [
		"#fffceb",
		"#fff6c6",
		"#ffeb88",
		"#ffe066",
		"#ffc820",
		"#f9a707",
		"#dd7e02",
		"#b75906",
		"#94430c",
		"#7a380d",
		"#461c02"
	],
	danger: [
		"#fdf4f3",
		"#faece9",
		"#f5d9d6",
		"#edbab4",
		"#e39089",
		"#d4655f",
		"#b43c3c",
		"#a03032",
		"#862b30",
		"#73282f",
		"#401114"
	]
} satisfies MantineThemeOverride["colors"];
