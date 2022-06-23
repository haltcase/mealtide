import { ChakraProps, forwardRef, Text, Tooltip } from "@chakra-ui/react";

interface EmojiProps extends ChakraProps {
	text: string;
	label: string;
	showTooltip?: boolean;
}

export const Emoji = forwardRef(
	({ label, text, showTooltip, ...rest }: EmojiProps, ref): JSX.Element => {
		const child = (
			<Text as="span" role="img" aria-label={label} ref={ref} {...rest}>
				{text}
			</Text>
		);

		return showTooltip ? <Tooltip label={label}>{child}</Tooltip> : child;
	}
);
