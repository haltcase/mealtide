import { ActionIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { PropsWithChildren } from "react";
import { TbInfoCircle } from "react-icons/tb";

interface ItemHeadingProps extends PropsWithChildren {
	title: string;
	subtitle: string;
}

export const ItemHeading = (props: ItemHeadingProps): JSX.Element => {
	const [isTooltipOpen, { open, close }] = useDisclosure();

	return (
		<div className="flex flex-row items-center gap-4">
			<p className="text-xl font-bold">{props.title}</p>

			<Tooltip label={props.subtitle} opened={isTooltipOpen}>
				<ActionIcon
					variant="subtle"
					radius="100%"
					aria-label={props.subtitle}
					onMouseEnter={open}
					onMouseLeave={close}
					onClick={open}
				>
					<TbInfoCircle size="1.2rem" />
				</ActionIcon>
			</Tooltip>

			{props.children}
		</div>
	);
};
