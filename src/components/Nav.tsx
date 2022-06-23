import { ButtonGroup, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import {
	TbArrowBackUp,
	TbArrowForwardUp,
	TbLink,
	TbNewSection,
	TbShare
} from "react-icons/tb";

import { Emoji } from "./Emoji";
import { ToolbarAction } from "./ToolbarAction";

import { goBack, goForward } from "../utilities/history";
import { copyUrl, share } from "../utilities/sharing";
import { useToast } from "../utilities/toasts";

interface NavProps {
	onReset: React.MouseEventHandler<HTMLButtonElement>;
}

export const Nav = (props: NavProps): JSX.Element => {
	const toast = useToast();

	return (
		<VStack
			as="header"
			align="flex-start"
			position="fixed"
			top={0}
			width="100%"
			spacing={0}
			zIndex={100}
			backgroundColor="teal.600"
			color="white">
			<Flex as="nav">
				<HStack
					fontSize="3xl"
					fontWeight="light"
					marginLeft={2}
					userSelect="none">
					<Emoji as="div" text="🍔" label="burger" />
					<Text as="div" marginLeft={2}>
						lunch calculator
					</Text>
				</HStack>
			</Flex>

			<HStack
				width="100%"
				justify="center"
				backgroundColor="teal.50"
				marginTop={0}>
				<ButtonGroup variant="ghost" colorScheme="teal" isAttached>
					<ToolbarAction
						name="New"
						icon={TbNewSection}
						onClick={props.onReset}
					/>
					<ToolbarAction name="Undo" icon={TbArrowBackUp} onClick={goBack} />
					<ToolbarAction
						name="Redo"
						icon={TbArrowForwardUp}
						onClick={goForward}
					/>
					<ToolbarAction
						name="Copy link"
						icon={TbLink}
						onClick={() => copyUrl(toast)}
					/>
					<ToolbarAction
						name="Share"
						icon={TbShare}
						onClick={() => share(toast)}
					/>
				</ButtonGroup>
			</HStack>
		</VStack>
	);
};
