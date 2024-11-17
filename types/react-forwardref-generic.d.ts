declare namespace React {
	// eslint-disable-next-line @typescript-eslint/ban-types
	export function forwardRef<T, P = {}>(
		render: (props: P, ref: Ref<T>) => ReactNode | null
	): (props: P & RefAttributes<T>) => ReactNode | null;

	export * from "react";
}
