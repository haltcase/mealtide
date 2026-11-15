import type { Item } from "./item";

export type DomNumber = number | string | undefined;

export type ItemMap<T extends Item = Item> = Map<string, T>;
