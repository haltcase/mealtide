import type { FrontendAddon, ItemFactory } from "./item";

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
