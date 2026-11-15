import { enableMapSet } from "immer";
import { temporal } from "zundo";
import type { TemporalState } from "zundo";
import { createStore } from "zustand";
import type { Mutate, StoreApi } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { FrontendAddon, FrontendFee, FrontendLineItem } from "@/models/item";
import type { ItemMap } from "@/models/types";

enableMapSet();

export interface MainStoreState {
	version: number;
	orderTitle: string;
	venmoUsername?: string;
	fees: ItemMap<FrontendFee>;
	lineItems: ItemMap<FrontendLineItem>;
	taxAmount: number;
}

export interface MainStoreActions {
	reset: () => void;
	setVenmoUsername: (username: string) => void;
	setOrderTitle: (newTitle: string) => void;
	setTaxAmount: (newTaxAmount: number) => void;

	setFee: (charge: FrontendFee, previousName?: string) => void;
	removeFee: (charge: FrontendFee) => void;

	setLineItem: (item: FrontendLineItem, previousName?: string) => void;
	removeLineItem: (item: FrontendLineItem) => void;
	setLineItemAddon: (item: FrontendLineItem, addon: FrontendAddon, previousName?: string) => void;
	removeLineItemAddon: (item: FrontendLineItem, addon: FrontendAddon) => void;
}

export type MainStore = MainStoreState & MainStoreActions;

export type MainStoreInstance = Mutate<
	StoreApi<MainStore>,
	[["temporal", StoreApi<TemporalState<MainStore>>], ["zustand/immer", never]]
>;

export const defaultInitialState: MainStoreState = {
	version: 2,
	orderTitle: "",
	venmoUsername: undefined,
	fees: new Map(),
	lineItems: new Map(),
	taxAmount: 0
};

export const createMainStore = (
	initialState: MainStoreState = defaultInitialState
): MainStoreInstance =>
	createStore<MainStore>()(
		temporal(
			immer((set) => ({
				...initialState,

				reset: () => {
					set(defaultInitialState);
				},

				setTaxAmount: (newTaxAmount: number) => {
					set((state) => {
						state.taxAmount = newTaxAmount;
					});
				},

				setFee: (charge, previousName) => {
					set((state) => {
						if (previousName !== undefined && previousName !== charge.name) {
							state.fees.delete(previousName);
						}

						state.fees.set(charge.name, charge);
					});
				},

				removeFee: (charge) => {
					set((state) => {
						state.fees.delete(charge.name);
					});
				},

				setLineItem: (item, previousName) => {
					set((state) => {
						if (previousName !== undefined && previousName !== item.name) {
							state.lineItems.delete(previousName);
						}

						state.lineItems.set(item.name, item);
					});
				},

				removeLineItem: (item) => {
					set((state) => {
						state.lineItems.delete(item.name);
					});
				},

				setVenmoUsername: (username) => {
					set({ venmoUsername: username });
				},

				setOrderTitle: (orderTitle) => {
					set({ orderTitle });
				},

				setLineItemAddon: (item, addon, previousName) => {
					set((state) => {
						const subitems = state.lineItems.get(item.name)?.subitems;

						if (previousName !== undefined && previousName !== addon.name) {
							subitems?.delete(previousName);
						}

						subitems?.set(addon.name, addon);
					});
				},

				removeLineItemAddon: (item, addon) => {
					set((state) => {
						state.lineItems.get(item.name)?.subitems.delete(addon.name);
					});
				}
			}))
		)
	);
