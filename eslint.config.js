import { getEslintConfig } from "@haltcase/style/eslint";

export default [
	...getEslintConfig({
		nextjs: true,
		node: true,
		typescriptProject: "tsconfig.json"
	})
];
