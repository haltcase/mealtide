import {
	ActionIcon,
	Divider,
	Popover,
	PopoverDropdown,
	PopoverTarget,
	Tooltip
} from "@mantine/core";
import { TbInfoCircle } from "react-icons/tb";

import { useMainStore } from "@/app/providers/MainStoreProvider";
import type { FrontendLineItem } from "@/models/Item";

import type { DomNumber } from "../models/types";
import { getPriceDetails, toDoubleString } from "../utilities/calc";

interface PriceBreakdownProps {
	item: FrontendLineItem;
}

interface PriceItemProps {
	label: string;
	amount: DomNumber;
}

const PriceItem = ({ label, amount }: PriceItemProps) => (
	<div className="flex flex-row justify-between">
		<p>{label}</p>
		<p>${toDoubleString(amount)}</p>
	</div>
);

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ item }) => {
	const [state] = useMainStore();

	const { addonSubtotal, tax, chargeSplit, total } = getPriceDetails(
		state,
		item
	);

	return (
		<Popover>
			<PopoverTarget>
				<Tooltip label="Show details">
					<ActionIcon aria-label="Show details" variant="light" radius="full">
						<TbInfoCircle size={18} />
					</ActionIcon>
				</Tooltip>
			</PopoverTarget>

			<PopoverDropdown className="rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 px-4 shadow-lg">
				<div className="flex flex-col pb-4">
					<p className="pb-2 pt-4 font-bold">Order details for {item.name}</p>

					<PriceItem label="Base" amount={item.amount} />

					{item.subitems.size > 0 && (
						<PriceItem label="Other items" amount={addonSubtotal} />
					)}

					<PriceItem label="Tax" amount={tax} />
					<PriceItem label="Fees" amount={chargeSplit} />

					<Divider className="my-2" color="secondary.4" />

					<PriceItem label="Total" amount={total} />
				</div>
			</PopoverDropdown>
		</Popover>
	);
};
