import { Outlet } from "@tanstack/react-router";

import { AppContainer } from "@/components/AppContainer";
import { Header } from "@/components/Header/Header";

import { MainStoreProvider } from "../../providers/MainStoreProvider";
import { parseEncodedData, querySaveDataKey } from "../../stores/syncWithUrl";

const AppLayout: React.FC = () => {
	const data = Route.useSearch();

	return (
		<MainStoreProvider initialState={data?.state ?? undefined}>
			<AppContainer className="pb-40">
				<Header />

				<main className="space-y-8 px-4 pb-20 pt-24 sm:pt-40">
					<Outlet />
				</main>
			</AppContainer>
		</MainStoreProvider>
	)
};

export const Route = createFileRoute({
	component: AppLayout,
	validateSearch: (search) => {
		return parseEncodedData((search[querySaveDataKey] as string) || "");
	},
});
