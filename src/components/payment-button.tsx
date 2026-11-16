import { Button } from "@mantine/core";
import { IoLogoVenmo } from "react-icons/io5";

import type { FrontendLineItem } from "@/models/item";
import { useMainStore } from "@/stores/main-store-hooks";

import { getPaymentUrl } from "../utilities/venmo";

interface PaymentButtonProps {
	item: FrontendLineItem;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ item }) => {
	const state = useMainStore((store) => store);

	if (!state.venmoUsername) {
		return null;
	}

	return (
		<Button
			component="a"
			href={getPaymentUrl(state, item)}
			target="_blank"
			rel="noreferrer"
			size="sm"
			leftSection={
				<span>
					<IoLogoVenmo size={22} />
				</span>
			}
			color="primary">
			<span className="font-normal">pay</span>
		</Button>
	);
};
