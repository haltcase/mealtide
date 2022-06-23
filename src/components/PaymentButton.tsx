import { Box, Button, Text } from "@chakra-ui/react";
import { IoLogoVenmo } from "react-icons/io5";
import { Person } from "../models/Person";
import { SerializableState } from "../models/SerializableState";

import { getPaymentUrl } from "../utilities/venmo";

interface PaymentButtonProps {
	state: SerializableState;
	person: Person;
	disabled?: boolean;
}

export const PaymentButton = ({
	state,
	person,
	disabled
}: PaymentButtonProps): JSX.Element | null =>
	disabled ? null : (
		<Button
			as="a"
			href={getPaymentUrl(state, person)}
			target="_blank"
			rel="noreferrer"
			size="sm"
			rightIcon={
				<Box as="span">
					<IoLogoVenmo size={22} />
				</Box>
			}
			backgroundColor="blue.100"
			color="blue.700"
			_hover={{
				backgroundColor: "blue.200"
			}}>
			<Text as="span" fontWeight="normal">
				pay
			</Text>
		</Button>
	);
