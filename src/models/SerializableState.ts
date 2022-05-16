import { ItemRecord } from "../utilities";
import { PartyCharge } from "./PartyCharge";
import { Person } from "./Person";

export interface SerializableState {
	people: ItemRecord<Person>;
	charges: ItemRecord<PartyCharge>;
}
