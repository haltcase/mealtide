import type { PartyCharge } from "./PartyCharge";
import type { Person } from "./Person";
import type { ItemRecord } from "./types";

export interface SerializableState {
	orderTitle: string;
	venmoUsername: string;
	people: ItemRecord<Person>;
	charges: ItemRecord<PartyCharge>;
}
