import type { DomNumber } from "../types";
import type { Addon } from "./Addon";

export interface Item {
	type: "Person" | "PartyCharge" | "Addon";
	name: string;
	amount: DomNumber;
	subitems?: Record<string, Addon>;
	notes?: string;
}
