import { Input } from "@nextui-org/react";
import { SiVenmo } from "react-icons/si";
import { TbAt, TbNote } from "react-icons/tb";

import { capitalize } from "../utilities/helpers";

interface OrderHeadingProps {
	orderTitle: string;
	venmoUsername: string;
	onOrderTitleChange: (newOrderTitle: string) => void;
	onVenmoUsernameChange: (newVenmoUsername: string) => void;
}

export const OrderHeading = ({
	orderTitle,
	venmoUsername,
	onOrderTitleChange,
	onVenmoUsernameChange
}: OrderHeadingProps): JSX.Element => (
	<div className="flex flex-col gap-4 md:flex-row">
		<Input
			classNames={{}}
			startContent={<TbNote size={22} />}
			aria-label="Name of restaurant"
			placeholder="What are we getting?"
			value={orderTitle}
			onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
				onOrderTitleChange(capitalize(event.target.value));
			}}
		/>

		<Input
			startContent={<TbAt size={22} className="" />}
			endContent={<SiVenmo size={48} />}
			aria-label="Venmo Username"
			placeholder="Username"
			value={venmoUsername}
			onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
				onVenmoUsernameChange(event.target.value);
			}}
		/>
	</div>
);
