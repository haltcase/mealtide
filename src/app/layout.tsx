import { cn } from "@nextui-org/react";

import { firaCode, inter, lora } from "@/theme/fonts";

import Providers from "./providers";

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
			className={cn(inter.variable, lora.variable, firaCode.variable)}
		>
			<head />
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
