import { createOxfmtConfig } from "@haltcase/style/oxfmt";
import { createOxlintConfig } from "@haltcase/style/oxlint";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import mantineTheme from "tailwind-preset-mantine/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
	staged: {
		"*": "vp check --fix"
	},
	fmt: createOxfmtConfig(),
	lint: createOxlintConfig({
		ignorePatterns: ["src/routeTree.gen.ts"],
		node: true,
		tanstackStart: true,
		rules: {
			"eslint/func-style": [
				"error",
				"expression",
				{
					allowArrowFunctions: true
				}
			],
			"eslint/no-use-before-define": [
				"error",
				{
					functions: false
				}
			],
			"react/function-component-definition": [
				"error",
				{
					namedComponents: "arrow-function",
					unnamedComponents: "arrow-function"
				}
			]
		}
	}),
	server: {
		port: 3000
	},
	resolve: {
		tsconfigPaths: true
	},
	plugins: lazyPlugins(() => [
		tailwindcss(),
		tanstackStart(),
		nitro({ publicAssets: [{ dir: "src/public" }] }),
		react(),
		mantineTheme({
			input: "./src/theme/index.ts",
			output: "./src/theme.css"
		})
	])
});
