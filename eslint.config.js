import { getEslintConfig } from "@haltcase/style/eslint";
import oxlint from "eslint-plugin-oxlint";

export default [
	...getEslintConfig({
		nextjs: true,
		node: true,
		typescriptProject: "tsconfig.json"
	}),

	...oxlint.configs["flat/recommended"]
];
