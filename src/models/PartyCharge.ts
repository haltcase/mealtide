import type { DomNumber } from "../utilities";
import type { Item } from "./Item";

export interface PartyCharge extends Item {
	type: "PartyCharge";
}

export const createPartyCharge = (
	name = "",
	amount: DomNumber = ""
): PartyCharge => ({
	name,
	amount,
	type: "PartyCharge"
});
