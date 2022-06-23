import { BoxProps, Center, ChakraProps, forwardRef } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Container } from "./Container";

interface SectionProps extends ChakraProps {
	full?: boolean;
	children?: ReactNode;
}

export const Section = forwardRef<BoxProps, "div">(
	({ full, children, ...rest }: SectionProps, ref) => (
		<Center as="section" width="100%" ref={ref} {...rest}>
			{full ? children : <Container>{children}</Container>}
		</Center>
	)
);
