import { getEslintConfig } from "@haltcase/style/eslint";
import oxlint from "eslint-plugin-oxlint";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
	{
		ignores: ["src/routeTree.gen.ts"]
	},

	...getEslintConfig({
		nextjs: true,
		node: true,
		typescriptProject: "tsconfig.json"
	}),

	...oxlint.configs["flat/recommended"],

	reactRefresh.configs.vite
];
