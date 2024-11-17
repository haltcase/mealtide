import { Tooltip } from "@mantine/core";

interface EmojiProps {
	text: string;
	label: string;
	showTooltip?: boolean;
}

export const Emoji: React.FC<EmojiProps> = ({
	label,
	text,
	showTooltip = false
}) => {
	const child = (
		<span role="img" aria-label={label}>
			{text}
		</span>
	);

	return showTooltip ? (
		<Tooltip label={label} withArrow>
			{child}
		</Tooltip>
	) : (
		child
	);
};
