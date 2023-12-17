import type { Addon } from "./Addon";
import type { DomNumber, ItemRecord } from "./types";

export interface Item {
	type: "Person" | "PartyCharge" | "Addon";
	name: string;
	amount: DomNumber;
	subitems?: ItemRecord<Addon>;
	notes?: string;
}

export type ItemFactory<T extends Item> = (
	name?: string,
	amount?: DomNumber
) => T;
