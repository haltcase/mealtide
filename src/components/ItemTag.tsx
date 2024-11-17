import { ActionIcon, Button, ButtonGroup, Tooltip } from "@mantine/core";
import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import { TbPencil, TbTrash } from "react-icons/tb";

import type { Item } from "../models/Item";
import { toDoubleString } from "../utilities/calc";
import { getItemTypeDisplayName } from "../utilities/helpers";
import { ItemEditor } from "./ItemEditor";

interface ItemTagProps<T extends Item> {
	title: string;
	item: T;
	onRemove: (item: T) => void;
	onSubmit: (item: T) => void;
}

export const ItemTagInner = <T extends Item>(
	{ title, item, onRemove, onSubmit }: ItemTagProps<T>,
	ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
	return (
		// apply a `key` to this component to ensure a re-render when the item name
		// changes (e.g., when the item is edited); without this, the target for item
		// editors gets mismatched or lost
		// see: https://reactjs.org/docs/reconciliation.html#keys
		<ButtonGroup key={item.name} ref={ref}>
			<Tooltip label={title} position="bottom-start">
				<ActionIcon
					className="cursor-help rounded-r-none pl-4 text-sm hover:bg-primary-500"
					color="primary.5"
					size="compact-md"
				>{`$${toDoubleString(item.amount)}`}</ActionIcon>
			</Tooltip>

			<Button
				className="cursor-default text-sm hover:bg-primary-500"
				color="primary.5"
				radius="none"
				size="compact-md"
			>
				{item.name}
			</Button>

			<ItemEditor
				trigger={
					<Tooltip label={`Edit this ${getItemTypeDisplayName(item)}`}>
						<Button aria-label="Edit" radius="none" size="compact-md">
							<TbPencil size={16} />
						</Button>
					</Tooltip>
				}
				item={item}
				isEdit={true}
				onSubmit={onSubmit}
			/>

			<Tooltip label={`Remove this ${getItemTypeDisplayName(item)}`}>
				<Button
					aria-label="Remove"
					color="danger"
					size="compact-md"
					onClick={() => {
						onRemove(item);
					}}
				>
					<TbTrash size={16} />
				</Button>
			</Tooltip>
		</ButtonGroup>
	);
};

export const ItemTag = forwardRef(ItemTagInner);
