import type { ComponentPropsWithRef } from "react";

import type { WithClassNames } from "@/lib/cx";
import { cx } from "@/lib/cx";

type AppContainerProps = WithClassNames<"root", ComponentPropsWithRef<"div">>;

export const AppContainer: React.FC<AppContainerProps> = ({
	children,
	className,
	classNames,
	ref,
	...props
}) => (
	<div
		{...props}
		ref={ref}
		className={cx(
			"from-primary-100 min-h-screen bg-gradient-to-b to-neutral-100",
			className,
			classNames?.root
		)}>
		{children}
	</div>
);
