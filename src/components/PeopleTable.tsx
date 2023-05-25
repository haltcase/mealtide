import {
	Button,
	ButtonGroup,
	Spacer,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip
} from "@nextui-org/react";
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

export const PeopleTable = ({
	state,
	onStateChange,
	hasVenmo
}: PeopleTableProps) => {
	const submitAddon = (person: Person, addon: Addon): void => {
		onStateChange(state => {
			state.people[person.name].subitems[addon.name] = addon;
		});
	};

	const removeAddon = (person: Person, addon: Addon): void =>
		onStateChange(state => {
			delete state.people[person.name].subitems[addon.name];
		});

	const rows = Object.values(state.people).reverse();

	return (
		<Table
			classNames={{
				th: "bg-primary/25 text-black/90 text-sm uppercase"
			}}
			aria-label="Items in this order"
			isStriped
			removeWrapper
			bottomContent={
				<div className="flex w-fit flex-col self-end pr-4">
					<span className="font-bold">Grand Total</span>
					<PriceLevel
						price={Object.values(state.people).reduce(
							(previous, current) =>
								previous + getPriceDetails(state, current).total,
							0
						)}
					/>
				</div>
			}>
			<TableHeader>
				<TableColumn>Item</TableColumn>
				<TableColumn>Total</TableColumn>
			</TableHeader>

			<TableBody items={rows}>
				{person => (
					<TableRow key={person.name}>
						<TableCell>
							<div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
								<span>{person.name}</span>

								<Spacer />

								<ButtonGroup size="sm">
									<ItemEditor
										key={`${person.name}-add`}
										trigger={
											<Button
												aria-label="Add another item"
												color="primary"
												isIconOnly>
												<TbPlus />
											</Button>
										}
										title="Add another item"
										item={createAddon}
										isEdit={false}
										onSubmit={item => {
											submitAddon(person, item);
										}}
									/>

									<ItemEditor
										key={`${person.name}-edit`}
										trigger={
											<Button
												aria-label="Edit this item"
												color="primary"
												isIconOnly>
												<TbPencil />
											</Button>
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
										key={`${person.name}-remove`}
										content="Remove this item"
										placement="bottom-start">
										<Button
											aria-label="Remove this item"
											color="danger"
											isIconOnly
											onClick={() =>
												onStateChange(state => {
													delete state.people[person.name];
												})
											}>
											<TbTrash />
										</Button>
									</Tooltip>
								</ButtonGroup>
							</div>

							{Object.keys(person.subitems).length > 0 && (
								<div className="mt-2 flex flex-row flex-wrap gap-2">
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
								</div>
							)}
						</TableCell>

						<TableCell>
							<div className="flex flex-row items-center">
								<div className="mr-2 flex h-fit w-full flex-col gap-4">
									<PriceLevel price={getPriceDetails(state, person).total} />

									<PaymentButton
										state={state}
										person={person}
										disabled={!hasVenmo}
									/>
								</div>

								<PriceBreakdown state={state} person={person} />
							</div>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
