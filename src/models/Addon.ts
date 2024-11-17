import type { FrontendAddon, ItemFactory } from "./Item";

export const createAddon: ItemFactory<FrontendAddon> = (
	name = "",
	amount = "",
	description = ""
) => ({
	name,
	description,
	amount,
	type: "Addon"
});
