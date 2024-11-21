"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import type { TemporalState } from "zundo";
import { useStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

import type { MainStore, MainStoreState } from "@/app/stores/mainStore";
import { createMainStore } from "@/app/stores/mainStore";

type MainStoreInstance = ReturnType<typeof createMainStore>;

export const MainStoreContext = createContext<MainStoreInstance | null>(null);

export interface MainStoreProviderProps {
	children: ReactNode;
	initialState?: MainStoreState;
}

export const MainStoreProvider: React.FC<MainStoreProviderProps> = ({
	children,
	initialState
}) => {
	const storeRef = useRef<MainStoreInstance | null>(null);

	if (!storeRef.current) {
		storeRef.current = createMainStore(initialState);
	}

	return (
		<MainStoreContext.Provider value={storeRef.current}>
			{children}
		</MainStoreContext.Provider>
	);
};

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
