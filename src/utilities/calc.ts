import type { MainStoreState } from "@/app/stores/mainStore";
import type { FrontendFee, FrontendLineItem } from "@/models/Item";

import type { DomNumber, ItemMap } from "../models/types";
import { parseDomFloat } from "./helpers";

export const toDoubleString = (amount: DomNumber): string =>
	Intl.NumberFormat("en-US", {
		style: "decimal",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(parseDomFloat(amount));

export const getTotalCharges = (items: ItemMap): number => {
	return [...items.values()].reduce(
		(previous, current) => previous + parseDomFloat(current.amount),
		0
	);
};

export const getChargeSplit = (
	fees: ItemMap<FrontendFee>,
	partyCount: number
): number => getTotalCharges(fees) / partyCount;

export const calculateProportion = (
	state: MainStoreState,
	item: FrontendLineItem,
	total: number
) => {
	let otherItemsTotal = 0;

	for (const [_key, value] of state.lineItems) {
		if (item.name === value.name) {
			continue;
		}

		otherItemsTotal +=
			parseDomFloat(value.amount) + getTotalCharges(value.subitems);
	}

	return total / (total + otherItemsTotal);
};

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
	state: MainStoreState,
	item: FrontendLineItem
): PriceDetails => {
	const { fees, lineItems, taxAmount } = state;

	const addonSubtotal = getTotalCharges(item.subitems);
	const subtotal = parseDomFloat(item.amount) + addonSubtotal;
	const taxSplitAmount = taxAmount * calculateProportion(state, item, subtotal);
	const chargeSplit = getChargeSplit(fees, lineItems.size);
	const total = subtotal + taxSplitAmount + chargeSplit;

	return {
		addonSubtotal,
		subtotal,
		tax: taxSplitAmount,
		chargeSplit,
		total
	};
};
