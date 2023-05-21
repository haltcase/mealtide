// @ts-check

import definePwa from "next-pwa";

const withPwa = definePwa({
	dest: "public"
});

/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		appDir: true
	}
};

export default withPwa(nextConfig);
