import React, { useEffect, useRef, useState } from "react";

import {
	IconArrowBackUp,
	IconArrowForwardUp,
	IconClearAll,
	IconCurrencyDollar,
	IconPencil,
	IconPlus,
	IconLink,
	IconTag,
	IconTrash,
	IconUser
} from "@tabler/icons";

import { toast, ToastType } from "bulma-toast";
import { compressToURI, decompressFromURI } from "lz-ts";

import "./styles.css";

import { Emoji } from "./components/Emoji";
import { ItemHeading } from "./components/ItemHeading";
import { PriceLevel } from "./components/PriceLevel";
import { useOnce } from "./hooks/useOnce";
import { SerializableState } from "./models/SerializableState";
import { PartyCharge, createPartyCharge } from "./models/PartyCharge";
import { Person, createPerson } from "./models/Person";
import {
	capitalize,
	getTax,
	isEmptyTree,
	isItemValid,
	parseFloat,
	toDoubleString
} from "./utilities";

import type { ItemRecord } from "./utilities";

const getTotalCharges = (items: ItemRecord): number =>
	Object.values(items).reduce(
		(previous, current) => previous + parseFloat(current.amount),
		0
	);

const getChargeSplit = (data: SerializableState): number =>
	getTotalCharges(data.charges) / Object.keys(data.people).length;

const showToast = (message: string, type: ToastType = "is-success"): void =>
	toast({
		type,
		message,
		position: "top-right",
		// @ts-ignore - bulma-toast's definitions are missing these offset properties
		offsetTop: "50px",
		offsetRight: "10px"
	});

const getStateFromUrl = (): SerializableState | null => {
	console.log("getStateFromUrl");
	const params = new URLSearchParams(document.location.search);

	if (params.has("save")) {
		try {
			return JSON.parse(decompressFromURI(params.get("save") ?? ""));
		} catch (error) {
			showToast("Could not load data from URL", "is-danger");
		}
	}

	return null;
};

const saveStateToUrl = (
	data: SerializableState,
	isInternalRef: React.MutableRefObject<boolean>
): void => {
	console.log("saveStateToUrl", data, isInternalRef.current);
	// prevent history changes if this is an internal event
	// this maintains forward/backward state
	if (isInternalRef.current) {
		isInternalRef.current = false;
		return;
	}

	const previousPath = "/" + window.location.search;
	let newPath = window.location.pathname;

	if (!isEmptyTree(data)) {
		const params = new URLSearchParams();
		params.set("save", compressToURI(JSON.stringify(data)));
		newPath += "?" + params.toString();
	}

	if (newPath !== previousPath) {
		window.history.pushState(data, "", newPath);
	}
};

