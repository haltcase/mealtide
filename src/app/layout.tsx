import "@/app/globals.css";
import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.layer.css";

import { ColorSchemeScript } from "@mantine/core";

import { Providers } from "@/app/providers/RootProviders";
import { cx } from "@/lib/cx";
import { firaCode, inter, lora } from "@/theme/fonts";

interface RootLayoutProps {
	children: React.ReactNode;
}

export const metadata = {
	title: "mealtide",
	manifest: "/manifest.json"
};

export const viewport = {
	themeColor: "#00947e",
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover"
};

const RootLayout = ({ children }: RootLayoutProps) => {
	return (
		<html
			lang="en"
			className={cx(inter.variable, lora.variable, firaCode.variable)}
		>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
