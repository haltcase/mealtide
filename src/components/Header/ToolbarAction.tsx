import type { ElementProps } from "@mantine/core";
import { Button, Tooltip } from "@mantine/core";
import type { IconType } from "react-icons";

interface ToolbarActionProps extends ElementProps<"button"> {
	name: string;
	icon: IconType;
}

export const ToolbarAction: React.FC<ToolbarActionProps> = ({
	name,
	icon: Icon,
	...rest
}) => {
	return (
		<Tooltip className="sm:hidden" label={name}>
			<Button
				classNames={{
					label: "line-clamp-1 h-auto font-semibold max-sm:hidden",
					section: "h-5/6 max-sm:mx-0 max-sm:h-4/6 sm:h-1/2"
				}}
				variant="transparent"
				className="text-md text-primary hover:bg-primary-200 data-[disabled]:text-primary-300 mx-0 rounded-lg px-0 data-[disabled]:bg-transparent max-sm:w-full sm:mx-2 sm:px-4 md:min-w-max"
				leftSection={<Icon className="aspect-square" size="1.25em" />}
				{...rest}
			>
				{name}
			</Button>
		</Tooltip>
	);
};
