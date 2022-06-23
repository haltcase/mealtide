import {
	ChakraProps,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightAddon,
	Stack
} from "@chakra-ui/react";
import { SiVenmo } from "react-icons/si";
import { TbAt, TbNote } from "react-icons/tb";

import { capitalize } from "../utilities/helpers";

interface OrderHeadingProps extends ChakraProps {
	orderTitle: string;
	venmoUsername: string;
	onOrderTitleChange: (newOrderTitle: string) => void;
	onVenmoUsernameChange: (newVenmoUsername: string) => void;
}

export const OrderHeading = ({
	orderTitle,
	venmoUsername,
	onOrderTitleChange,
	onVenmoUsernameChange,
	...rest
}: OrderHeadingProps): JSX.Element => (
	<Stack direction={["column", "column", "row"]} spacing={4} {...rest}>
		<InputGroup>
			<InputLeftAddon>
				<TbNote size={22} />
			</InputLeftAddon>

			<Input
				type="text"
				placeholder="What are we getting?"
				value={orderTitle}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					onOrderTitleChange(capitalize(e.target.value))
				}
			/>
		</InputGroup>

		<InputGroup>
			<InputLeftAddon>
				<TbAt size={22} className="" />
			</InputLeftAddon>

			<Input
				type="text"
				placeholder="Username"
				value={venmoUsername}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					onVenmoUsernameChange(e.target.value)
				}
			/>
			<InputRightAddon>
				<SiVenmo size={48} />
			</InputRightAddon>
		</InputGroup>
	</Stack>
);
