import {
	Button,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	useDisclosure
} from "@nextui-org/react";
import produce from "immer";
import { useEffect, useState } from "react";
import { TbCurrencyDollar, TbTag } from "react-icons/tb";

import { Item, ItemFactory } from "../models/Item";
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
	Person: "Who ordered this item?",
	PartyCharge: "What is this charge for?",
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
	const hasSuggestions = suggestions.length > 0;
	const actionDescription =
		title == null
			? `${actionType}${actionType === "Add" ? "" : " this"} ${typeDisplayName}`
			: title;

	const [name, setName] = useState(actualItem.name);
	const [amount, setAmount] = useState(actualItem.amount);
	const [isChanged, setIsChanged] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isValid = isItemValid({ type: actualItem.type, name, amount });

	const canSubmit = isValid && isChanged;

	useEffect(() => {
		setIsChanged(name !== item.name || amount !== actualItem.amount);
	}, [name, amount]);

	const submitChanges = () => {
		if (!isValid) {
			return;
		}

		onSubmit(
			produce(actualItem, state => {
				state.name = name;
				state.amount = amount;
			})
		);

		if (!isEdit) {
			setName("");
			setAmount("");
		}

		onClose();
	};

	return (
		<Popover
			isOpen={isOpen}
			onOpenChange={open => (open ? onOpen() : onClose())}
			showArrow>
			<PopoverTrigger>{trigger}</PopoverTrigger>

			<PopoverContent className="rounded-lg bg-gradient-to-br from-primary-100 to-secondary-200 px-4 shadow-lg">
				<div className="flex flex-col gap-2">
					<p className="pt-4 font-bold">{actionDescription}</p>

					{hasSuggestions && (
						<datalist id={`${actualItem.type}-suggestions`}>
							{suggestions.map(suggestion => (
								<option value={suggestion} key={suggestion}></option>
							))}
						</datalist>
					)}

					<Input
						className="text-foreground"
						id="name"
						type="text"
						label="Name"
						placeholder={placeholder}
						value={name}
						startContent={<TbTag className="text-primary" />}
						autoComplete="off"
						list={hasSuggestions ? `${actualItem.type}-suggestions` : undefined}
						onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
							e.key === "Enter" && submitChanges()
						}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setName(capitalize(e.target.value))
						}
					/>

					<Input
						className="text-foreground"
						id="amount"
						type="number"
						label="Amount"
						startContent={<TbCurrencyDollar className="text-primary" />}
						width="100%"
						placeholder="10.99"
						min={0}
						precision={2}
						step={0.1}
						value={amount}
						onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
							e.key === "Enter" && submitChanges()
						}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setAmount(e.target.value)
						}
					/>

					<div className="flex flex-row justify-end gap-2 py-4">
						<Button size="sm" onClick={onClose}>
							Cancel
						</Button>

						<Button
							color="success"
							size="sm"
							isDisabled={!canSubmit}
							onClick={submitChanges}>
							{actionType}
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
