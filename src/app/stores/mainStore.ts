import { enableMapSet } from "immer";
import { temporal } from "zundo";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type {
	FrontendAddon,
	FrontendFee,
	FrontendLineItem
} from "@/models/Item";
import type { ItemMap } from "@/models/types";

import { queryStorage } from "./syncWithUrl";

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

	setFee: (charge: FrontendFee) => void;
	removeFee: (charge: FrontendFee) => void;

	setLineItem: (item: FrontendLineItem) => void;
	removeLineItem: (item: FrontendLineItem) => void;
	setLineItemAddon: (item: FrontendLineItem, addon: FrontendAddon) => void;
	removeLineItemAddon: (item: FrontendLineItem, addon: FrontendAddon) => void;
}

export type MainStore = MainStoreState & MainStoreActions;

export const defaultInitialState = {
	version: 2,
	orderTitle: "",
	fees: new Map(),
	lineItems: new Map(),
	taxAmount: 0
} satisfies MainStoreState;

export const createMainStore = (initialState = defaultInitialState) =>
	createStore<MainStore>()(
		persist(
			temporal(
				immer((set) => ({
					...initialState,

					reset: () => {
						set(initialState);
					},

					setTaxAmount: (newTaxAmount: number) => {
						set((state) => {
							state.taxAmount = newTaxAmount;
						});
					},

					setFee: (charge) => {
						set((state) => {
							state.fees.set(charge.name, charge);
						});
					},

					removeFee: (charge) => {
						set((state) => {
							state.fees.delete(charge.name);
						});
					},

					setLineItem: (item) => {
						set((state) => {
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

					setLineItemAddon: (item, addon) => {
						set((state) => {
							state.lineItems.get(item.name)?.subitems.set(addon.name, addon);
						});
					},

					removeLineItemAddon: (item, addon) => {
						set((state) => {
							state.lineItems.get(item.name)?.subitems.delete(addon.name);
						});
					}
				}))
			),
			{
				name: "data",
				storage: queryStorage
			}
		)
	);
