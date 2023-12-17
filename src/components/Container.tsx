import type { ReactNode } from "react";

interface ContainerProps {
	children?: ReactNode;
}

export const Container = ({ children }: ContainerProps) => (
	<div className="container max-w-full md:max-w-[80%]">{children}</div>
);
