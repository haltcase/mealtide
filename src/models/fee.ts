import type { FrontendFee, ItemFactory } from "./item";

export const createFee: ItemFactory<FrontendFee> = (name = "", amount = "", description = "") => ({
	name,
	description,
	amount,
	type: "Fee"
});
