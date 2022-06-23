import type { Item, ItemFactory } from "./Item";
import type { ItemRecord } from "./types";

export interface Addon extends Item {
	type: "Addon";
	subitems: ItemRecord<Addon>;
}

export const createAddon: ItemFactory<Addon> = (name = "", amount = "") => ({
	name,
	amount,
	subitems: {},
	type: "Addon"
});
