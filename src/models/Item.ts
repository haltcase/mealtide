import type { DomNumber, ItemMap } from "./types";

export interface FrontendLineItem {
	type: "LineItem";
	name: string;
	description: string;
	amount: DomNumber;
	subitems: ItemMap<FrontendAddon>;
	notes?: string;
}

export interface FrontendFee {
	type: "Fee";
	name: string;
	description: string;
	amount: DomNumber;
	subitems?: never;
	notes?: string;
}

export interface FrontendAddon {
	type: "Addon";
	name: string;
	description: string;
	amount: DomNumber;
	subitems?: never;
	notes?: string;
}

export type Item = FrontendLineItem | FrontendFee | FrontendAddon;

export type ItemFactory<T extends Item> = (
	name?: string,
	amount?: DomNumber
) => T;
