"use client";

import { ButtonGroup } from "@mantine/core";
import {
	TbArrowBackUp,
	TbArrowForwardUp,
	TbLink,
	TbNewSection,
	TbShare
} from "react-icons/tb";

import {
	useMainStore
	// useTemporalMainStore
} from "@/app/providers/MainStoreProvider";
import { copyUrl, share } from "@/utilities/sharing.tsx";

import { ToolbarAction } from "./ToolbarAction";

export const Toolbar: React.FC = () => {
	const [reset] = useMainStore((state) => state.reset);
	// const { undo, redo, pastStates, futureStates } = useTemporalMainStore(
	// 	(state) => state
	// );

	return (
		<ButtonGroup className="items-center max-sm:w-full max-sm:py-1">
			<ToolbarAction name="New" icon={TbNewSection} onClick={reset} />
			<ToolbarAction
				name="Undo"
				icon={TbArrowBackUp}
				// disabled={pastStates.length === 0}
				// onClick={() => undo()}
			/>
			<ToolbarAction
				name="Redo"
				icon={TbArrowForwardUp}
				// disabled={futureStates.length === 0}
				// onClick={() => redo()}
			/>
			<ToolbarAction name="Copy link" icon={TbLink} onClick={copyUrl} />
			<ToolbarAction name="Share" icon={TbShare} onClick={share} />
		</ButtonGroup>
	);
};
