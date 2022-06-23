import { useToast as useToastChakra } from "@chakra-ui/react";
import type { UseToastOptions } from "@chakra-ui/react";

export const useToast: typeof useToastChakra = (
	defaultOptions: UseToastOptions = {}
) =>
	useToastChakra({
		status: "success",
		position: "top-right",
		containerStyle: {
			marginTop: "100px",
			...defaultOptions.containerStyle
		},
		...defaultOptions
	});
