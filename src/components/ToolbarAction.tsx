import { Button, Text, Tooltip } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";
import type { IconType } from "react-icons";

interface ToolbarActionProps {
	name: string;
	icon: IconType;
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export const ToolbarAction = (props: ToolbarActionProps): JSX.Element => {
	return (
		<Tooltip label={props.name} display={{ md: "none" }}>
			<Button leftIcon={<props.icon size={20} />} onClick={props.onClick}>
				<Text as="span" display={{ base: "none", md: "inline" }}>
					{props.name}
				</Text>
			</Button>
		</Tooltip>
	);
};
