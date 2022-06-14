import { useEffect, useRef, useState } from "react";
import type { MutableRefObject, SyntheticEvent } from "react";
import { produce } from "immer";
import { useImmer } from "use-immer";

import {
	IconArrowBackUp,
	IconArrowForwardUp,
	IconNewSection,
	IconCurrencyDollar,
	IconPencil,
	IconPlus,
	IconLink,
	IconTag,
	IconTrash,
	IconUser,
	IconShare,
	IconBox,
	IconCheck,
	IconX,
	IconAt,
	IconNote
} from "@tabler/icons";

import { Venmo } from "@icons-pack/react-simple-icons";

import { toast, ToastType } from "bulma-toast";
import { compressToURI, decompressFromURI } from "lz-ts";

import "./styles.css";

import { Emoji } from "./components/Emoji";
import { ItemHeading } from "./components/ItemHeading";
import { PriceLevel } from "./components/PriceLevel";
import { ToolbarAction } from "./components/ToolbarAction";
import { useOnce } from "./hooks/useOnce";
import { SerializableState } from "./models/SerializableState";
import { Addon, createAddon } from "./models/Addon";
import { PartyCharge, createPartyCharge } from "./models/PartyCharge";
import { Person, createPerson } from "./models/Person";
import {
	capitalize,
	isEmptyTree,
	isItemValid,
	parseFloat,
	toDoubleString,
	getPriceBreakdown,
	getTotalPersonCharges,
	ItemRecord
} from "./utilities";

import { getPaymentUrl } from "./venmo";

const serializationKey = "save";

const showToast = (message: string, type: ToastType = "is-success"): void =>
	toast({
		type,
		message,
		position: "top-right",
		// @ts-expect-error - bulma-toast's definitions are missing these offset properties
		offsetTop: "50px",
		offsetRight: "10px"
	});

const getStateFromUrl = (): SerializableState | null => {
	console.log("getStateFromUrl");
	const params = new URLSearchParams(document.location.search);

	if (params.has(serializationKey)) {
		try {
			return JSON.parse(decompressFromURI(params.get(serializationKey) ?? ""));
		} catch (error) {
			showToast("Could not load data from URL", "is-danger");
		}
	}

	return null;
};

const saveStateToUrl = (
	data: SerializableState,
	isInternalRef: MutableRefObject<boolean>
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
		params.set(serializationKey, compressToURI(JSON.stringify(data)));
		newPath += "?" + params.toString();
	}

	if (newPath !== previousPath) {
		window.history.pushState(data, "", newPath);
	}
};

