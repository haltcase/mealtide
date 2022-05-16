import { Item } from "./models/Item";

export type ItemRecord<T extends Item = Item> = Record<string, T>;

export type DomNumber = number | string | undefined;

export const isItemValid = (item: Item): boolean =>
	item.name !== "" && item.amount !== "" && item.amount != null;

export const capitalize = (text: string): string =>
	text === "" ? text : text[0].toLocaleUpperCase() + text.substring(1);

export const tax = 0.07525;

export const getTax = (amount: number): number => amount * tax;

// https://github.com/sindresorhus/is-plain-obj
export const isPlainObject = (value: any): boolean => {
	if (Object.prototype.toString.call(value) !== "[object Object]") {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
};

/**
 * Recurse through an object and return `true` if all it contains
 * are empty objects. Otherwise, return `false`.
 * @param object
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

	for (let i = 0; i < keyCount; i++) {
		const key = keys[i];
		// @ts-ignore
		const value = object[key];

		if (!isPlainObject(value) || !isEmptyTree(value)) {
			return false;
		}
	}

	return true;
};

export const parseFloat = (amount: DomNumber): number =>
	typeof amount === "string" ? Number.parseFloat(amount) : amount ?? 0;

export const toDoubleString = (amount: DomNumber): string =>
	Intl.NumberFormat("en-US", {
		style: "decimal",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(parseFloat(amount));

export const getDataAttributes = (props: object): Record<string, string> =>
	Object.fromEntries(
		Object.entries(props).filter(([key, _]) => key.startsWith("data-"))
	);
