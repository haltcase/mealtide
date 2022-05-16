import { getDataAttributes } from "../utilities";

interface EmojiProps {
	text: string;
	label: string;
	className?: string;
}

export const Emoji = (props: EmojiProps): JSX.Element => (
	<span
		className={props.className ?? ""}
		role="img"
		aria-label={props.label}
		{...getDataAttributes(props)}>
		{props.text}
	</span>
);
