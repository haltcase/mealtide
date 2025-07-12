import { Link } from "@tanstack/react-router";

import { Emoji } from "../Emoji";
import { Toolbar } from "./Toolbar";

export interface NavProps {
	showToolbar?: boolean;
}

export const Header: React.FC<NavProps> = ({ showToolbar = true }) => {
	return (
		<header className="fixed top-0 z-50 flex w-full flex-col items-center">
			<nav className="align-center bg-primary-200/70 flex w-full justify-between p-2 text-white backdrop-blur-md sm:p-4">
				<Link
					className="text-primary -mt-1 flex flex-row items-center gap-2 text-2xl font-light select-none sm:text-4xl sm:font-extralight"
					to="/"
				>
					<div>
						<Emoji text="🍔" label="burger" />
					</div>
					<div>mealtide</div>
				</Link>
			</nav>

			{showToolbar && (
				<div className="bg-primary-200/70 fixed top-[initial] bottom-0 w-full border-t backdrop-blur-md sm:static sm:border-t-0">
					<div className="flex h-12 w-full flex-row justify-center">
						<Toolbar />
					</div>
				</div>
			)}
		</header>
	);
};
