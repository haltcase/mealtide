import type { DomNumber, ItemRecord } from "../utilities";
import type { Addon } from "./Addon";

export interface Item {
	type: "Person" | "PartyCharge" | "Addon";
	name: string;
	amount: DomNumber;
	subitems?: ItemRecord<Addon>;
	notes?: string;
}
