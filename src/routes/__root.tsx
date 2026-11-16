import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Providers } from "@/providers/root-providers";

import globalStyles from "@/globals.css?url";

const RootDocument = ({ children }: { children: ReactNode }) => (
	<html lang="en" {...mantineHtmlProps}>
		<head>
			<HeadContent />
			<ColorSchemeScript />
		</head>
		<body>
			<noscript>You need to enable JavaScript to run this app.</noscript>

			<Providers>{children}</Providers>
			<Scripts />
		</body>
	</html>
);

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf8" },
			{
				name: "theme-color",
				content: "#00947e"
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "mealtide" }
		],
		links: [
			{
				rel: "manifest",
				href: "/site.webmanifest"
			},
			{
				rel: "stylesheet",
				href: globalStyles
			}
		]
	}),
	shellComponent: RootDocument
});
