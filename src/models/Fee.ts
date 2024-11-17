import type { FrontendFee, ItemFactory } from "./Item";

export const createFee: ItemFactory<FrontendFee> = (
	name = "",
	amount = "",
	description = ""
) => ({
	name,
	description,
	amount,
	type: "Fee"
});
