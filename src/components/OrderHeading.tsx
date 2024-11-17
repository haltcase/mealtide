"use client";

import { NumberInput, TextInput } from "@mantine/core";
import { SiVenmo } from "react-icons/si";
import { TbAt, TbCurrencyDollar, TbNote } from "react-icons/tb";

import { useMainStore } from "@/app/providers/MainStoreProvider";

import { capitalize } from "../utilities/helpers";
import { ItemHeading } from "./ItemHeading";

export const OrderHeading: React.FC = () => {
	const [venmoUsername] = useMainStore((state) => state.venmoUsername);
	const [orderTitle] = useMainStore((state) => state.orderTitle);
	const [taxAmount] = useMainStore((state) => state.taxAmount);

	const [[setOrderTitle, setVenmoUsername, setTaxAmount]] = useMainStore(
		(state) =>
			[state.setOrderTitle, state.setVenmoUsername, state.setTaxAmount] as const
	);

	return (
		<div className="flex flex-col justify-center gap-4">
			<div className="flex flex-col justify-center gap-4 md:flex-row">
				<TextInput
					className="flex-1"
					leftSection={<TbNote size={22} />}
					leftSectionPointerEvents="none"
					name="title"
					aria-label="Name of restaurant"
					placeholder="What are we getting?"
					value={orderTitle}
					onChange={(event) =>
						setOrderTitle(capitalize(event.currentTarget.value))
					}
				/>

				<TextInput
					className="flex-1"
					classNames={{
						section: "data-[position=right]:mx-4"
					}}
					leftSection={<TbAt size={22} className="" />}
					leftSectionPointerEvents="none"
					rightSection={<SiVenmo size={48} />}
					rightSectionPointerEvents="none"
					name="venmoUsername"
					aria-label="Venmo Username"
					placeholder="Username"
					autoComplete="off"
					value={venmoUsername}
					onChange={(event) => {
						setVenmoUsername(event.currentTarget.value);
					}}
				/>
			</div>

			<ItemHeading
				title="Total tax amount"
				subtitle="Total tax amount to split proportionally"
			/>

			<NumberInput
				className="max-w-96"
				name="taxAmount"
				leftSection={<TbCurrencyDollar size={22} />}
				placeholder="10.99"
				inputMode="decimal"
				pattern="^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$"
				min={0}
				step={0.1}
				decimalScale={2}
				fixedDecimalScale
				value={taxAmount}
				onValueChange={(newTaxAmount) => {
					if (newTaxAmount.floatValue == null) {
						return;
					}

					setTaxAmount(newTaxAmount.floatValue);
				}}
			/>
		</div>
	);
};
