import { ItemRecord } from "../utilities";
import { PartyCharge } from "./PartyCharge";
import { Person } from "./Person";

export interface SerializableState {
	orderTitle: string;
	venmoUsername: string;
	people: ItemRecord<Person>;
	charges: ItemRecord<PartyCharge>;
}