const App = () => {
	const [dataState, setDataState] = useImmer<SerializableState>({
		orderTitle: "",
		venmoUsername: "",
		people: {},
		charges: {}
	});

	const [hasVenmo, setHasVenmo] = useState(false);
	const [isEditingPerson, setIsEditingPerson] = useState(false);
	const [isEditingCharge, setIsEditingCharge] = useState(false);
	const [isPersonValid, setIsPersonValid] = useState(false);
	const [isChargeValid, setIsChargeValid] = useState(false);
	const [newCharge, setNewCharge] = useImmer<PartyCharge>(createPartyCharge());
	const [newPerson, setNewPerson] = useImmer<Person>(createPerson());

	const [addonMap, setAddonEditorMap] = useImmer<ItemRecord<Addon>>({});

	const personNameInput = useRef<HTMLInputElement>(null);
	const personAmountInput = useRef<HTMLInputElement>(null);
	const chargeNameInput = useRef<HTMLInputElement>(null);
	const chargeAmountInput = useRef<HTMLInputElement>(null);
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
			venmoUsername: data?.venmoUsername ?? "",
			orderTitle: data?.orderTitle ?? "",
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

	const removePerson = (person: Person): void =>
		setDataState(state => {
			delete state.people[person.name];
		});

	const removeAddon = (person: Person, addon: Addon): void =>
		setDataState(state => {
			delete state.people[person.name].subitems[addon.name];
		});

	const setAddonEditor = (
		person: Person,
		addon: ((addon: Addon) => Addon | null) | null
	) => {
		if (addon == null) {
			setAddonEditorMap(state => {
				delete state[person.name];
			});
		} else {
			setAddonEditorMap(state => {
				const newValue = addon(state[person.name]);
				if (newValue == null) {
					delete state[person.name];
				} else {
					state[person.name] = newValue;
				}
			});
		}
	};

	const submitPerson = (_event?: SyntheticEvent): void => {
		if (!isPersonValid) {
			personAmountInput.current?.focus();
			return;
		}

		addOrUpdatePerson(newPerson);
		setNewPerson(createPerson());
		setIsEditingPerson(false);
		personNameInput.current?.focus();
	};

	const submitCharge = (_event?: SyntheticEvent): void => {
		if (!isChargeValid) {
			chargeAmountInput.current?.focus();
			return;
		}

		addOrUpdateCharge(newCharge);
		setNewCharge(createPartyCharge());
		setIsEditingCharge(false);
		chargeNameInput.current?.focus();
	};

	const submitAddon = (person: Person, addon: Addon): void => {
		addOrUpdatePerson(
			produce(person, person => {
				person.subitems[addon.name] = addon;
			})
		);

		setAddonEditor(person, _ => null);
	};

	const goBack = (): void => {
		window.history.back();
	};

	const goForward = (): void => {
		window.history.forward();
	};

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

	const copyUrl = (): void => {
		navigator.clipboard
			.writeText(document.location.toString())
			.then(() => showToast("Copied URL to clipboard"))
			.catch(() => showToast("Could not copy URL to clipboard", "is-danger"));
	};

	const share = () => {
		if (!navigator.share) {
			showToast("Your browser doesn't support sharing content", "is-danger");
			return;
		}

		const content = {
			title: `Lunch Order for ${new Date().toLocaleDateString()}`,
			text: "See this lunch order to find out your total",
			url: document.location.toString()
		};

		navigator
			.share(content)
			.then(() => showToast("Shared"))
			.catch(() => showToast("Failed to share", "is-danger"));
	};

	return (
		<div>
			<nav className="navbar is-fixed-top has-background-primary-dark has-text-white-ter">
				<div className="navbar-brand">
					<Emoji
						text="🍔"
						label="burger"
						className="is-size-4 is-unselectable ml-5 mt-2"
					/>
					<span className="is-size-3 ml-2 is-unselectable has-text-weight-light">
						lunch calculator
					</span>
				</div>
				<div className="navbar-menu">
					<div className="navbar-start"></div>
					<div className="navbar-end"></div>
				</div>

				<div className="toolbar field has-addons is-justify-content-center has-background-primary-light mb-0">
					<ToolbarAction name="New" icon={IconNewSection} onClick={reset} />
					<ToolbarAction name="Undo" icon={IconArrowBackUp} onClick={goBack} />
					<ToolbarAction
						name="Redo"
						icon={IconArrowForwardUp}
						onClick={goForward}
					/>
					<ToolbarAction name="Copy link" icon={IconLink} onClick={copyUrl} />
					<ToolbarAction name="Share" icon={IconShare} onClick={share} />
				</div>
			</nav>

			<main className="section has-background-white mt-5">
				<div className="container">
					<div className="columns is-centered">
						<section className="column is-three-quarters-desktop">
							<div className="field is-horizontal mt-3">
								<div className="field-body">
									<div className="field has-addons">
										<p className="control">
											<button className="button is-static" tabIndex={-1}>
												<IconNote size={22} className="" />
											</button>
										</p>
										<p className="control is-expanded">
											<input
												className="input"
												type="text"
												placeholder="What are we getting?"
												value={dataState.orderTitle}
												onChange={e =>
													setOrderTitle(capitalize(e.target.value))
												}
											/>
										</p>
									</div>
									<div className="field has-addons">
										<p className="control">
											<button className="button is-static" tabIndex={-1}>
												<IconAt size={22} className="" />
											</button>
										</p>
										<p className="control is-expanded">
											<input
												className="input"
												type="text"
												placeholder="Username"
												value={dataState.venmoUsername}
												onKeyDown={e =>
													e.key === "Enter" && chargeNameInput.current?.focus()
												}
												onChange={e => setVenmoUsername(e.target.value)}
											/>
										</p>
										<p className="control">
											<button className="button is-static" tabIndex={-1}>
												<Venmo size={48} />
											</button>
										</p>
									</div>
								</div>
							</div>
						</section>
					</div>

					<div className="columns is-centered mb-0">
						<section className="column is-three-quarters-desktop">
							<div className="columns is-centered mb-0">
								<section className="column is-three-quarters-desktop">
									<hr className="has-background-grey-lighter" />
								</section>
							</div>

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
													setNewCharge(state => {
														state.name = capitalize(e.target.value);
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
												ref={chargeAmountInput}
												value={newCharge.amount}
												onKeyDown={e => e.key === "Enter" && submitCharge()}
												onChange={e =>
													setNewCharge(state => {
														state.amount = e.target.value;
													})
												}
											/>
											<span className="icon is-small is-left">
												<IconCurrencyDollar size={22} className="" />
											</span>
										</p>
									</div>
									<div className="is-info is-fullwidth-mobile">
										<button
											className="button is-info is-fullwidth"
											onClick={submitCharge}
											disabled={!isChargeValid}>
											<span className="icon">
												<IconPlus size={18} className="" />
											</span>
											<span>
												{isEditingCharge ? "Update" : "Add"} party charge
											</span>
										</button>
									</div>
								</div>
							</div>
						</section>
					</div>

					<div className="columns is-centered mt-0">
						<section className="column is-three-quarters-desktop">
							{Object.keys(dataState.charges).length > 0 && (
								<div className="field is-grouped is-grouped-multiline mt-3">
									{Object.values(dataState.charges)
										.reverse()
										.map((charge, i) => (
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

							<div className="columns is-centered">
								<div className="column is-three-quarters-desktop">
									<hr className="has-background-grey-lighter" />
								</div>
							</div>

							<div className="field is-horizontal">
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
													setNewPerson(state => {
														state.name = capitalize(e.target.value);
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
												ref={personAmountInput}
												value={newPerson.amount}
												onKeyDown={e => e.key === "Enter" && submitPerson()}
												onChange={e =>
													setNewPerson(state => {
														state.amount = parseFloat(e.target.value);
													})
												}
											/>
											<span className="icon is-small is-left">
												<IconCurrencyDollar size={22} className="" />
											</span>
										</p>
									</div>

									<div className="is-fullwidth-mobile">
										<button
											className="button is-info is-fullwidth"
											onClick={submitPerson}
											disabled={!isPersonValid}>
											<span className="icon">
												<IconPlus size={18} className="" />
											</span>
											<span>{isEditingPerson ? "Update" : "Add"} item</span>
										</button>
									</div>
								</div>
							</div>

							{Object.keys(dataState.people).length === 0 ? (
								<div className="notification is-primary is-light">
									Enter items to get started
								</div>
							) : (
								<table className="table is-bordered is-striped is-hoverable is-fullwidth">
									<thead>
										<tr>
											<th>Item</th>
											<th
												className="has-text-right"
												title="Price including tax">
												Total
											</th>
										</tr>
									</thead>

									<tbody>
										{Object.values(dataState.people)
											.reverse()
											.map((person, i) => (
												<tr key={i}>
													<td className="is-vcentered" width="75%">
														<div className="level">
															<div className="level-left">{person.name}</div>
															<div className="level-right">
																<div className="field has-addons">
																	<p className="control">
																		<button
																			className="button is-small is-primary is-light"
																			data-tooltip="Add more items"
																			onClick={() =>
																				setAddonEditor(person, _ =>
																					createAddon()
																				)
																			}>
																			<IconPlus size={18} className="" />
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

																	<p className="control">
																		<button
																			className="button is-small is-danger is-light"
																			data-tooltip="Remove this item"
																			onClick={() => removePerson(person)}>
																			<IconTrash size={18} className="" />
																		</button>
																	</p>
																</div>
															</div>
														</div>

														{addonMap[person.name] != null && (
															<div className="field is-horizontal">
																<div className="field-body">
																	<div className="field">
																		<p className="control is-expanded has-icons-left">
																			<input
																				className="input is-small"
																				type="text"
																				placeholder="What is it?"
																				value={addonMap[person.name].name}
																				onChange={e =>
																					setAddonEditor(
																						person,
																						produce((current: Addon) => {
																							current.name = capitalize(
																								e.target.value
																							);
																						})
																					)
																				}
																			/>
																			<span className="icon is-small is-left">
																				<IconBox size={22} className="" />
																			</span>
																		</p>
																	</div>
																	<div className="field">
																		<p className="control is-expanded has-icons-left">
																			<input
																				className="input is-small"
																				type="number"
																				placeholder="Amount"
																				step="0.01"
																				value={addonMap[person.name].amount}
																				onKeyDown={e =>
																					e.key === "Enter" &&
																					submitAddon(
																						person,
																						addonMap[person.name]
																					)
																				}
																				onChange={e =>
																					setAddonEditor(
																						person,
																						produce((current: Addon) => {
																							current.amount = e.target.value;
																						})
																					)
																				}
																			/>
																			<span className="icon is-small is-left">
																				<IconCurrencyDollar
																					size={22}
																					className=""
																				/>
																			</span>
																		</p>
																	</div>
																	<div className="field has-addons is-narrow">
																		<p className="control">
																			<button
																				className="button is-small is-success is-light"
																				data-tooltip="Add"
																				onClick={() =>
																					submitAddon(
																						person,
																						addonMap[person.name]
																					)
																				}>
																				<IconCheck size={18} className="" />
																			</button>
																		</p>

																		<p className="control">
																			<button
																				className="button is-small is-danger is-light"
																				data-tooltip="Cancel"
																				onClick={() =>
																					setAddonEditor(person, null)
																				}>
																				<IconX size={18} className="" />
																			</button>
																		</p>
																	</div>
																</div>
															</div>
														)}

														{Object.keys(person.subitems).length > 0 && (
															<div className="field is-grouped is-grouped-multiline mt-3">
																{Object.values(person.subitems)
																	.reverse()
																	.map((addon, i) => (
																		<div className="control" key={i}>
																			<div className="tags are-medium has-addons">
																				<span className="tag is-info has-tooltip-right">{`$${toDoubleString(
																					addon.amount
																				)}`}</span>
																				<span className="tag">
																					{addon.name}
																				</span>
																				<span
																					className="tag is-info is-light"
																					data-tooltip="Edit this item"
																					onClick={() => {
																						setAddonEditor(person, _ => addon);
																					}}>
																					<span className="icon is-info is-light">
																						<IconPencil
																							size={18}
																							className=""
																						/>
																					</span>
																				</span>
																				<span
																					className="tag is-danger is-light"
																					data-tooltip="Remove this item"
																					onClick={() =>
																						removeAddon(person, addon)
																					}>
																					<span className="icon is-danger is-light">
																						<IconTrash size={18} className="" />
																					</span>
																				</span>
																			</div>
																		</div>
																	))}
															</div>
														)}
													</td>

													<td
														className="is-vcentered has-text-weight-bold has-text-primary-dark has-text-right has-tooltip-left has-tooltip-text-left"
														data-tooltip={getPriceBreakdown(dataState, person)}>
														<PriceLevel
															price={getTotalPersonCharges(dataState, person)}
														/>

														{hasVenmo && (
															<a
																href={getPaymentUrl(dataState, person)}
																target="_blank"
																rel="noreferrer">
																<button
																	className="button is-link is-fullwidth"
																	data-tooltip="Pay with Venmo">
																	<Venmo size={48} />
																</button>
															</a>
														)}
													</td>
												</tr>
											))}
									</tbody>
								</table>
							)}
						</section>
					</div>
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
