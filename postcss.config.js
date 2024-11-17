export default {
	plugins: {
		"postcss-import": {},
		"postcss-flexbugs-fixes": {},
		"tailwindcss/nesting": "postcss-nesting",
		tailwindcss: {},
		"postcss-preset-mantine": {},
		"postcss-preset-env": {
			browsers: ["defaults"],
			autoprefixer: {
				flexbox: "no-2009"
			},
			stage: 2,
			features: {
				"custom-properties": true,
				"custom-selectors": true,
				// let tailwind handle nesting
				"nesting-rules": false
			}
		}
	}
};
