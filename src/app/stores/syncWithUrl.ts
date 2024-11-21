import { compressToURI, decompressFromURI } from "lz-ts";
import { parse, stringify } from "superjson";
import type { PersistStorage } from "zustand/middleware";

import type { MainStoreState } from "./mainStore";

export const queryStorage: PersistStorage<MainStoreState> = {
	getItem: (key) => {
		const query = new URLSearchParams(window.location.search);
		const encodedData = query.get(key);

		if (!encodedData) {
			return null;
		}

		return parse(decompressFromURI(encodedData));
	},
	setItem: (key, newValue) => {
		const query = new URLSearchParams(window.location.search);
		query.set(key, compressToURI(stringify(newValue)));
		window.history.replaceState(null, "", `/?${query.toString()}`);
	},
	removeItem: (key) => {
		const query = new URLSearchParams(window.location.search);
		query.delete(key);
		window.history.replaceState(null, "", `/?${query.toString()}`);
	}
};
