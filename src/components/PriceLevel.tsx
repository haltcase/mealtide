import { ChakraProps, Flex, forwardRef, Spacer, Text } from "@chakra-ui/react";

import type { DomNumber } from "../models/types";
import { toDoubleString } from "../utilities/calc";

interface PriceLevelProps extends ChakraProps {
	price: DomNumber;
}

export const PriceLevel = forwardRef(
	({ price, ...rest }: PriceLevelProps, ref) => (
		<Flex ref={ref} {...rest}>
			<Text as="span">$</Text>
			<Spacer />
			<Text as="span">{toDoubleString(price)}</Text>
		</Flex>
	)
);
