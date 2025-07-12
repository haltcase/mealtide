import { type ReactNode, useRef } from "react";

import type { MainStoreState } from "@/stores/mainStore";
import { createMainStore } from "@/stores/mainStore";
import type { MainStoreInstance } from "@/stores/mainStoreHooks";
import { MainStoreContext } from "@/stores/mainStoreHooks";

export interface MainStoreProviderProps {
	children: ReactNode;
	initialState?: MainStoreState;
}

export const MainStoreProvider: React.FC<MainStoreProviderProps> = ({
	children,
	initialState
}) => {
	const storeRef = useRef<MainStoreInstance | null>(null);

	storeRef.current ??= createMainStore(initialState);

	return (
		<MainStoreContext value={storeRef.current}>{children}</MainStoreContext>
	);
};
