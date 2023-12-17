import { Button, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { TbInfoCircle } from "react-icons/tb";

interface ItemHeadingProps {
	title: string;
	subtitle: string;
}

export const ItemHeading = (props: ItemHeadingProps): JSX.Element => {
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);

	return (
		<div className="flex flex-row items-center gap-4">
			<p className="text-xl font-bold">{props.title}</p>

			<Tooltip content={props.subtitle} isOpen={isTooltipOpen}>
				<Button
					className="text-md"
					size="xs"
					radius="full"
					isIconOnly
					title={props.subtitle}
					onMouseEnter={() => { setIsTooltipOpen(true); }}
					onMouseLeave={() => { setIsTooltipOpen(false); }}
					onClick={() => { setIsTooltipOpen(true); }}>
					<TbInfoCircle />
				</Button>
			</Tooltip>
		</div>
	);
};
