import type { Item } from "../models/Item";
import type { DomNumber } from "../models/types";

export const isItemValid = (item: Item): boolean =>
	item.name !== "" && item.amount !== "" && item.amount != null;

export const capitalize = (text: string): string =>
	text === "" ? text : text[0].toLocaleUpperCase() + text.slice(1);

export const getItemTypeDisplayName = (item: Item): string =>
	({
		Person: "item",
		PartyCharge: "charge",
		Addon: "addon"
	})[item.type];

export const parseDomFloat = (amount: DomNumber): number =>
	typeof amount === "string" ? Number.parseFloat(amount) : amount ?? 0;

// https://github.com/sindresorhus/is-plain-obj
export const isPlainObject = (value: unknown): boolean => {
	if (Object.prototype.toString.call(value) !== "[object Object]") {
		return false;
	}

	const prototype = Object.getPrototypeOf(value) as unknown;
	return prototype === null || prototype === Object.prototype;
};

/**
 * Recurse through an object and return `true` if all it contains
 * are empty objects. Otherwise, return `false`.
 * @param object -
 */
export const isEmptyTree = (object: object | null | undefined): boolean => {
	if (object == null) {
		return true;
	}

	const keys = Object.keys(object);
	const keyCount = keys.length;

	if (keyCount < 1) {
		return true;
	}

	for (let index = 0; index < keyCount; index++) {
		const key = keys[index];
		// @ts-expect-error - we don't need to care about this
		const value = object[key] as object | null | undefined;

		if (!isPlainObject(value) || !isEmptyTree(value)) {
			return false;
		}
	}

	return true;
};
