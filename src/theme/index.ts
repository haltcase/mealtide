import { createTheme } from "@mantine/core";

import { colors } from "./colors";

export const appTheme = createTheme({
	colors,
	primaryColor: "primary",
	defaultRadius: "lg"
});

// oxlint-disable-next-line import/no-default-export -- tailwind-preset-mantine requires a default export
export default appTheme;
