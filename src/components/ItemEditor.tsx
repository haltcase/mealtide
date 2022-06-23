import {
	Box,
	Button,
	ButtonGroup,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputLeftAddon,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverFooter,
	PopoverHeader,
	PopoverTrigger,
	Portal,
	Stack,
	Tooltip,
	useDisclosure
} from "@chakra-ui/react";
import produce from "immer";
import { useEffect, useRef, useState } from "react";
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

	const isValid = isItemValid({ type: actualItem.type, name, amount });

	const canSubmit = isValid && isChanged;

	useEffect(() => {
		setIsChanged(name !== item.name || amount !== actualItem.amount);
	}, [name, amount]);

	const { isOpen, onOpen, onClose } = useDisclosure();

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

	const initialFocusRef = useRef<HTMLInputElement>(null);

	return (
		<Popover
			isOpen={isOpen}
			onOpen={onOpen}
			onClose={onClose}
			initialFocusRef={initialFocusRef}
			isLazy
			lazyBehavior="unmount">
			<PopoverTrigger>
				<Box width="fit-content">
					<Tooltip
						aria-label={actionDescription}
						placement="bottom"
						label={actionDescription}>
						{trigger}
					</Tooltip>
				</Box>
			</PopoverTrigger>

			<Portal>
				<PopoverContent>
					<PopoverArrow />
					<PopoverCloseButton />

					<PopoverHeader paddingTop={4} fontWeight="bold" border={0}>
						{actionDescription}
					</PopoverHeader>

					<PopoverBody paddingBottom={4}>
						<Stack direction="column">
							<FormControl isRequired>
								<FormLabel htmlFor="name">Name</FormLabel>

								<InputGroup>
									<InputLeftAddon pointerEvents="none">
										<TbTag />
									</InputLeftAddon>

									<Input
										id="name"
										type="text"
										placeholder={placeholder}
										value={name}
										ref={initialFocusRef}
										autoComplete="off"
										list={
											hasSuggestions
												? `${actualItem.type}-suggestions`
												: undefined
										}
										onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
											e.key === "Enter" && submitChanges()
										}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setName(capitalize(e.target.value))
										}
									/>

									{hasSuggestions && (
										<datalist id={`${actualItem.type}-suggestions`}>
											{suggestions.map(suggestion => (
												<option value={suggestion} key={suggestion}></option>
											))}
										</datalist>
									)}
								</InputGroup>
							</FormControl>

							<FormControl isRequired>
								<FormLabel htmlFor="amount">Amount</FormLabel>

								<InputGroup>
									<InputLeftAddon pointerEvents="none">
										<TbCurrencyDollar />
									</InputLeftAddon>

									<NumberInput
										id="amount"
										width="100%"
										placeholder="10.99"
										min={0}
										precision={2}
										step={0.1}
										value={amount}
										onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
											e.key === "Enter" && submitChanges()
										}
										onChange={(value: string) => setAmount(value)}>
										<NumberInputField borderLeftRadius={0} />
										<NumberInputStepper>
											<NumberIncrementStepper />
											<NumberDecrementStepper />
										</NumberInputStepper>
									</NumberInput>
								</InputGroup>
							</FormControl>
						</Stack>
					</PopoverBody>

					<PopoverFooter display="flex" justifyContent="end">
						<ButtonGroup size="sm">
							<Button colorScheme="red" onClick={onClose}>
								Cancel
							</Button>
							<Button
								colorScheme="green"
								disabled={!canSubmit}
								onClick={submitChanges}>
								{actionType}
							</Button>
						</ButtonGroup>
					</PopoverFooter>
				</PopoverContent>
			</Portal>
		</Popover>
	);
};
