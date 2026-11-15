import { ActionIcon, Button, ButtonGroup, Tooltip } from "@mantine/core";
import type { Ref } from "react";
import { TbPencil, TbTrash } from "react-icons/tb";

import type { Item } from "../models/item";
import { toDoubleString } from "../utilities/calc";
import { getItemTypeDisplayName } from "../utilities/helpers";
import { ItemEditor } from "./item-editor";

interface ItemTagProps<T extends Item> {
	title: string;
	item: T;
	ref?: Ref<HTMLDivElement>;
	onRemove: (item: T) => void;
	onSubmit: (item: T) => void;
}

export const ItemTag = <T extends Item>({
	title,
	item,
	ref,
	onRemove,
	onSubmit
}: ItemTagProps<T>): React.JSX.Element => (
	// apply a `key` to this component to ensure a re-render when the item name
	// changes (e.g., when the item is edited); without this, the target for item
	// editors gets mismatched or lost
	// see: https://reactjs.org/docs/reconciliation.html#keys
	<ButtonGroup key={item.name} ref={ref}>
		<Tooltip label={title} position="bottom-start">
			<ActionIcon
				className="hover:bg-primary-500 cursor-help rounded-r-none pl-4 text-sm"
				color="primary.5"
				size="compact-md">{`$${toDoubleString(item.amount)}`}</ActionIcon>
		</Tooltip>

		<Button
			className="hover:bg-primary-500 cursor-default text-sm"
			color="primary.5"
			radius="none"
			size="compact-md">
			{item.name}
		</Button>

		<ItemEditor
			renderTrigger={(handleOpen) => (
				<Tooltip label={`Edit this ${getItemTypeDisplayName(item)}`}>
					<Button aria-label="Edit" radius="none" size="compact-md" onClick={handleOpen}>
						<TbPencil size={16} />
					</Button>
				</Tooltip>
			)}
			item={item}
			isEdit
			onSubmit={onSubmit}
		/>

		<Tooltip label={`Remove this ${getItemTypeDisplayName(item)}`}>
			<Button
				aria-label="Remove"
				color="danger"
				size="compact-md"
				onClick={() => {
					onRemove(item);
				}}>
				<TbTrash size={16} />
			</Button>
		</Tooltip>
	</ButtonGroup>
);
