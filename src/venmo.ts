import type { Person } from "./models/Person";
import type { SerializableState } from "./models/SerializableState";
import { getTotalPersonCharges } from "./utilities";

const baseUrl = "https://venmo.com";

export const getPaymentUrl = (
	state: SerializableState,
	person: Person
): string => {
	const url = new URL(state.venmoUsername, baseUrl);

	url.searchParams.append("txn", "pay");
	url.searchParams.append("audience", "private");
	url.searchParams.append(
		"amount",
		getTotalPersonCharges(state, person).toFixed(2)
	);

	if (state.orderTitle.trim() != "") {
		url.searchParams.append("note", state.orderTitle);
	}

	return url.toString();
};
