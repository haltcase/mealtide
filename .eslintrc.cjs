const [, warn, error] = ["off", "warn", "error"];

module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:@typescript-eslint/recommended",
		"plugin:@next/next/recommended",
		"prettier"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: "latest",
		project: "./tsconfig.json",
		sourceType: "module"
	},
	plugins: ["react", "@typescript-eslint", "simple-import-sort"],
	rules: {
		"@typescript-eslint/no-unused-vars": [
			warn,
			{
				argsIgnorePattern: "^_",
				ignoreRestSiblings: true,
				varsIgnorePattern: "^_"
			}
		],
		"simple-import-sort/imports": error,
		"simple-import-sort/exports": error
	},
	settings: {
		react: {
			version: "detect"
		}
	},
	overrides: [
		{
			files: ["**/*.{js,ts}"],
			parserOptions: {
				ecmaFeatures: {
					jsx: false
				}
			}
		},
		{
			files: ["**.cjs"],
			env: {
				node: true
			},
			parserOptions: {
				sourceType: "script"
			}
		}
	]
};
