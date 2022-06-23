import { PartyCharge } from "./PartyCharge";
import { Person } from "./Person";
import { ItemRecord } from "./types";

export interface SerializableState {
	orderTitle: string;
	venmoUsername: string;
	people: ItemRecord<Person>;
	charges: ItemRecord<PartyCharge>;
}
