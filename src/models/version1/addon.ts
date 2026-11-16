import type { Item } from "./item";

export interface Addon extends Item {
	type: "Addon";
	subitems: Record<string, Addon>;
}
