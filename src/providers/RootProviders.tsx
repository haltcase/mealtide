"use client";

import { MantineProvider } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import type { PropsWithChildren } from "react";

import { appTheme } from "@/theme";

export type ProvidersProps = PropsWithChildren;

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return (
		<MantineProvider theme={appTheme}>
			<Notifications
				position={isDesktop ? "top-right" : "bottom-center"}
				className="data-[position='top-right']:top-32"
			/>
			{children}
		</MantineProvider>
	);
};
