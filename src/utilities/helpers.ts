import type { Item } from "../models/Item";
import type { DomNumber } from "../models/types";

export const isItemValid = (item: Item): boolean =>
	item.name !== "" && item.amount !== "" && item.amount != null;

export const capitalize = (text: string): string =>
	text === "" ? text : text[0].toLocaleUpperCase() + text.slice(1);

export const getItemTypeDisplayName = (item: Item): string =>
	({
		LineItem: "item",
		Fee: "fee or discount",
		Addon: "addon"
	})[item.type];

export const parseDomFloat = (amount: DomNumber): number => {
	const value =
		typeof amount === "string" ? Number.parseFloat(amount) : (amount ?? 0);

	return Number.isNaN(value) ? 0 : value;
};

// https://github.com/sindresorhus/is-plain-obj
export const isPlainObject = (value: unknown): boolean => {
	if (Object.prototype.toString.call(value) !== "[object Object]") {
		return false;
	}

	const prototype = Object.getPrototypeOf(value) as unknown;
	return prototype === null || prototype === Object.prototype;
};