const App = () => {
	const [dataState, setDataState] = useState<SerializableState>({
		people: {},
		charges: {}
	});

	const [isEditingPerson, setIsEditingPerson] = useState(false);
	const [isEditingCharge, setIsEditingCharge] = useState(false);
	const [isPersonValid, setIsPersonValid] = useState(false);
	const [isChargeValid, setIsChargeValid] = useState(false);
	const [newCharge, setNewCharge] = useState<PartyCharge>(createPartyCharge());
	const [newPerson, setNewPerson] = useState<Person>(createPerson());

	const personNameInput = useRef<HTMLInputElement>(null);
	const chargeNameInput = useRef<HTMLInputElement>(null);
	const isInternalHistoryChange = useRef(false);

	const updateState = (event?: PopStateEvent) => {
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
			people: data?.people ?? {},
			charges: data?.charges ?? {}
		});
	};

	// on initial render, load state in the URL if present
	useOnce(updateState);

	// whenever data changes, update the URL with the new serialized state
	useEffect(() => {
		console.log("data change");
		saveStateToUrl(dataState, isInternalHistoryChange);
	}, [dataState]);

	// listen for back button events and load state from the new location
	// this provides undo/redo capability
	useEffect(() => {
		window.addEventListener("popstate", updateState);

		return () => {
			window.removeEventListener("popstate", updateState);
		};
	});

	useEffect(() => {
		setIsPersonValid(isItemValid(newPerson));
	}, [newPerson]);

	useEffect(() => {
		setIsChargeValid(isItemValid(newCharge));
	}, [newCharge]);

	const addOrUpdateCharge = (charge: PartyCharge): void =>
		setDataState(state => ({
			...state,
			charges: {
				...state.charges,
				[charge.name]: charge
			}
		}));

	const removeCharge = (charge: PartyCharge): void => {
		const { [charge.name]: existing, ...others } = dataState.charges;
		setDataState(state => ({
			...state,
			charges: others
		}));
	};

	const addOrUpdatePerson = (person: Person): void =>
		setDataState(state => ({
			...state,
			people: {
				...state.people,
				[person.name]: person
			}
		}));

	const removePerson = (person: Person): void => {
		const { [person.name]: existing, ...others } = dataState.people;
		setDataState(state => ({
			...state,
			people: others
		}));
	};

	const submitPerson = (event?: React.SyntheticEvent): void => {
		if (!isPersonValid) {
			return;
		}

		addOrUpdatePerson(newPerson);
		setNewPerson(createPerson());
		setIsEditingPerson(false);
		personNameInput.current?.focus();
	};

	const submitCharge = (event?: React.SyntheticEvent): void => {
		if (!isChargeValid) {
			return;
		}

		addOrUpdateCharge(newCharge);
		setNewCharge(createPartyCharge());
		setIsEditingCharge(false);
		chargeNameInput.current?.focus();
	};

	const goBack = (): void => {
		window.history.back();
	};

	const goForward = (): void => {
		window.history.forward();
	};

	const reset = (): void => {
		setDataState({ people: {}, charges: {} });
		// isInternalHistoryChange.current = false;
		// saveStateToUrl(dataState, isInternalHistoryChange);
	};

	const copyUrl = (): void => {
		navigator.clipboard
			.writeText(document.location.toString())
			.then(() => showToast("Copied URL to clipboard"))
			.catch(() => showToast("Could not copy URL to clipboard", "is-danger"));
	};

	return (
		<div>
			<nav className="navbar has-background-primary-dark has-text-white-ter">
				<div className="navbar-brand">
					<Emoji
						text="🍔"
						label="burger"
						className="is-size-4 is-unselectable ml-5 mt-2"
					/>
					<span className="is-size-3 ml-2 has-text-weight-light">
						lunch calculator
					</span>
				</div>
				<div className="navbar-menu">
					<div className="navbar-start"></div>
					<div className="navbar-end"></div>
				</div>
			</nav>

			<div className="toolbar field has-addons is-justify-content-center has-background-primary-light mb-0">
				<p className="control has-tooltip-bottom" data-tooltip="Undo">
					<button
						className="button is-normal is-primary is-light is-borderless"
						onClick={goBack}>
						<span className="icon">
							<IconArrowBackUp size={12} />
						</span>
						<span className="text">Undo</span>
					</button>
				</p>
				<p className="control has-tooltip-bottom" data-tooltip="Redo">
					<button
						className="button is-normal is-primary is-light"
						onClick={goForward}>
						<span className="icon">
							<IconArrowForwardUp size={12} />
						</span>
						<span className="text">Redo</span>
					</button>
				</p>
				<p className="control has-tooltip-bottom" data-tooltip="Reset">
					<button
						className="button is-normal is-primary is-light"
						onClick={reset}>
						<span className="icon">
							<IconClearAll size={12} />
						</span>
						<span className="text">Reset</span>
					</button>
				</p>
				<p
					className="control has-tooltip-bottom"
					data-tooltip="Copy shareable link">
					<button
						className="button is-normal is-primary is-light"
						onClick={copyUrl}>
						<span className="icon">
							<IconLink size={12} />
						</span>
						<span className="text">Copy shareable link</span>
					</button>
				</p>
			</div>

			<main className="section has-background-white pt-4">
				<div className="container">
					<div className="columns">
						<section className="column">
							<ItemHeading title="Items" subtitle="i.e., the edible stuff" />

							<div className="field is-horizontal mt-3">
								<div className="field-body">
									<div className="field">
										<p className="control is-expanded has-icons-left has-icons-right">
											<input
												className="input"
												type="text"
												placeholder="Who ordered this item?"
												ref={personNameInput}
												value={newPerson.name}
												onKeyDown={e => e.key === "Enter" && submitPerson()}
												onChange={e =>
													setNewPerson({
														...newPerson,
														name: capitalize(e.target.value)
													})
												}
											/>

											<span className="icon is-small is-left">
												<IconUser size={22} className="" />
											</span>
										</p>
									</div>
									<div className="field">
										<p className="control is-expanded has-icons-left">
											<input
												className="input"
												type="number"
												placeholder="Amount"
												step="0.01"
												value={newPerson.amount}
												onKeyDown={e => e.key === "Enter" && submitPerson()}
												onChange={e =>
													setNewPerson({
														...newPerson,
														amount: parseFloat(e.target.value)
													})
												}
											/>
											<span className="icon is-small is-left">
												<IconCurrencyDollar size={22} className="" />
											</span>
										</p>
									</div>
								</div>
							</div>

							<button
								className="button is-info"
								onClick={submitPerson}
								disabled={!isPersonValid}>
								<span className="icon">
									<IconPlus size={18} className="" />
								</span>
								<span>{isEditingPerson ? "Update" : "Add"} item</span>
							</button>
						</section>

						<section className="column">
							<ItemHeading
								title="Party Charges"
								subtitle="e.g., delivery or service fees"
							/>

							<div className="field is-horizontal mt-3">
								<div className="field-body">
									<div className="field">
										<p className="control is-expanded has-icons-left has-icons-right">
											<input
												className="input"
												type="text"
												placeholder="What is this charge for?"
												ref={chargeNameInput}
												value={newCharge.name}
												onKeyDown={e => e.key === "Enter" && submitCharge()}
												onChange={e =>
													setNewCharge({
														...newCharge,
														name: capitalize(e.target.value)
													})
												}
											/>

											<span className="icon is-small is-left">
												<IconTag size={22} className="" />
											</span>
										</p>
									</div>
									<div className="field">
										<p className="control is-expanded has-icons-left">
											<input
												className="input"
												type="number"
												placeholder="Amount"
												step="0.01"
												value={newCharge.amount}
												onKeyDown={e => e.key === "Enter" && submitCharge()}
												onChange={e =>
													setNewCharge({
														...newCharge,
														amount: e.target.value
													})
												}
											/>
											<span className="icon is-small is-left">
												<IconCurrencyDollar size={22} className="" />
											</span>
										</p>
									</div>
								</div>
							</div>

							<button
								className="button is-info"
								onClick={submitCharge}
								disabled={!isChargeValid}>
								<span className="icon">
									<IconPlus size={18} className="" />
								</span>
								<span>{isEditingCharge ? "Update" : "Add"} party charge</span>
							</button>
						</section>
					</div>

					{Object.keys(dataState.charges).length > 0 && (
						<div className="field is-grouped is-grouped-multiline my-5">
							{Object.values(dataState.charges).map((charge, i) => (
								<div className="control" key={i}>
									<div className="tags are-medium has-addons">
										<span
											className="tag is-info has-tooltip-right"
											data-tooltip={
												"This is a party charge that\nis split amongst all orders"
											}>{`$${toDoubleString(charge.amount)}`}</span>
										<span className="tag">{charge.name}</span>
										<span
											className="tag is-info is-light"
											data-tooltip="Edit this item"
											onClick={() => {
												setNewCharge(charge);
												setIsEditingCharge(true);
											}}>
											<span className="icon is-info is-light">
												<IconPencil size={18} className="" />
											</span>
										</span>
										<span
											className="tag is-danger is-light"
											data-tooltip="Remove this item"
											onClick={() => removeCharge(charge)}>
											<span className="icon is-danger is-light">
												<IconTrash size={18} className="" />
											</span>
										</span>
									</div>
								</div>
							))}
						</div>
					)}

					{Object.keys(dataState.people).length === 0 ? (
						<div className="notification is-primary is-light">
							Enter items to get started
						</div>
					) : (
						<table className="table is-bordered is-striped is-hoverable is-fullwidth">
							<thead>
								<tr>
									<th>Item</th>
									<th className="has-text-right" title="Price including tax">
										Total
									</th>
								</tr>
							</thead>

							<tbody>
								{Object.values(dataState.people).map((person, i) => (
									<tr key={i}>
										<td className="is-vcentered">
											<div className="level">
												<div className="level-left">{person.name}</div>
												<div className="level-right">
													<div className="field has-addons">
														<p className="control">
															<button
																className="button is-small is-danger is-light"
																data-tooltip="Remove this item"
																onClick={() => removePerson(person)}>
																<IconTrash size={18} className="" />
															</button>
														</p>

														<p className="control">
															<button
																className="button is-small is-info is-light"
																data-tooltip="Edit this item"
																onClick={() => {
																	setNewPerson(person);
																	setIsEditingPerson(true);
																}}>
																<IconPencil size={18} className="" />
															</button>
														</p>
													</div>
												</div>
											</div>
										</td>

										<td
											className="is-vcentered has-text-weight-bold has-text-primary-dark has-text-right has-tooltip-left has-tooltip-text-left"
											data-tooltip={[
												`Base amount of $${toDoubleString(person.amount)}`,
												"Plus:",
												`\t$${toDoubleString(
													getTax(parseFloat(person.amount))
												)} in tax`,
												`\t$${toDoubleString(
													getChargeSplit(dataState)
												)} from fees`
											].join("\n")}>
											<PriceLevel
												price={
													parseFloat(person.amount) +
													getTax(parseFloat(person.amount)) +
													getChargeSplit(dataState)
												}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</main>

			<footer className="footer has-text-centered has-background-primary-dark has-text-white-ter">
				Created by Bo Lingen, 2022
				<br /> <br />
				Powered by <Emoji
					text="🍩"
					label="donuts"
					data-tooltip="donuts"
				/> and <Emoji text="☕" label="coffee" data-tooltip="coffee" />
				<br />
				... and also{" "}
				<Emoji text="🔌" label="electricity" data-tooltip="electricity" />
			</footer>
		</div>
	);
};

export default App;
