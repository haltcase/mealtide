"use client";

import { ActionIcon, Card, Divider, Stack, Tooltip } from "@mantine/core";
import { TbPlus } from "react-icons/tb";

import { useMainStore } from "@/app/providers/MainStoreProvider";
import { ItemEditor } from "@/components/ItemEditor";
import { ItemHeading } from "@/components/ItemHeading";
import { ItemTable } from "@/components/ItemTable";
import { ItemTag } from "@/components/ItemTag";
import { OrderHeading } from "@/components/OrderHeading";
import { Section } from "@/components/Section";
import { createFee } from "@/models/Fee";
import { createLineItem } from "@/models/LineItem";

export const OrderForm: React.FC = () => {
	const [fees] = useMainStore((state) => state.fees);
	const [lineItems] = useMainStore((state) => state.lineItems);

	const [[setFee, removeFee, setLineItem]] = useMainStore(
		(state) => [state.setFee, state.removeFee, state.setLineItem] as const
	);

	return (
		<Stack gap="md">
			<Section>
				<OrderHeading />
			</Section>

			<Section className="my-2">
				<Divider />
			</Section>

			<Section>
				<div className="flex flex-col gap-4">
					<ItemHeading
						title="Fees & discounts"
						subtitle="Equally shared things like delivery fees or coupons"
					>
						<ItemEditor
							trigger={
								<Tooltip label="Add a fee or discount">
									<ActionIcon size="md" aria-label="Add a fee or discount">
										<TbPlus strokeWidth={2} />
									</ActionIcon>
								</Tooltip>
							}
							item={createFee}
							isEdit={false}
							onSubmit={setFee}
							suggestions={["Tip", "Delivery", "Coupon"]}
						/>
					</ItemHeading>

					{fees.size === 0 ? (
						<Card className="text-foreground/80 px-xl py-lg text-center text-sm opacity-80">
							Fees & discounts will appear here when you add them
						</Card>
					) : (
						<div className="flex flex-row-reverse flex-wrap justify-end gap-2">
							{[...fees.values()].map((charge) => (
								<ItemTag
									title={"Equally shared across all groups in the order"}
									item={charge}
									key={charge.name}
									onRemove={removeFee}
									onSubmit={setFee}
								/>
							))}
						</div>
					)}
				</div>
			</Section>

			<Section className="my-2">
				<Divider />
			</Section>

			<Section>
				<div className="flex flex-col gap-4">
					{/* splits? shares? friends? people? (line) items? */}
					<ItemHeading
						title="Items"
						subtitle="Items or groups of items that share costs"
					>
						<ItemEditor
							trigger={
								<Tooltip label="Add an item">
									<ActionIcon size="md" aria-label="Add an item">
										<TbPlus strokeWidth={2} />
									</ActionIcon>
								</Tooltip>
							}
							item={createLineItem}
							isEdit={false}
							onSubmit={setLineItem}
						/>
					</ItemHeading>

					{lineItems.size === 0 ? (
						<Card className="text-foreground/80 px-xl py-lg text-center text-sm opacity-80">
							Items will appear here when you add them
						</Card>
					) : (
						<ItemTable />
					)}
				</div>
			</Section>
		</Stack>
	);
};
