import { createMemoryHistory } from "@tanstack/react-router";
import lzString from "lz-string";
import { stringify } from "superjson";
import { expect, test } from "vite-plus/test";

import { createAddon } from "@/models/addon";
import { createLineItem } from "@/models/line-item";

import { createMainStore } from "./main-store";
import { encodeSave, parseEncodedData, syncWithUrl } from "./sync-with-url";

test("loads legacy saves and rejects payloads with invalid item collections", () => {
	const legacy = lzString.compressToEncodedURIComponent(
		JSON.stringify({ orderTitle: "Lunch", venmoUsername: "", people: {}, charges: {} })
	);

	const invalid = lzString.compressToEncodedURIComponent(
		stringify({
			state: { version: 2, orderTitle: "", taxAmount: 0, fees: {}, lineItems: new Map() }
		})
	);

	expect(parseEncodedData(legacy)).toMatchObject({ orderTitle: "Lunch", version: 2 });
	expect(parseEncodedData(invalid)).toBeUndefined();
	expect(parseEncodedData("invalid")).toBeUndefined();
});

test("tracks edits and undo in the URL and follows navigation between saved orders", () => {
	const first = createMainStore();
	const second = createMainStore();

	first.getState().setOrderTitle("First order");
	second.getState().setOrderTitle("Second order");
	second.getState().setVenmoUsername("second");

	const firstUrl = `/?source=share&save=${encodeURIComponent(encodeSave(first.getState()))}#order`;
	const secondUrl = `/?save=${encodeURIComponent(encodeSave(second.getState()))}`;
	const history = createMemoryHistory({ initialEntries: [secondUrl, firstUrl] });

	const store = createMainStore(
		parseEncodedData(new URLSearchParams(history.location.search).get("save"))
	);

	const unsubscribe = syncWithUrl(store, history);
	const item = createLineItem("Sam", 12);

	store.getState().setLineItem(item);
	store.getState().setLineItemAddon(item, createAddon("Drink", 3));

	const readSave = () => parseEncodedData(new URLSearchParams(history.location.search).get("save"));

	expect(readSave()?.lineItems.get("Sam")?.subitems.get("Drink")?.amount).toBe(3);
	expect(history.location.search).toContain("source=share");
	expect(history.location.hash).toBe("#order");
	expect(history.length).toBe(2);

	store.temporal.getState().undo();
	expect(readSave()?.lineItems.get("Sam")?.subitems.size).toBe(0);
	store.temporal.getState().redo();
	expect(readSave()?.lineItems.get("Sam")?.subitems.size).toBe(1);

	store.getState().setLineItemAddon(item, createAddon("Tea", 3), "Drink");
	expect(readSave()?.lineItems.get("Sam")?.subitems.has("Tea")).toBe(true);
	expect(readSave()?.lineItems.get("Sam")?.subitems.size).toBe(1);
	store.temporal.getState().undo();
	expect(readSave()?.lineItems.get("Sam")?.subitems.has("Drink")).toBe(true);
	expect(readSave()?.lineItems.get("Sam")?.subitems.size).toBe(1);

	history.back();
	expect(store.getState().orderTitle).toBe("Second order");
	expect(store.temporal.getState().pastStates).toHaveLength(0);
	expect(history.location.href).toBe(secondUrl);

	history.forward();
	expect(store.getState().orderTitle).toBe("First order");
	expect(store.getState().venmoUsername).toBeUndefined();
	expect(store.getState().lineItems.has("Sam")).toBe(true);

	store.getState().reset();
	expect(readSave()?.orderTitle).toBe("");
	expect(readSave()?.lineItems.size).toBe(0);
	unsubscribe();
});
