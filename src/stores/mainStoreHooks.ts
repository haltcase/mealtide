import { createContext, useContext } from "react";
import type { TemporalState } from "zundo";
import { useStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

import type { createMainStore, MainStore, MainStoreState } from "./mainStore";

export type MainStoreInstance = ReturnType<typeof createMainStore>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MainStoreContext = createContext<MainStoreInstance | null>(null);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const useMainStore = <TSelection extends unknown = MainStore>(
	selector: (store: MainStore) => TSelection = (state) => state as TSelection
): [store: TSelection, getState: () => MainStore] => {
	const mainStoreContext = useContext(MainStoreContext);

	if (!mainStoreContext) {
		throw new Error(`useMainStore must be used within MainStoreProvider`);
	}

	return [useStore(mainStoreContext, selector), mainStoreContext.getState];
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const useTemporalMainStore = <TSelection extends unknown>(
	selector: (state: TemporalState<MainStoreState>) => TSelection,
	equality?: (a: TSelection, b: TSelection) => boolean
): TSelection => {
	const mainStoreContext = useContext(MainStoreContext);

	if (!mainStoreContext) {
		throw new Error(
			`useTemporalMainStore must be used within MainStoreProvider`
		);
	}

	return useStoreWithEqualityFn(mainStoreContext.temporal, selector, equality);
};
