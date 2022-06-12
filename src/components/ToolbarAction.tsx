import type { MouseEventHandler } from "react";
import type { TablerIcon } from "@tabler/icons";

interface ToolbarActionProps {
	name: string;
	icon: TablerIcon;
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export const ToolbarAction = (props: ToolbarActionProps): JSX.Element => {
	return (
		<p className="control has-tooltip-bottom" data-tooltip={props.name}>
			<button
				className="button is-normal is-primary is-light"
				onClick={props.onClick}>
				<span className="icon">
					<props.icon size={12} />
				</span>
				<span className="text">{props.name}</span>
			</button>
		</p>
	);
};
