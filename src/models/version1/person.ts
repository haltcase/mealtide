import type { Addon } from "./addon";
import type { Item } from "./item";

export interface Person extends Item {
	type: "Person";
	subitems: Record<string, Addon>;
}
