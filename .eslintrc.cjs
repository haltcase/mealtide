const [, warn] = ["off", "warn", "error"];

// eslint-disable-next-line no-undef
module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:@typescript-eslint/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: "latest",
		sourceType: "module"
	},
	plugins: ["react", "@typescript-eslint"],
	rules: {
		"@typescript-eslint/no-unused-vars": [
			warn,
			{
				argsIgnorePattern: "^_",
				ignoreRestSiblings: true,
				varsIgnorePattern: "^_"
			}
		]
	}
};
