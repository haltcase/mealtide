import type { Item } from "./item";

export interface PartyCharge extends Item {
	type: "PartyCharge";
	subitems: Record<string, never>;
}
