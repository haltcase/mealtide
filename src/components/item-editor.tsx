import {
	Autocomplete,
	Button,
	NumberInput,
	Popover,
	PopoverDropdown,
	PopoverTarget,
	TextInput
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRef, useState } from "react";
import { TbCurrencyDollar, TbTag, TbTextCaption } from "react-icons/tb";

import type { Item, ItemFactory } from "../models/item";
import { capitalize, getItemTypeDisplayName, isItemValid } from "../utilities/helpers";

interface ItemEditorProps<T extends Item> {
	renderTrigger: (handleOpen: () => void) => React.JSX.Element;
	item: T | ItemFactory<T>;
	isEdit: boolean;
	onSubmit: (item: T) => void;
	title?: string;
	suggestions?: string[];
}

const placeholders: Record<Item["type"], string> = {
	LineItem: "Who ordered this?",
	Fee: "What is this for?",
	Addon: "What is it?"
};

export const ItemEditor = <T extends Item>({
	renderTrigger,
	item,
	isEdit,
	title,
	onSubmit,
	suggestions
}: ItemEditorProps<T>): React.JSX.Element => {
	const actualItem = typeof item === "function" ? item() : item;
	const typeDisplayName = getItemTypeDisplayName(actualItem);
	const placeholder = placeholders[actualItem.type];
	const actionType = isEdit ? "Update" : "Add";

	const actionDescription =
		title ?? `${actionType}${actionType === "Add" ? "" : " this"} ${typeDisplayName}`;

	const [name, setName] = useState(actualItem.name);
	const [description, setDescription] = useState(actualItem.description);
	const [amount, setAmount] = useState(actualItem.amount);
	const [isOpen, { open, close }] = useDisclosure();

	const isChanged =
		name !== actualItem.name ||
		description !== actualItem.description ||
		amount !== actualItem.amount;

	const canSubmit = isChanged && isItemValid({ name, amount });

	const openEditor = () => {
		setName(actualItem.name);
		setDescription(actualItem.description);
		setAmount(actualItem.amount);
		open();
	};

	const handleSubmit = () => {
		if (!canSubmit) {
			return;
		}

		close();
		onSubmit({ ...actualItem, name, description, amount });
	};

	const amountInputRef = useRef<HTMLInputElement | null>(null);

	return (
		<Popover
			classNames={{
				arrow: "from-secondary-200 to-primary-100 bg-linear-to-br",
				dropdown:
					"from-primary-100 to-secondary-200 rounded-lg border-0 bg-linear-to-br px-4 shadow-lg"
			}}
			position="bottom-start"
			opened={isOpen}
			onDismiss={close}>
			<PopoverTarget>{renderTrigger(openEditor)}</PopoverTarget>

			<PopoverDropdown>
				<div className="flex max-w-[75vw] flex-col gap-2">
					<p className="pt-4 font-bold">{actionDescription}</p>

					<Autocomplete
						className="text-foreground max-w-full"
						type="text"
						label="Name"
						placeholder={placeholder}
						value={name}
						// oxlint-disable-next-line no-autofocus
						autoFocus
						leftSection={<TbTag className="text-primary" />}
						data={[{ group: "Choose one or enter your own", items: suggestions ?? [] }]}
						autoComplete="off"
						onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
							event.key === "Enter" && handleSubmit()
						}
						onChange={(value) => {
							setName(capitalize(value));
						}}
						onOptionSubmit={() => {
							amountInputRef.current?.focus();
						}}
						comboboxProps={{ radius: "md", withinPortal: false }}
					/>

					{actualItem.type === "LineItem" ? (
						<TextInput
							label="Description"
							placeholder="What did they order?"
							value={description}
							leftSection={<TbTextCaption className="text-primary" />}
							onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
								event.key === "Enter" && handleSubmit()
							}
							onChange={(event) => setDescription(capitalize(event.currentTarget.value))}
						/>
					) : null}

					<NumberInput
						ref={amountInputRef}
						className="text-foreground max-w-full"
						type="text"
						label="Amount"
						description={actualItem.type === "Fee" ? "Use negative for discounts" : undefined}
						descriptionProps={{
							className: "text-sm"
						}}
						leftSection={<TbCurrencyDollar className="text-primary" />}
						width="100%"
						placeholder="10.99"
						inputMode="decimal"
						pattern="^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$"
						min={actualItem.type === "Fee" ? undefined : 0}
						step={0.1}
						decimalScale={2}
						fixedDecimalScale
						value={amount}
						onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
							event.key === "Enter" && handleSubmit()
						}
						onChange={setAmount}
					/>

					<div className="flex flex-row justify-end gap-2 py-4">
						<Button size="sm" onClick={close}>
							Cancel
						</Button>

						<Button color="success" size="sm" disabled={!canSubmit} onClick={handleSubmit}>
							{actionType}
						</Button>
					</div>
				</div>
			</PopoverDropdown>
		</Popover>
	);
};
