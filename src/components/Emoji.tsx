import { Tooltip } from "@nextui-org/react";

interface EmojiProps {
	text: string;
	label: string;
	showTooltip?: boolean;
}

export const Emoji = ({
	label,
	text,
	showTooltip = false
}: EmojiProps): JSX.Element => {
	const child = (
		<span role="img" aria-label={label}>
			{text}
		</span>
	);

	return showTooltip ? (
		<Tooltip
			content={label}
			color="neutral"
			variant="flat"
			backdropVariant="blur"
			showArrow>
			{child}
		</Tooltip>
	) : (
		child
	);
};
