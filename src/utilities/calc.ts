import type { Person } from "../models/Person";
import type { SerializableState } from "../models/SerializableState";
import type { DomNumber, ItemRecord } from "../models/types";

import { parseDomFloat } from "./helpers";

// TODO: currently this is hardcoded to the MN tax rate,
// but should be configurable; since all of us using this app
// are in MN at the moment, this is low priority
export const tax = 0.07525;

export const getTax = (amount: number): number => amount * tax;

export const toDoubleString = (amount: DomNumber): string =>
	Intl.NumberFormat("en-US", {
		style: "decimal",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(parseDomFloat(amount));

export const getTotalCharges = (items: ItemRecord): number =>
	Object.values(items).reduce(
		(previous, current) => previous + parseDomFloat(current.amount),
		0
	);

export const getChargeSplit = (data: SerializableState): number =>
	getTotalCharges(data.charges) / Object.keys(data.people).length;

interface PriceDetails {
	/** Subtotal of all items & addons */
	subtotal: number;
	/** Total amount including tax */
	total: number;
	/** Subtotal for the addon items alone */
	addonSubtotal: number;
	/** Total tax applied to all items & addons */
	tax: number;
	/** The equal split of any party charges in the order */
	chargeSplit: number;
}

export const getPriceDetails = (
	state: SerializableState,
	person: Person
): PriceDetails => {
	const addonSubtotal = getTotalCharges(person.subitems);
	const subtotal = parseDomFloat(person.amount) + addonSubtotal;
	const tax = getTax(subtotal);
	const chargeSplit = getChargeSplit(state);
	const total = subtotal + tax + chargeSplit;

	return {
		addonSubtotal,
		subtotal,
		tax,
		chargeSplit,
		total
	};
};
