import { compressToURI, decompressFromURI } from "lz-ts";
import { parse, stringify } from "superjson";
import type { PersistStorage } from "zustand/middleware";

import type { MainStoreState } from "./mainStore";

export const queryStorage: PersistStorage<MainStoreState> = {
	getItem: (key) => {
		const query = new URLSearchParams(location.hash.slice(1));
		const encodedData = query.get(key);

		if (!encodedData) {
			return null;
		}

		return parse(decompressFromURI(encodedData));
	},
	setItem: (key, newValue) => {
		const query = new URLSearchParams(location.hash.slice(1));
		query.set(key, compressToURI(stringify(newValue)));
		location.hash = query.toString();
	},
	removeItem: (key) => {
		const query = new URLSearchParams(location.hash.slice(1));
		query.delete(key);
		location.hash = stringify(Object.fromEntries(query.entries()));
	}
};
