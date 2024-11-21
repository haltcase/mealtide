import { headers } from "next/headers";
import type { PropsWithChildren } from "react";

import { AppContainer } from "@/components/AppContainer";
import { Header } from "@/components/Header/Header";
import { queryHeader } from "@/middleware";

import { MainStoreProvider } from "../providers/MainStoreProvider";
import { parseEncodedData, querySaveDataKey } from "../stores/syncWithUrl";

type AppLayoutProps = PropsWithChildren;

const AppLayout: React.FC<AppLayoutProps> = async ({ children }) => {
	const requestHeaders = await headers();

	const query = requestHeaders.get(queryHeader) ?? "";
	const searchParameters = new URLSearchParams(query);
	const encodedData = searchParameters.get(querySaveDataKey);
	const data = parseEncodedData(encodedData);

	return (
		<MainStoreProvider initialState={data?.state ?? undefined}>
			<AppContainer className="pb-40">
				<Header />

				<main className="space-y-8 px-4 pb-20 pt-24 sm:pt-40">{children}</main>
			</AppContainer>
		</MainStoreProvider>
	);
};

export default AppLayout;
