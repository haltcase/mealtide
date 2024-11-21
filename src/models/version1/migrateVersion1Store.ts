import type { MainStoreState } from "@/app/stores/mainStore";
import { parseDomFloat } from "@/utilities/helpers";

import type { FrontendAddon, FrontendFee, FrontendLineItem } from "../Item";
import type { Addon } from "./Addon";
import type { Item } from "./Item";
import type { PartyCharge } from "./PartyCharge";
import type { Person } from "./Person";

// version 1 assumed a constant tax rate
const tax = 0.085_25;

const getTax = (amount: number): number => amount * tax;

type SomeItemRecord =
	| Record<string, Person>
	| Record<string, Addon>
	| Record<string, Item>;

const getTotalCharges = (items: SomeItemRecord): number =>
	Object.values(items).reduce(
		(previous, current) => previous + parseDomFloat(current.amount),
		0
	);

export interface Version1Store {
	venmoUsername: string;
	orderTitle: string;
	people: Record<string, Person>;
	charges: Record<string, PartyCharge>;
}

export const migrateVersion1Store = (input: Version1Store): MainStoreState => {
	const lineItemsTotal = getTotalCharges(input.people);
	const feesTotal = getTotalCharges(input.charges);

	const lineItems = new Map(
		Object.entries(input.people).map(([key, value]) => {
			const subitems = new Map(
				Object.entries(value.subitems).map(([subitemKey, subitemValue]) => {
					const [name, description = ""] = subitemValue.name.split(" - ");

					return [
						subitemKey,
						{
							type: "Addon",
							name,
							amount: subitemValue.amount,
							description
						} satisfies FrontendAddon
					] as const;
				})
			);

			const [name, description = ""] = value.name.split(" - ");

			return [
				key,
				{
					type: "LineItem",
					name,
					amount: value.amount,
					subitems,
					description
				} satisfies FrontendLineItem
			] as const;
		})
	);

	const fees = new Map(
		Object.entries(input.charges).map(([key, value]) => {
			const baseAmount = parseDomFloat(value.amount);

			return [
				key,
				{
					type: "Fee",
					name: value.name,
					amount: baseAmount,
					description: ""
				} satisfies FrontendFee
			] as const;
		})
	);

	return {
		version: 2,
		orderTitle: input.orderTitle,
		venmoUsername: input.venmoUsername,
		lineItems,
		fees,
		taxAmount: getTax(lineItemsTotal + feesTotal)
	};
};
