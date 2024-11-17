import {
	Button,
	ButtonGroup,
	Paper,
	Space,
	Stack,
	Table,
	TableTbody,
	TableTd,
	TableTfoot,
	TableTh,
	TableThead,
	TableTr,
	Tooltip
} from "@mantine/core";
import { TbPencil, TbPlus, TbTrash } from "react-icons/tb";

import { useMainStore } from "@/app/providers/MainStoreProvider";
import { cx } from "@/lib/cx";

import { createAddon } from "../models/Addon";
import { getPriceDetails } from "../utilities/calc";
import { ItemEditor } from "./ItemEditor";
import { ItemTag } from "./ItemTag";
import { PaymentButton } from "./PaymentButton";
import { PriceBreakdown } from "./PriceBreakdown";
import { PriceLevel } from "./PriceLevel";

export const ItemTable: React.FC = () => {
	const [state] = useMainStore();

	const rows = [...state.lineItems.values()].reverse();

	return (
		<Paper withBorder>
			<Table
				classNames={{
					th: "text-black/90 text-sm uppercase",
					tfoot: cx(
						"border-t border-[var(--table-border-color)]",
						// fix ugly lines near rounded corners
						"[&>tr]:border-b-0"
					)
				}}
				aria-label="Items in this order"
				striped
				highlightOnHover
			>
				<TableThead>
					<TableTr>
						<TableTh>Split</TableTh>
						<TableTh>Total</TableTh>
					</TableTr>
				</TableThead>

				<TableTbody>
					{rows.map((item) => (
						<TableTr key={item.name}>
							<TableTd>
								<div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
									<Stack gap={0}>
										<span>{item.name}</span>
										{item.description ? <span>{item.description}</span> : null}
									</Stack>

									<Space />

									<ButtonGroup>
										<ItemEditor
											key={`${item.name}-add`}
											trigger={
												<Tooltip
													label="Add another item"
													position="bottom-start"
												>
													<Button
														aria-label="Add another item"
														size="compact-lg"
													>
														<TbPlus />
													</Button>
												</Tooltip>
											}
											title="Add another item"
											item={createAddon}
											isEdit={false}
											onSubmit={(newItem) => {
												state.setLineItemAddon(item, newItem);
											}}
										/>

										<ItemEditor
											key={`${item.name}-edit`}
											trigger={
												<Tooltip label="Edit this item" position="bottom-start">
													<Button aria-label="Edit this item" size="compact-lg">
														<TbPencil />
													</Button>
												</Tooltip>
											}
											item={item}
											isEdit={true}
											onSubmit={state.setLineItem}
										/>

										<Tooltip
											key={`${item.name}-remove`}
											label="Remove this item"
											position="bottom-start"
										>
											<Button
												aria-label="Remove this item"
												color="danger"
												size="compact-lg"
												onClick={() => state.removeLineItem(item)}
											>
												<TbTrash />
											</Button>
										</Tooltip>
									</ButtonGroup>
								</div>

								{item.subitems.size > 0 && (
									<div className="mt-2 flex flex-row flex-wrap gap-2">
										{[...item.subitems.values()].reverse().map((addon) => (
											<ItemTag
												title={`This is an addon item for ${item.name}`}
												item={addon}
												key={addon.name}
												onRemove={(newItem) => {
													state.removeLineItemAddon(item, newItem);
												}}
												onSubmit={(newItem) => {
													state.removeLineItemAddon(item, addon);
													state.setLineItemAddon(item, newItem);
												}}
											/>
										))}
									</div>
								)}
							</TableTd>

							<TableTd>
								<div className="flex flex-row items-center xs:gap-2">
									<div className="mr-2 flex h-fit w-full flex-col gap-4">
										<PriceLevel price={getPriceDetails(state, item).total} />

										<PaymentButton item={item} />
									</div>

									<PriceBreakdown item={item} />
								</div>
							</TableTd>
						</TableTr>
					))}
				</TableTbody>

				<TableTfoot>
					<TableTr>
						<TableTd></TableTd>
						<TableTd>
							<div className="flex w-full flex-col justify-end pr-[calc(1rem+28px)]">
								<span className="font-bold">Grand Total</span>
								<PriceLevel
									price={[...state.lineItems.values()].reduce(
										(previous, current) =>
											previous + getPriceDetails(state, current).total,
										0
									)}
								/>
							</div>
						</TableTd>
					</TableTr>
				</TableTfoot>
			</Table>
		</Paper>
	);
};
