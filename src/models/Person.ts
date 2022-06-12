import type { DomNumber, ItemRecord } from "../utilities";
import type { Addon } from "./Addon";
import type { Item } from "./Item";

export interface Person extends Item {
	type: "Person";
	subitems: ItemRecord<Addon>;
}

export const createPerson = (name = "", amount: DomNumber = ""): Person => ({
	name,
	amount,
	subitems: {},
	type: "Person"
});
