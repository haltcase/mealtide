import type { MainStoreState } from "@/app/stores/mainStore";
import type { FrontendLineItem } from "@/models/Item";

import { getPriceDetails, toDoubleString } from "./calc";

const baseUrl = "https://venmo.com";

export const getPaymentUrl = (
	state: MainStoreState,
	item: FrontendLineItem
): string => {
	const { orderTitle, venmoUsername } = state;

	if (!venmoUsername) {
		return "";
	}

	const url = new URL(venmoUsername, baseUrl);

	const { subtotal, tax, chargeSplit, total } = getPriceDetails(state, item);

	url.searchParams.append("txn", "pay");
	url.searchParams.append("audience", "private");
	url.searchParams.append("amount", toDoubleString(total));

	let orderNote = "Order for ";

	orderNote +=
		orderTitle.trim() === "" ? new Date().toLocaleDateString() : orderTitle;

	orderNote += `: $${toDoubleString(subtotal)} plus $${toDoubleString(
		tax
	)} in tax`;

	if (chargeSplit > 0) {
		orderNote += `, $${toDoubleString(chargeSplit)} in fees`;
	}

	url.searchParams.append("note", orderNote);

	return url.toString();
};
