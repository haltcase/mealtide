import { Button, ButtonGroup, Tooltip } from "@nextui-org/react";
import { TbPencil, TbTrash } from "react-icons/tb";

import { Item } from "../models/Item";
import { getTax, toDoubleString } from "../utilities/calc";
import { getItemTypeDisplayName, parseDomFloat } from "../utilities/helpers";
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
	<ButtonGroup size="sm" key={item.name}>
		<Tooltip content={title} placement="bottom-start">
			<Button color="primary" as="span">{`$${toDoubleString(
				parseDomFloat(item.amount) +
					(item.name.toLowerCase() === "tip"
						? 0
						: getTax(parseDomFloat(item.amount)))
			)}`}</Button>
		</Tooltip>

		<Button className="bg-primary-100" as="span" radius="none">
			{item.name}
		</Button>

		<ItemEditor
			trigger={
				<Button aria-label="Edit" color="primary" radius="none" isIconOnly>
					<TbPencil size={16} />
				</Button>
			}
			item={item}
			isEdit={true}
			onSubmit={item => onSubmit(item)}
		/>

		<Tooltip content={`Remove this ${getItemTypeDisplayName(item)}`}>
			<Button aria-label="Remove" color="danger" onClick={() => onRemove(item)}>
				<TbTrash size={16} />
			</Button>
		</Tooltip>
	</ButtonGroup>
);
