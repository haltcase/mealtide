import { cn } from "@nextui-org/theme";

import { firaCode, inter, lora } from "@/theme/fonts";

import Providers from "./providers";

interface RootLayoutProps {
	children: React.ReactNode;
}

export const metadata = {
	title: "mealtide",
	themeColor: "#00947e",
	viewport: {
		width: "device-width",
		initialScale: 1,
		viewportFit: "cover"
	},
	manifest: "/manifest.json"
};

const RootLayout = ({ children }: RootLayoutProps) => {
	return (
		<html
			lang="en"
			className={cn(inter.variable, lora.variable, firaCode.variable)}>
			<head />
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
