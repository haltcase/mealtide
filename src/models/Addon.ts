import type { DomNumber, ItemRecord } from "../utilities";
import type { Item } from "./Item";

export interface Addon extends Item {
	type: "Addon";
	subitems: ItemRecord<Addon>;
}

export const createAddon = (name = "", amount: DomNumber = ""): Addon => ({
	name,
	amount,
	subitems: {},
	type: "Addon"
});
