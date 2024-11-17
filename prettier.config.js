import config from "@haltcase/style/prettier";

export default {
	...config,
	plugins: [...config.plugins, "prettier-plugin-tailwindcss"]
};
