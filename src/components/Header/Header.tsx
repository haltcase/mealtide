// "use client";

import Link from "next/link";

import { Emoji } from "../Emoji";
import { Toolbar } from "./Toolbar";

export interface NavProps {
	showToolbar?: boolean;
}

export const Header: React.FC<NavProps> = ({ showToolbar = true }) => {
	return (
		<header className="fixed top-0 z-50 flex w-full flex-col items-center">
			<nav className="align-center flex w-full justify-between bg-primary-200/70 p-2 text-white backdrop-blur-md sm:p-4">
				<Link
					className="-mt-1 flex select-none flex-row items-center gap-2 text-2xl font-light text-primary sm:text-4xl sm:font-extralight"
					href="/"
				>
					<div>
						<Emoji text="🍔" label="burger" />
					</div>
					<div>mealtide</div>
				</Link>
			</nav>

			{showToolbar && (
				<div className="fixed bottom-0 top-[initial] w-full border-t bg-primary-200/70 backdrop-blur-md sm:static sm:border-t-0">
					<div className="flex h-12 w-full flex-row justify-center">
						<Toolbar />
					</div>
				</div>
			)}
		</header>
	);
};
