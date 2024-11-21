import type { Addon } from "./Addon";
import type { Item } from "./Item";

export interface Person extends Item {
	type: "Person";
	subitems: Record<string, Addon>;
}
