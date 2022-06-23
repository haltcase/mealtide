import type { Addon } from "./Addon";
import type { Item, ItemFactory } from "./Item";
import type { ItemRecord } from "./types";

export interface Person extends Item {
	type: "Person";
	subitems: ItemRecord<Addon>;
}

export const createPerson: ItemFactory<Person> = (name = "", amount = "") => ({
	name,
	amount,
	subitems: {},
	type: "Person"
});
