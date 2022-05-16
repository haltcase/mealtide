import type { DomNumber } from "../utilities";
import type { Item } from "./Item";

export interface Person extends Item {
  type: "Person";
}

export const createPerson = (
  name: string = "",
  amount: DomNumber = ""
): Person => ({
  name,
  amount,
  type: "Person"
});
