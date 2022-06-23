import type { Addon } from "./Addon";
import type { ItemRecord, DomNumber } from "./types";

export interface Item {
	type: "Person" | "PartyCharge" | "Addon";
	name: string;
	amount: DomNumber;
	subitems?: ItemRecord<Addon>;
	notes?: string;
}

export interface ItemFactory<T extends Item> {
	(name?: string, amount?: DomNumber): T;
}
