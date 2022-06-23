import { Center, Text } from "@chakra-ui/react";

import { Emoji } from "./Emoji";

export const Footer = (): JSX.Element => (
	<Center
		as="footer"
		flexDirection="column"
		backgroundColor="teal.600"
		color="white"
		paddingTop={4}
		paddingBottom={24}>
		<Text>Created by Bo Lingen, 2022</Text>
		<Text>
			Powered by <Emoji text="🍩" label="donuts" showTooltip /> and{" "}
			<Emoji text="☕" label="coffee" showTooltip />
		</Text>
		<Text>
			... and also <Emoji text="🔌" label="electricity" showTooltip />
		</Text>
	</Center>
);
