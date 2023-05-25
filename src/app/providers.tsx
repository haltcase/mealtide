"use client";

import { NextUIProvider } from "@nextui-org/react";

const Providers = ({ children }: { children: React.ReactNode }) => (
	<NextUIProvider>{children}</NextUIProvider>
);

export default Providers;
