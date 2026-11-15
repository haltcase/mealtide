import { Tooltip } from "@mantine/core";

interface EmojiProps {
	text: string;
	label: string;
	showTooltip?: boolean;
}

export const Emoji: React.FC<EmojiProps> = ({ label, text, showTooltip = false }) => {
	const child = (
		// oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- A Unicode emoji is text with an image label and no image source.
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
