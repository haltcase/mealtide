import { createTheme } from "@mantine/core";

import { colors } from "./colors";
import { ActionIconTheme } from "./components/ActionIcon";
import { ButtonTheme } from "./components/Button";

export const appTheme = createTheme({
	colors,
	components: {
		ActionIcon: ActionIconTheme,
		Button: ButtonTheme
	},
	// TODO: ... why do I need to tag these with `!important` ...
	defaultRadius: "var(--mantine-radius-lg) !important",
	fontFamily: `var(--font-inter) !important`,
	fontFamilyMonospace: `var(--font-firacode) !important`,

	primaryColor: "primary"
});
