import type { Item } from "./Item";

export type DomNumber = number | string | undefined;

export type ItemMap<T extends Item = Item> = Map<string, T>;
