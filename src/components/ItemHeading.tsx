import { Heading, Stack, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { TbInfoCircle } from "react-icons/tb";

interface ItemHeadingProps {
	title: string;
	subtitle: string;
}

export const ItemHeading = (props: ItemHeadingProps): JSX.Element => {
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);

	return (
		<Stack direction="row" alignItems="center">
			<Heading as="h2" fontSize="x-large" fontWeight="normal">
				{props.title}
			</Heading>

			<Tooltip label={props.subtitle} placement="bottom" isOpen={isTooltipOpen}>
				<Text
					as="span"
					fontSize="large"
					onMouseEnter={() => setIsTooltipOpen(true)}
					onMouseLeave={() => setIsTooltipOpen(false)}
					onClick={() => setIsTooltipOpen(true)}>
					<TbInfoCircle />
				</Text>
			</Tooltip>
		</Stack>
	);
};
