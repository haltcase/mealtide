import {
	Button,
	Divider,
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@nextui-org/react";
import { TbInfoCircle } from "react-icons/tb";

import { Person } from "../models/Person";
import { SerializableState } from "../models/SerializableState";
import { DomNumber } from "../models/types";
import { getPriceDetails, toDoubleString } from "../utilities/calc";
import { isEmptyTree } from "../utilities/helpers";

interface PriceBreakdownProps {
	state: SerializableState;
	person: Person;
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

export const PriceBreakdown = ({
	state,
	person
}: PriceBreakdownProps): JSX.Element => {
	const { addonSubtotal, tax, chargeSplit, total } = getPriceDetails(
		state,
		person
	);

	return (
		<Popover>
			<PopoverTrigger>
				<Button
					aria-label="Show details"
					size="xs"
					variant="light"
					radius="full"
					isIconOnly>
					<TbInfoCircle size={18} />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 px-4 shadow-lg">
				<div className="flex flex-col pb-4">
					<p className="pb-2 pt-4 font-bold">Order details for {person.name}</p>

					<PriceItem label="Base" amount={person.amount} />

					{!isEmptyTree(person.subitems) && (
						<PriceItem label="Other items" amount={addonSubtotal} />
					)}

					<PriceItem label="Tax" amount={tax} />
					<PriceItem label="Fees" amount={chargeSplit} />

					<Divider className="my-2" />

					<PriceItem label="Total" amount={total} />
				</div>
			</PopoverContent>
		</Popover>
	);
};
