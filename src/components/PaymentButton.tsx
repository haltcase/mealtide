import { Button } from "@nextui-org/react";
import { IoLogoVenmo } from "react-icons/io5";

import type { Person } from "../models/Person";
import type { SerializableState } from "../models/SerializableState";
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
			startContent={
				<span>
					<IoLogoVenmo size={22} />
				</span>
			}
			color="primary"
		>
			<span className="font-normal">pay</span>
		</Button>
	);
