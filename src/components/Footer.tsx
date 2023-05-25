import { Emoji } from "./Emoji";

export const Footer = (): JSX.Element => (
	<footer className="flex flex-col items-center pb-24 pt-4 text-white">
		<p>Created by Bo Lingen, 2022</p>
		<p>
			Powered by <Emoji text="🍩" label="donuts" showTooltip /> and{" "}
			<Emoji text="☕" label="coffee" showTooltip />
		</p>
		<p>
			... and also <Emoji text="🔌" label="electricity" showTooltip />
		</p>
	</footer>
);
