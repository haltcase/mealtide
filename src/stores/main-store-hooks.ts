import { createContext, use } from "react";
import type { TemporalState } from "zundo";
import { useStore } from "zustand";

import type { MainStore, MainStoreInstance } from "./main-store";

export const MainStoreContext = createContext<MainStoreInstance | null>(null);

const useMainStoreInstance = (): MainStoreInstance => {
	const store = use(MainStoreContext);

	if (!store) {
		throw new Error("Main store hooks must be used within MainStoreProvider");
	}

	return store;
};

export const useMainStore = <TSelection>(selector: (store: MainStore) => TSelection): TSelection =>
	useStore(useMainStoreInstance(), selector);

export const useTemporalMainStore = <TSelection>(
	selector: (state: TemporalState<MainStore>) => TSelection
): TSelection => useStore(useMainStoreInstance().temporal, selector);
