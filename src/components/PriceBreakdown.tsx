import {
	Divider,
	Flex,
	forwardRef,
	IconButton,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Spacer,
	Stack,
	Text
} from "@chakra-ui/react";
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

const PriceItem = forwardRef(({ label, amount }: PriceItemProps, ref) => (
	<Flex direction="row" ref={ref}>
		<Text>{label}</Text>
		<Spacer />
		<Text>${toDoubleString(amount)}</Text>
	</Flex>
));

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
				<IconButton aria-label="Show details" size="xs" variant="ghost" isRound>
					<TbInfoCircle size={18} />
				</IconButton>
			</PopoverTrigger>
			<PopoverContent color="white" backgroundColor="teal.800">
				<PopoverArrow backgroundColor="teal.800" />
				<PopoverCloseButton />

				<PopoverHeader paddingTop={4} fontWeight="bold" border={0}>
					Order details for {person.name}
				</PopoverHeader>

				<PopoverBody paddingBottom={4}>
					<Stack direction="column">
						<PriceItem label="Base" amount={person.amount} />

						{!isEmptyTree(person.subitems) && (
							<PriceItem label="Other items" amount={addonSubtotal} />
						)}

						<PriceItem label="Tax" amount={tax} />
						<PriceItem label="Fees" amount={chargeSplit} />

						<Divider />

						<PriceItem label="Total" amount={total} />
					</Stack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
