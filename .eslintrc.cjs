"use strict";

const { resolve } = require("node:path");

const project = resolve(__dirname, "tsconfig.json");

module.exports = {
	root: true,
	extends: [
		require.resolve("@haltcase/style/eslint/node"),
		require.resolve("@haltcase/style/eslint/typescript"),
		require.resolve("@haltcase/style/eslint/next")
	],
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname
	},
	settings: {
		"import/resolver": {
			typescript: {
				project
			}
		}
	}
};
