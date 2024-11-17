// @ts-check

import type { NextConfig } from "next";

// import definePwa from "next-pwa";

// const withPwa = definePwa({
//   dest: "public",
// });

const nextConfig = {
	experimental: {
		optimizePackageImports: ["@mantine/core", "@mantine/hooks", "framer-motion"]
	},
	reactStrictMode: true
} satisfies NextConfig;

export default nextConfig;

// export default withPwa(nextConfig);
