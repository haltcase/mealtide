import type { ComponentPropsWithRef } from "react";
import { forwardRef } from "react";

import type { WithClassNames } from "@/lib/cx";
import { cx } from "@/lib/cx";

type AppContainerProps = WithClassNames<"root", ComponentPropsWithRef<"div">>;

export const AppContainer: React.FC<AppContainerProps> = forwardRef(
	({ children, className, classNames = {} }, ref) => {
		return (
			<div
				ref={ref}
				className={cx(
					"min-h-screen bg-gradient-to-b from-primary-100 to-neutral-100",
					className,
					classNames.root
				)}
			>
				{children}
			</div>
		);
	}
);
