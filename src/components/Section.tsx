import type { PropsWithChildren } from "react";

import { cx, type WithClassNames } from "@/lib/cx";

interface SectionProps extends WithClassNames<"root", PropsWithChildren> {
	full?: boolean;
}

export const Section: React.FC<SectionProps> = ({
	children,
	className,
	classNames = {}
}) => (
	<section
		className={cx("container mx-auto max-w-6xl", className, classNames.root)}
	>
		{children}
	</section>
);
