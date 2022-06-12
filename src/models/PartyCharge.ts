import type { DomNumber, ItemRecord } from "../utilities";
import type { Item } from "./Item";

export interface PartyCharge extends Item {
	type: "PartyCharge";
	subitems: ItemRecord<never>;
}

export const createPartyCharge = (
	name = "",
	amount: DomNumber = ""
): PartyCharge => ({
	name,
	amount,
	subitems: {},
	type: "PartyCharge"
});
