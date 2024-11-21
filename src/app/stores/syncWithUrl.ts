import { compressToURI, decompressFromURI } from "lz-ts";
import type { SuperJSONResult } from "superjson";
import { deserialize, stringify } from "superjson";
import type { PersistStorage, StorageValue } from "zustand/middleware";

import {
	migrateVersion1Store,
	type Version1Store
} from "@/models/version1/migrateVersion1Store";

import type { MainStoreState } from "./mainStore";

export const querySaveDataKey = "save";

export const parseEncodedData = (
	encodedData: string | null
): StorageValue<MainStoreState> | null => {
	if (!encodedData) {
		return null;
	}

	try {
		const data = JSON.parse(decompressFromURI(encodedData)) as
			| SuperJSONResult
			| Version1Store;

		if (!("json" in data)) {
			return { state: migrateVersion1Store(data) };
		}

		return deserialize(data);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error);
		return null;
	}
};

export const queryStorage: PersistStorage<MainStoreState> = {
	getItem: (key) => {
		const query = new URLSearchParams(window.location.search);
		const encodedData = query.get(key);
		return parseEncodedData(encodedData);
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
