import {
	Alert,
	AlertDescription,
	Box,
	Button,
	Divider,
	Flex,
	Stack
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { useImmer } from "use-immer";

import { Footer } from "@/components/Footer";
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
import { useToast } from "@/utilities/toasts";
import Head from "next/head";

const App = () => {
	const [dataState, setDataState] = useImmer<SerializableState>({
		orderTitle: "",
		venmoUsername: "",
		people: {},
		charges: {}
	});

	const [hasVenmo, setHasVenmo] = useState(false);

	const isInternalHistoryChange = useRef(false);

	const toast = useToast();

	const updateStateFromUrl = (event?: PopStateEvent) => {
		console.log("updateState", event);
		if (event != null) {
			event?.preventDefault();
			// flag this event so the state changes don't clash
			// (which causes forward / "redo" to break)
			isInternalHistoryChange.current = true;
		}

		const data = getStateFromUrl(toast);

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
		<Box justifyItems={"center"} minHeight="100vh" backgroundColor="teal.600">
			<Head>
				<title>mealtide</title>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				<meta name="theme-color" content="#00947e" />
				{/* <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
				<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" /> */}
			</Head>

			<Nav onReset={reset} />

			<Stack
				as="main"
				paddingTop={32}
				paddingBottom={20}
				spacing={8}
				backgroundColor="white">
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
					<Stack spacing={6}>
						<ItemHeading
							title="Party Charges"
							subtitle="e.g., delivery or service fees to be split evenly"
						/>

						<ItemEditor
							trigger={
								<Button size="sm" leftIcon={<TbPlus />}>
									Add a charge
								</Button>
							}
							item={createPartyCharge}
							isEdit={false}
							onSubmit={addOrUpdateCharge}
							suggestions={["Tip", "Service", "Delivery"]}
						/>

						{!isEmptyTree(dataState.charges) && (
							<Flex
								direction="row-reverse"
								justifyContent="start"
								wrap="wrap"
								gap={2}>
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
							</Flex>
						)}
					</Stack>
				</Section>

				<Section>
					<Divider />
				</Section>

				<Section>
					<Stack direction="column" spacing={6}>
						<ItemEditor
							trigger={
								<Button size="sm" leftIcon={<TbPlus />}>
									Add an item
								</Button>
							}
							item={createPerson}
							isEdit={false}
							onSubmit={addOrUpdatePerson}
						/>

						{isEmptyTree(dataState.people) ? (
							<Alert
								marginTop={8}
								paddingY={6}
								backgroundColor="teal.50"
								color="teal.700">
								<AlertDescription>Add items to get started</AlertDescription>
							</Alert>
						) : (
							<PeopleTable
								state={dataState}
								onStateChange={setDataState}
								hasVenmo={hasVenmo}
							/>
						)}
					</Stack>
				</Section>
			</Stack>

			<Footer />
		</Box>
	);
};

export default App;
