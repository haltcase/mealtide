import {
	ButtonGroup,
	Flex,
	forwardRef,
	IconButton,
	Spacer,
	Stack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Tfoot,
	Th,
	Thead,
	Tooltip,
	Tr
} from "@chakra-ui/react";
import { TbPencil, TbPlus, TbTrash } from "react-icons/tb";
import { Updater } from "use-immer";

import { Addon, createAddon } from "../models/Addon";
import { Person } from "../models/Person";
import { SerializableState } from "../models/SerializableState";
import { getPriceDetails } from "../utilities/calc";
import { ItemEditor } from "./ItemEditor";
import { ItemTag } from "./ItemTag";
import { PaymentButton } from "./PaymentButton";
import { PriceBreakdown } from "./PriceBreakdown";
import { PriceLevel } from "./PriceLevel";

interface PeopleTableProps {
	state: SerializableState;
	onStateChange: Updater<SerializableState>;
	hasVenmo: boolean;
}

export const PeopleTable = forwardRef(
	({ state, onStateChange, hasVenmo }: PeopleTableProps, ref) => {
		const submitAddon = (person: Person, addon: Addon): void => {
			onStateChange(state => {
				state.people[person.name].subitems[addon.name] = addon;
			});
		};

		const removeAddon = (person: Person, addon: Addon): void =>
			onStateChange(state => {
				delete state.people[person.name].subitems[addon.name];
			});

		return (
			<TableContainer ref={ref}>
				<Table colorScheme="gray">
					<Thead>
						<Tr>
							<Th>Item</Th>
							<Th isNumeric>Total</Th>
						</Tr>
					</Thead>

					<Tbody>
						{Object.values(state.people)
							.reverse()
							.map(person => (
								<Tr key={person.name}>
									<Td width={{ base: "50%", md: "75%" }}>
										<Flex
											gap={2}
											alignItems={{ base: "start", md: "center" }}
											direction={{ base: "column", md: "row" }}>
											<Text as="span">{person.name}</Text>

											<Spacer />

											<ButtonGroup size="sm" isAttached>
												<ItemEditor
													key={person.name}
													trigger={
														<IconButton
															aria-label="Add another item"
															borderRightRadius={0}
															backgroundColor="blue.100"
															color="blue.700">
															<TbPlus />
														</IconButton>
													}
													title="Add another item"
													item={createAddon}
													isEdit={false}
													onSubmit={item => {
														submitAddon(person, item);
													}}
												/>

												<ItemEditor
													key={person.name}
													trigger={
														<IconButton
															aria-label="Edit this item"
															borderRadius={0}
															backgroundColor="blue.50"
															color="blue.600">
															<TbPencil />
														</IconButton>
													}
													item={person}
													isEdit={true}
													onSubmit={item =>
														onStateChange(state => {
															delete state.people[person.name];
															state.people[item.name] = item;
														})
													}
												/>

												<Tooltip
													key={person.name}
													label="Remove this item"
													placement="bottom-start">
													<IconButton
														aria-label="Remove this item"
														borderLeftRadius={0}
														backgroundColor="red.50"
														color="red.600"
														onClick={() =>
															onStateChange(state => {
																delete state.people[person.name];
															})
														}>
														<TbTrash />
													</IconButton>
												</Tooltip>
											</ButtonGroup>
										</Flex>

										{Object.keys(person.subitems).length > 0 && (
											<Flex flexWrap="wrap" marginTop={2} rowGap={2}>
												{Object.values(person.subitems)
													.reverse()
													.map(addon => (
														<ItemTag
															title={`This is an addon item for ${person.name}`}
															item={addon}
															key={addon.name}
															onRemove={item => removeAddon(person, item)}
															onSubmit={item => {
																removeAddon(person, addon);
																submitAddon(person, item);
															}}
														/>
													))}
											</Flex>
										)}
									</Td>

									<Td>
										<Flex direction="row" alignItems="center">
											<Stack
												direction="column"
												spacing={4}
												height="fit-content"
												width="full"
												marginRight={2}>
												<PriceLevel
													fontWeight="bold"
													color="teal.400"
													price={getPriceDetails(state, person).total}
												/>

												<PaymentButton
													state={state}
													person={person}
													disabled={!hasVenmo}
												/>
											</Stack>

											<PriceBreakdown state={state} person={person} />
										</Flex>
									</Td>
								</Tr>
							))}
					</Tbody>
					<Tfoot>
						<Tr>
							<Td></Td>
							<Td>
								<Stack direction="column">
									<Text fontWeight="bold">Grand Total</Text>
									<PriceLevel
										fontWeight="bold"
										color="teal.400"
										price={Object.values(state.people).reduce(
											(previous, current) =>
												previous + getPriceDetails(state, current).total,
											0
										)}
									/>
								</Stack>
							</Td>
						</Tr>
					</Tfoot>
				</Table>
			</TableContainer>
		);
	}
);
