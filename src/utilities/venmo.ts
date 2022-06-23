import type { Person } from "../models/Person";
import type { SerializableState } from "../models/SerializableState";
import { getPriceDetails, toDoubleString } from "./calc";

const baseUrl = "https://venmo.com";

export const getPaymentUrl = (
	state: SerializableState,
	person: Person
): string => {
	const url = new URL(state.venmoUsername, baseUrl);

	const { subtotal, tax, chargeSplit, total } = getPriceDetails(state, person);

	url.searchParams.append("txn", "pay");
	url.searchParams.append("audience", "private");
	url.searchParams.append("amount", toDoubleString(total));

	let orderNote = "Order for ";

	if (state.orderTitle.trim() != "") {
		orderNote += state.orderTitle;
	} else {
		orderNote += new Date().toLocaleDateString();
	}

	orderNote += `: $${toDoubleString(subtotal)} plus $${toDoubleString(
		tax
	)} in tax`;

	if (chargeSplit > 0) {
		orderNote += `, $${toDoubleString(chargeSplit)} in fees`;
	}

	url.searchParams.append("note", orderNote);

	return url.toString();
};
