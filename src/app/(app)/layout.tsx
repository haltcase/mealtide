import type { PropsWithChildren } from "react";

import { AppContainer } from "@/components/AppContainer";
import { Header } from "@/components/Header/Header";

import { MainStoreProvider } from "../providers/MainStoreProvider";

type AppLayoutProps = PropsWithChildren;

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	return (
		<MainStoreProvider>
			<AppContainer className="pb-40">
				<Header />

				<main className="space-y-8 px-4 pb-20 pt-24 sm:pt-40">{children}</main>
			</AppContainer>
		</MainStoreProvider>
	);
};

export default AppLayout;
