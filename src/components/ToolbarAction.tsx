import { Button, Tooltip } from "@nextui-org/react";
import type { MouseEventHandler } from "react";
import type { IconType } from "react-icons";

interface ToolbarActionProps {
	name: string;
	icon: IconType;
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export const ToolbarAction = (props: ToolbarActionProps): JSX.Element => {
	return (
		<Tooltip className="sm:hidden" content={props.name}>
			<Button
				className="text-md mx-0 h-full px-2 data-[hover=true]:bg-transparent max-sm:w-full sm:mx-2"
				startContent={
					<div className="h-5/6 sm:h-1/2">
						<props.icon size="100%" />
					</div>
				}
				onClick={props.onClick}
			>
				<span className="hidden font-semibold sm:inline">{props.name}</span>
			</Button>
		</Tooltip>
	);
};
