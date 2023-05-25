module.exports = {
	plugins: {
		tailwindcss: {},
		"tailwindcss/nesting": "postcss-nesting",
		"postcss-flexbugs-fixes": {},
		"postcss-import": {},
		"postcss-preset-env": {
			browsers: ["defaults"],
			autoprefixer: {
				flexbox: "no-2009"
			},
			stage: 2,
			features: {
				"custom-properties": true,
				"custom-selectors": true,
				"nesting-rules": true
			}
		}
	}
};
