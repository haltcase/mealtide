import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import * as serviceWorkerRegistration from "./service-worker-registration";

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
