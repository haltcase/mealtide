import { Link } from "@tanstack/react-router";

import { Emoji } from "../emoji";
import { Toolbar } from "./toolbar";

export interface NavProps {
	showToolbar?: boolean;
}

export const Header: React.FC<NavProps> = ({ showToolbar = true }) => (
	<header className="fixed top-0 z-50 flex w-full flex-col items-center">
		<nav className="align-center bg-primary-200/70 flex w-full justify-between p-2 text-white backdrop-blur-md sm:p-4">
			<Link
				className="text-primary -mt-1 flex flex-row items-center gap-2 text-2xl font-light select-none sm:text-4xl sm:font-extralight"
				to="/"
				search={{ save: undefined }}>
				<div>
					<Emoji text="🍔" label="burger" />
				</div>
				<div>mealtide</div>
			</Link>
		</nav>

		{showToolbar && (
			<div className="bg-primary-200/70 fixed top-[initial] bottom-0 w-full backdrop-blur-md sm:static">
				<div className="flex h-12 w-full flex-row justify-center">
					<Toolbar />
				</div>
			</div>
		)}
	</header>
);
