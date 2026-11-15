import type { RouterHistory } from "@tanstack/react-router";
import lzString from "lz-string";
import type { SuperJSONResult } from "superjson";
import { deserialize, stringify } from "superjson";

import type { Item } from "@/models/item";
import { migrateVersion1Store } from "@/models/version1/migrate-version-1-store";
import type { Version1Store } from "@/models/version1/migrate-version-1-store";

import type { MainStoreInstance, MainStoreState } from "./main-store";
import { defaultInitialState } from "./main-store";

export const querySaveDataKey = "save";

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const isItemMap = (value: unknown, type: Item["type"]): boolean =>
	value instanceof Map &&
	[...value.entries()].every(
		([key, item]: [unknown, unknown]) =>
			typeof key === "string" &&
			isRecord(item) &&
			item.type === type &&
			typeof item.name === "string" &&
			typeof item.description === "string" &&
			(typeof item.amount === "string" ||
				(typeof item.amount === "number" && Number.isFinite(item.amount)) ||
				item.amount === undefined) &&
			(item.notes === undefined || typeof item.notes === "string") &&
			(type === "LineItem" ? isItemMap(item.subitems, "Addon") : item.subitems === undefined)
	);

const isMainStoreState = (value: unknown): value is MainStoreState =>
	isRecord(value) &&
	value.version === 2 &&
	typeof value.orderTitle === "string" &&
	(value.venmoUsername === undefined || typeof value.venmoUsername === "string") &&
	typeof value.taxAmount === "number" &&
	Number.isFinite(value.taxAmount) &&
	isItemMap(value.fees, "Fee") &&
	isItemMap(value.lineItems, "LineItem");

const getSaveState = ({
	version,
	orderTitle,
	venmoUsername,
	taxAmount,
	fees,
	lineItems
}: MainStoreState): MainStoreState => ({
	version,
	orderTitle,
	venmoUsername,
	taxAmount,
	fees,
	lineItems
});

export const parseEncodedData = (encodedData?: string | null): MainStoreState | undefined => {
	if (!encodedData) {
		return undefined;
	}

	try {
		const data = JSON.parse(
			// oxlint-disable-next-line import-x/no-named-as-default-member
			lzString.decompressFromEncodedURIComponent(encodedData)
		) as SuperJSONResult | Version1Store;

		const state: unknown =
			"json" in data ? deserialize<{ state?: unknown }>(data)?.state : migrateVersion1Store(data);

		return isMainStoreState(state) ? getSaveState(state) : undefined;
	} catch {
		return undefined;
	}
};

export const encodeSave = (state: MainStoreState): string =>
	// Keep the original Zustand persistence envelope for shared links.
	// oxlint-disable-next-line import-x/no-named-as-default-member
	lzString.compressToEncodedURIComponent(stringify({ state: getSaveState(state), version: 0 }));

export const syncWithUrl = (store: MainStoreInstance, history: RouterHistory): (() => void) => {
	let currentSave = new URLSearchParams(history.location.search).get(querySaveDataKey);
	let applyingHistory = false;
	const temporal = store.temporal.getState();

	const unsubscribeStore = store.subscribe((state) => {
		if (applyingHistory) {
			return;
		}

		const save = encodeSave(state);

		if (save === currentSave) {
			return;
		}

		const { pathname, search, hash, state: historyState } = history.location;
		const params = new URLSearchParams(search);

		params.set(querySaveDataKey, save);
		currentSave = save;
		history.replace(`${pathname}?${params.toString()}${hash}`, historyState);
	});

	const unsubscribeHistory = history.subscribe(({ location }) => {
		const save = new URLSearchParams(location.search).get(querySaveDataKey);

		if (save === currentSave) {
			return;
		}

		currentSave = save;
		applyingHistory = true;
		temporal.pause();

		try {
			store.setState(parseEncodedData(save) ?? defaultInitialState);
			temporal.clear();
		} finally {
			temporal.resume();
			applyingHistory = false;
		}
	});

	return () => {
		unsubscribeHistory();
		unsubscribeStore();
	};
};
