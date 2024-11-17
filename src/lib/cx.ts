import type { ClassNameValue } from "tailwind-merge";
import { twMerge } from "tailwind-merge";

export type WithClassNames<
	TNames extends string = string,
	TProps = unknown
> = TProps & {
	className?: string;
	classNames?: {
		[TName in TNames]+?: ClassNameValue;
	};
};

export const cx = (
	...parameters: Parameters<typeof twMerge>
): ReturnType<typeof twMerge> => twMerge(...parameters);
