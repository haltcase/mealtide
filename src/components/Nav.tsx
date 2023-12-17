"use client";

import { ButtonGroup, Navbar, NavbarBrand } from "@nextui-org/react";
import {
	TbArrowBackUp,
	TbArrowForwardUp,
	TbLink,
	TbNewSection,
	TbShare
} from "react-icons/tb";

import { goBack, goForward } from "../utilities/history";
// import { copyUrl, share } from "../utilities/sharing";
import { Emoji } from "./Emoji";
import { ToolbarAction } from "./ToolbarAction";

interface NavProps {
	onReset: React.MouseEventHandler<HTMLButtonElement>;
}

export const Nav = ({ onReset }: NavProps): JSX.Element => {
	return (
		<header className="fixed top-0 z-50 flex w-full flex-col">
			<Navbar className="sm:border-b-0" maxWidth="xl" height="auto">
				<NavbarBrand className="-mt-1 h-10 select-none gap-2 text-3xl font-light sm:h-16">
					<div>
						<Emoji text="🍔" label="burger" />
					</div>
					<p>mealtide</p>
				</NavbarBrand>
			</Navbar>

			<Navbar
				className="fixed bottom-0 top-[initial] border-t sm:relative sm:border-t-0"
				classNames={{
					wrapper: "px-0"
				}}
				maxWidth="xl"
				height="auto"
			>
				<div className="flex h-12 w-full flex-row justify-center">
					<ButtonGroup className="max-sm:w-full max-sm:py-1" variant="light">
						<ToolbarAction name="New" icon={TbNewSection} onClick={onReset} />
						<ToolbarAction name="Undo" icon={TbArrowBackUp} onClick={goBack} />
						<ToolbarAction
							name="Redo"
							icon={TbArrowForwardUp}
							onClick={goForward}
						/>
						<ToolbarAction
							name="Copy link"
							icon={TbLink}
							// onClick={() => copyUrl(toast)}
						/>
						<ToolbarAction
							name="Share"
							icon={TbShare}
							// onClick={() => share(toast)}
						/>
					</ButtonGroup>
				</div>
			</Navbar>
		</header>
	);
};
