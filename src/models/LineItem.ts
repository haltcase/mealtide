import type { FrontendLineItem, ItemFactory } from "./Item";

export const createLineItem: ItemFactory<FrontendLineItem> = (
	name = "",
	amount = "",
	description = ""
) => ({
	name,
	description,
	amount,
	subitems: new Map(),
	type: "LineItem"
});
