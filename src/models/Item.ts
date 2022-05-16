import type { DomNumber } from "../utilities";

export interface Item {
  type: "Person" | "PartyCharge";
  name: string;
  amount: DomNumber;
}
