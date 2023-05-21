"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, cookieStorageManager } from "@chakra-ui/react";

import theme from "@/theme";

const Providers = ({ children }: { children: React.ReactNode }) => (
	<CacheProvider>
		<ChakraProvider colorModeManager={cookieStorageManager} theme={theme}>
			{children}
		</ChakraProvider>
	</CacheProvider>
);

export default Providers;
