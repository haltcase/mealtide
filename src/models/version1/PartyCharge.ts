import type { Item } from "./Item";

export interface PartyCharge extends Item {
	type: "PartyCharge";
	subitems: Record<string, never>;
}
