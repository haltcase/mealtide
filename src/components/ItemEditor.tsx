import {
	Autocomplete,
	Button,
	NumberInput,
	Popover,
	PopoverDropdown,
	PopoverTarget,
	TextInput
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { produce } from "immer";
import { cloneElement, useEffect, useRef, useState } from "react";
import { TbCurrencyDollar, TbTag, TbTextCaption } from "react-icons/tb";

import type { Item, ItemFactory } from "../models/Item";
import {
	capitalize,
	getItemTypeDisplayName,
	isItemValid
} from "../utilities/helpers";

interface AddonEditorProps<T extends Item> {
	trigger: JSX.Element;
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
	trigger,
	item,
	isEdit,
	title,
	onSubmit,
	suggestions = []
}: AddonEditorProps<T>): JSX.Element => {
	const actualItem = typeof item === "function" ? item() : item;
	const typeDisplayName = getItemTypeDisplayName(actualItem);
	const placeholder = placeholders[actualItem.type];
	const actionType = isEdit ? "Update" : "Add";

	const actionDescription =
		title == null
			? `${actionType}${actionType === "Add" ? "" : " this"} ${typeDisplayName}`
			: title;

	const [name, setName] = useState(actualItem.name);
	const [description, setDescription] = useState(actualItem.description);
	const [amount, setAmount] = useState(actualItem.amount);
	const [isChanged, setIsChanged] = useState(false);
	const [isOpen, { open, close }] = useDisclosure();

	const isValid = isItemValid({
		type: actualItem.type,
		name,
		description,
		amount
	} as T);

	const canSubmit = isValid && isChanged;

	useEffect(() => {
		setIsChanged(
			name !== item.name ||
				description !== actualItem.description ||
				amount !== actualItem.amount
		);
	}, [name, description, amount]);

	const submitChanges = () => {
		if (!isValid) {
			return;
		}

		close();

		onSubmit(
			produce(actualItem, (state) => {
				state.name = name;
				state.description = description;
				state.amount = amount;
			})
		);

		if (!isEdit) {
			setName("");
			setDescription("");
			setAmount("");
		}
	};

	const handleCancelClick = () => {
		close();

		if (!isEdit) {
			setName("");
			setDescription("");
			setAmount("");
		}
	};

	const amountInputRef = useRef<HTMLInputElement | null>(null);
	const clickOutsideRef = useClickOutside(() => close());

	return (
		<Popover
			classNames={{
				arrow: "bg-gradient-to-br to-primary-100 from-secondary-200",
				dropdown:
					"rounded-lg bg-gradient-to-br from-primary-100 to-secondary-200 px-4 shadow-lg border-0"
			}}
			position="bottom-start"
			opened={isOpen}
			onChange={open}
		>
			<PopoverTarget>{cloneElement(trigger, { onClick: open })}</PopoverTarget>

			<PopoverDropdown ref={clickOutsideRef}>
				<div className="flex max-w-[75vw] flex-col gap-2">
					<p className="pt-4 font-bold">{actionDescription}</p>

					<Autocomplete
						className="text-foreground max-w-full"
						id="name"
						type="text"
						label="Name"
						placeholder={placeholder}
						value={name}
						autoFocus={true}
						leftSection={<TbTag className="text-primary" />}
						data={[
							{ group: "Choose one or enter your own", items: suggestions }
						]}
						autoComplete="off"
						onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
							event.key === "Enter" && submitChanges()
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
							id="description"
							label="Description"
							placeholder="What did they order?"
							value={description}
							leftSection={<TbTextCaption className="text-primary" />}
							onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
								event.key === "Enter" && submitChanges()
							}
							onChange={(event) =>
								setDescription(capitalize(event.currentTarget.value))
							}
						/>
					) : null}

					<NumberInput
						ref={amountInputRef}
						className="text-foreground max-w-full"
						id="amount"
						type="text"
						label="Amount"
						description={
							actualItem.type === "Fee"
								? "Use negative for discounts"
								: undefined
						}
						descriptionProps={{
							className: "text-sm"
						}}
						leftSection={<TbCurrencyDollar className="text-primary" />}
						width="100%"
						placeholder="10.99"
						inputMode="decimal"
						pattern="^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$"
						min={0}
						step={0.1}
						decimalScale={2}
						fixedDecimalScale
						value={amount}
						onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
							event.key === "Enter" && submitChanges()
						}
						onChange={setAmount}
					/>

					<div className="flex flex-row justify-end gap-2 py-4">
						<Button size="sm" onClick={handleCancelClick}>
							Cancel
						</Button>

						<Button
							color="success"
							size="sm"
							disabled={!canSubmit}
							onClick={submitChanges}
						>
							{actionType}
						</Button>
					</div>
				</div>
			</PopoverDropdown>
		</Popover>
	);
};
