import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import * as serviceWorkerRegistration from "./service-worker-registration";

import App from "./App";

window.history.scrollRestoration = "manual";

const rootElement = document.getElementById("root");

if (rootElement != null) {
	const root = createRoot(rootElement);

	root.render(
		<StrictMode>
			<ChakraProvider>
				<App />
			</ChakraProvider>
		</StrictMode>
	);

	serviceWorkerRegistration.register();
}
