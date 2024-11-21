import type { Item } from "./Item";

export interface Addon extends Item {
	type: "Addon";
	subitems: Record<string, Addon>;
}
