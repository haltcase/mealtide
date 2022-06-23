import type { Item, ItemFactory } from "./Item";
import type { ItemRecord } from "./types";

export interface PartyCharge extends Item {
	type: "PartyCharge";
	subitems: ItemRecord<never>;
}

export const createPartyCharge: ItemFactory<PartyCharge> = (
	name = "",
	amount = ""
) => ({
	name,
	amount,
	subitems: {},
	type: "PartyCharge"
});
