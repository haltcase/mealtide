import { createFileRoute } from "@tanstack/react-router";

import { AppContainer } from "@/components/app-container";
import { Header } from "@/components/header/header";
import { MainStoreProvider } from "@/providers/main-store-provider";
import { querySaveDataKey } from "@/stores/sync-with-url";
import { OrderForm } from "@/views/order-form";

export const Route = createFileRoute("/")({
	component: Home,
	validateSearch: (search) => ({
		[querySaveDataKey]:
			typeof search[querySaveDataKey] === "string" ? search[querySaveDataKey] : undefined
	})
});

// oxlint-disable-next-line react/function-component-definition func-style
function Home(): React.JSX.Element {
	const { save } = Route.useSearch();

	return (
		<MainStoreProvider initialSave={save}>
			<AppContainer className="pb-40">
				<Header />

				<main className="space-y-8 px-4 pt-24 pb-20 sm:pt-40">
					<OrderForm />
				</main>
			</AppContainer>
		</MainStoreProvider>
	);
}
