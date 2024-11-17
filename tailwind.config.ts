import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";

import { appTheme } from "./src/theme/index.js";
import { mantineTailwindPlugin } from "./src/theme/tailwind-plugin.js";

const tailwindConfig = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	plugins: [
		animate,
		mantineTailwindPlugin(appTheme, {
			defaultColorShadeOverrides: {
				primary: 6,
				secondary: 8,
				success: 6,
				warning: 4,
				danger: 7
			}
		})
	],
	theme: {
		extend: {
			screens: {
				...defaultTheme.screens,
				"2xs": "384px", // 24em
				xs: "576px", // 36em
				sm: "768px", // 48em
				md: "992px", // 62em
				lg: "1200px", // 75em
				xl: "1408px" // 88em
			},
			fontFamily: {
				sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
				serif: ["var(--font-lora)", ...defaultTheme.fontFamily.serif],
				mono: ["var(--font-firacode)", ...defaultTheme.fontFamily.mono]
			}
		}
	}
} satisfies Config;

export default tailwindConfig;
