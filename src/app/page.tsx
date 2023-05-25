"use client";

import "./globals.css";

import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { useImmer } from "use-immer";

import { ItemEditor } from "@/components/ItemEditor";
import { ItemHeading } from "@/components/ItemHeading";
import { ItemTag } from "@/components/ItemTag";
import { Nav } from "@/components/Nav";
import { OrderHeading } from "@/components/OrderHeading";
import { PeopleTable } from "@/components/PeopleTable";
import { Section } from "@/components/Section";
import { useOnce } from "@/hooks/useOnce";
import { createPartyCharge, PartyCharge } from "@/models/PartyCharge";
import { createPerson, Person } from "@/models/Person";
import { SerializableState } from "@/models/SerializableState";
import { isEmptyTree } from "@/utilities/helpers";
import { getStateFromUrl, saveStateToUrl } from "@/utilities/history";
// import { useToast } from "@/utilities/toasts";

const App: NextPage = () => {
	const [dataState, setDataState] = useImmer<SerializableState>({
		orderTitle: "",
		venmoUsername: "",
		people: {},
		charges: {}
	});

	const [hasVenmo, setHasVenmo] = useState(false);

	const isInternalHistoryChange = useRef(false);

	// const toast = useToast();

	const updateStateFromUrl = (event?: PopStateEvent) => {
		console.log("updateState", event);
		if (event != null) {
			event?.preventDefault();
			// flag this event so the state changes don't clash
			// (which causes forward / "redo" to break)
			isInternalHistoryChange.current = true;
		}

		const data = getStateFromUrl();

		if (isEmptyTree(dataState) && isEmptyTree(data)) {
			return;
		}

		// data is null when going back to initial state (blank slate);
		// we have to coalesce to empty objects here to commit that blank state
		setDataState({
			venmoUsername: data?.venmoUsername ?? "",
			orderTitle: data?.orderTitle ?? "",
			people: data?.people ?? {},
			charges: data?.charges ?? {}
		});
	};

	// on initial render, load state in the URL if present
	useOnce(updateStateFromUrl);

	// whenever data changes, update the URL with the new serialized state
	useEffect(() => {
		console.log("data change");
		saveStateToUrl(dataState, isInternalHistoryChange);
	}, [dataState]);

	// listen for back button events and load state from the new location
	// this provides undo/redo capability
	useEffect(() => {
		window.addEventListener("popstate", updateStateFromUrl);

		return () => {
			window.removeEventListener("popstate", updateStateFromUrl);
		};
	});

	useEffect(() => {
		setHasVenmo(dataState.venmoUsername.length >= 5);
	}, [dataState.venmoUsername]);

	const setOrderTitle = (orderTitle: string): void =>
		setDataState(state => {
			state.orderTitle = orderTitle;
		});

	const setVenmoUsername = (venmoUsername: string): void =>
		setDataState(state => {
			state.venmoUsername = venmoUsername;
		});

	const addOrUpdateCharge = (charge: PartyCharge): void =>
		setDataState(state => {
			state.charges[charge.name] = charge;
		});

	const removeCharge = (charge: PartyCharge): void =>
		setDataState(state => {
			delete state.charges[charge.name];
		});

	const addOrUpdatePerson = (person: Person): void =>
		setDataState(state => {
			state.people[person.name] = person;
		});

	const reset = (): void => {
		setDataState({
			orderTitle: "",
			venmoUsername: "",
			people: {},
			charges: {}
		});
		// isInternalHistoryChange.current = false;
		// saveStateToUrl(dataState, isInternalHistoryChange);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-primary-100 to-neutral-100">
			<Nav onReset={reset} />

			<main className="space-y-8 px-4 pb-20 pt-16 sm:pt-32">
				<Section>
					<OrderHeading
						orderTitle={dataState.orderTitle}
						venmoUsername={dataState.venmoUsername}
						onOrderTitleChange={setOrderTitle}
						onVenmoUsernameChange={setVenmoUsername}
					/>
				</Section>

				<Section>
					<Divider />
				</Section>

				<Section>
					<div className="flex flex-col gap-6">
						<ItemHeading
							title="Party Charges"
							subtitle="e.g., delivery or service fees to be split evenly"
						/>

						<ItemEditor
							trigger={
								<Button className="w-fit" size="sm" startIcon={<TbPlus />}>
									Add a charge
								</Button>
							}
							item={createPartyCharge}
							isEdit={false}
							onSubmit={addOrUpdateCharge}
							suggestions={["Tip", "Service", "Delivery"]}
						/>

						{!isEmptyTree(dataState.charges) && (
							<div className="flex flex-row-reverse flex-wrap justify-end gap-2">
								{Object.values(dataState.charges).map(charge => (
									<ItemTag
										title={
											"This is a party charge that is split amongst all orders"
										}
										item={charge}
										key={charge.name}
										onRemove={removeCharge}
										onSubmit={item =>
											setDataState(state => {
												delete state.charges[charge.name];
												state.charges[item.name] = item;
											})
										}
									/>
								))}
							</div>
						)}
					</div>
				</Section>

				<Section>
					<Divider />
				</Section>

				<Section>
					<div className="flex flex-col gap-6">
						<ItemEditor
							trigger={
								<Button className="w-fit" size="sm" startIcon={<TbPlus />}>
									Add an item
								</Button>
							}
							item={createPerson}
							isEdit={false}
							onSubmit={addOrUpdatePerson}
						/>

						{isEmptyTree(dataState.people) ? (
							<Card className="mt-8 py-2">
								<CardBody className="text-sm text-foreground/80">
									Add items to get started
								</CardBody>
							</Card>
						) : (
							<PeopleTable
								state={dataState}
								onStateChange={setDataState}
								hasVenmo={hasVenmo}
							/>
						)}
					</div>
				</Section>
			</main>

			{/* <Footer /> */}
		</div>
	);
};

export default App;
