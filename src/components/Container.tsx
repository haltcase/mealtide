import { Box, ChakraProps, forwardRef } from "@chakra-ui/react";
import { ReactNode } from "react";

interface ContainerProps extends ChakraProps {
	children?: ReactNode;
}

export const Container = forwardRef(
	({ children, ...rest }: ContainerProps, ref) => (
		<Box
			width="full"
			marginX="auto"
			maxWidth={{
				base: "90%",
				md: "80%"
			}}
			ref={ref}
			{...rest}>
			{children}
		</Box>
	)
);
