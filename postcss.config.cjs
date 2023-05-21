module.exports = {
	plugins: {
		"postcss-flexbugs-fixes": {},
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
