import type { Item } from "./Item";

export type DomNumber = number | string | undefined;

export type ItemRecord<T extends Item = Item> = Record<string, T>;
