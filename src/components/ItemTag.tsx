import { Button, ButtonGroup, Tooltip, IconButton } from "@chakra-ui/react";

import { TbPencil, TbTrash } from "react-icons/tb";

import { Item } from "../models/Item";
import { toDoubleString } from "../utilities/calc";
import { getItemTypeDisplayName } from "../utilities/helpers";
import { ItemEditor } from "./ItemEditor";

interface ItemTagProps<T extends Item> {
	title: string;
	item: T;
	onRemove: (item: T) => void;
	onSubmit: (item: T) => void;
}

export const ItemTag = <T extends Item>({
	title,
	item,
	onRemove,
	onSubmit
}: ItemTagProps<T>): JSX.Element => (
	// apply a `key` to this component to ensure a re-render when the item name
	// changes (e.g., when the item is edited); without this, the target for item
	// editors gets mismatched or lost
	// see: https://reactjs.org/docs/reconciliation.html#keys
	<ButtonGroup size="sm" isAttached key={item.name}>
		<Tooltip label={title} placement="bottom-start">
			<Button as="span" colorScheme="blue">{`$${toDoubleString(
				item.amount
			)}`}</Button>
		</Tooltip>

		<Button as="span" borderRadius={0}>
			{item.name}
		</Button>

		<ItemEditor
			trigger={
				<IconButton
					aria-label="Edit"
					backgroundColor="blue.50"
					color="blue.600"
					borderRadius={0}>
					<TbPencil size={16} />
				</IconButton>
			}
			item={item}
			isEdit={true}
			onSubmit={item => onSubmit(item)}
		/>

		<Tooltip label={`Remove this ${getItemTypeDisplayName(item)}`}>
			<IconButton
				aria-label="Remove"
				backgroundColor="red.50"
				color="red.600"
				borderLeftRadius={0}
				onClick={() => onRemove(item)}>
				<TbTrash size={16} />
			</IconButton>
		</Tooltip>
	</ButtonGroup>
);
