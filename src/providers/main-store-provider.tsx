import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { createMainStore } from "@/stores/main-store";
import { MainStoreContext } from "@/stores/main-store-hooks";
import { parseEncodedData, syncWithUrl } from "@/stores/sync-with-url";

export interface MainStoreProviderProps {
	children: ReactNode;
	initialSave?: string;
}

export const MainStoreProvider: React.FC<MainStoreProviderProps> = ({ children, initialSave }) => {
	const { history } = useRouter();
	// oxlint-disable-next-line react/hook-use-state -- Keep one store instance for the provider's lifetime.
	const [store] = useState(() => createMainStore(parseEncodedData(initialSave)));

	useEffect(() => syncWithUrl(store, history), [store, history]);

	return <MainStoreContext value={store}>{children}</MainStoreContext>;
};
