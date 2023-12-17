import { nextui } from "@nextui-org/theme/plugin";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";

const tailwindConfig = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	darkMode: ["class"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
				serif: ["var(--font-lora)", ...defaultTheme.fontFamily.serif],
				mono: ["var(--font-firacode)", ...defaultTheme.fontFamily.mono]
			}
		}
	},
	plugins: [
		animate,
		nextui({
			themes: {
				light: {
					colors: {
						primary: {
							"50": "#f1f9fa",
							"100": "#ddeff0",
							"200": "#bedfe3",
							"300": "#91c9cf",
							"400": "#5da9b3",
							"500": "#43919d",
							"600": "#397481",
							"700": "#33606b",
							"800": "#315059",
							"900": "#2c444d",
							// @ts-expect-error - 950 is valid tailwind
							"950": "#192c33",
							DEFAULT: "#43919d"
						},
						secondary: {
							"50": "#f5f5fa",
							"100": "#ebecf3",
							"200": "#d2d4e5",
							"300": "#aab0cf",
							"400": "#7d87b3",
							"500": "#5c669b",
							"600": "#484f81",
							"700": "#424874",
							"800": "#343858",
							"900": "#2f324b",
							// @ts-expect-error - 950 is valid tailwind
							"950": "#1f2032",
							DEFAULT: "#424874"
						},
						success: {
							"50": "#f1fcf3",
							"100": "#dff9e4",
							"200": "#c1f1ca",
							"300": "#a1e8af",
							"400": "#59cf71",
							"500": "#33b44d",
							"600": "#25943c",
							"700": "#207532",
							"800": "#1e5d2c",
							"900": "#1b4c26",
							// @ts-expect-error - 950 is valid tailwind
							"950": "#092a12",
							DEFAULT: "#33b44d"
						},
						warning: {
							"50": "#fffceb",
							"100": "#fff6c6",
							"200": "#ffeb88",
							"300": "#ffe066",
							"400": "#ffc820",
							"500": "#f9a707",
							"600": "#dd7e02",
							"700": "#b75906",
							"800": "#94430c",
							"900": "#7a380d",
							// @ts-expect-error - 950 is valid tailwind
							"950": "#461c02",
							DEFAULT: "#ffe066"
						},
						danger: {
							"50": "#fdf4f3",
							"100": "#faece9",
							"200": "#f5d9d6",
							"300": "#edbab4",
							"400": "#e39089",
							"500": "#d4655f",
							"600": "#b43c3c",
							"700": "#a03032",
							"800": "#862b30",
							"900": "#73282f",
							// @ts-expect-error - 950 is valid tailwind
							"950": "#401114",
							DEFAULT: "#b43c3c"
						}
					}
				},
				dark: {}
			}
		})
	]
} satisfies Config;

export default tailwindConfig;
