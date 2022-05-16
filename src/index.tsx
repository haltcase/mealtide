import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import App from "./App";

window.history.scrollRestoration = "manual";

const rootElement = document.getElementById("root");

if (rootElement != null) {
	const root = createRoot(rootElement);

	root.render(
		<StrictMode>
			<App />
		</StrictMode>
	);

	serviceWorkerRegistration.register();
}
