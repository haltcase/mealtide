import type { PropsWithChildren } from "react";

interface SectionProps extends PropsWithChildren {
	full?: boolean;
}

export const Section = ({ children }: SectionProps) => (
	<section className="container mx-auto max-w-6xl">{children}</section>
);
