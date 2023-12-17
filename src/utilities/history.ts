import { compressToURI, decompressFromURI } from "lz-ts";
import type { MutableRefObject } from "react";

import type { SerializableState } from "../models/SerializableState";
import { isEmptyTree } from "./helpers";

export const goBack = (): void => {
	window.history.back();
};

export const goForward = (): void => {
	window.history.forward();
};

const serializationKey = "save";

export const getStateFromUrl = (): SerializableState | null => {
	// console.log("getStateFromUrl");
	const parameters = new URLSearchParams(document.location.search);

	if (parameters.has(serializationKey)) {
		try {
			return JSON.parse(
				decompressFromURI(parameters.get(serializationKey) ?? "")
			) as SerializableState;
		} catch {
			// showToast({
			// 	description: "Could not load data from URL",
			// 	status: "error"
			// });
		}
	}

	return null;
};

export const saveStateToUrl = (
	data: SerializableState,
	isInternalRef: MutableRefObject<boolean>
): void => {
	// console.log("saveStateToUrl", data, isInternalRef.current);
	// prevent history changes if this is an internal event
	// this maintains forward/backward state
	if (isInternalRef.current) {
		isInternalRef.current = false;
		return;
	}

	const previousPath = `/${window.location.search}`;
	let newPath = window.location.pathname;

	if (!isEmptyTree(data)) {
		const parameters = new URLSearchParams();
		parameters.set(serializationKey, compressToURI(JSON.stringify(data)));
		newPath += `?${parameters.toString()}`;
	}

	if (newPath !== previousPath) {
		window.history.pushState(data, "", newPath);
	}
};
