import { compressToURI, decompressFromURI } from "lz-ts";
import { MutableRefObject } from "react";

import { SerializableState } from "../models/SerializableState";
import { isEmptyTree } from "./helpers";

export const goBack = (): void => {
	window.history.back();
};

export const goForward = (): void => {
	window.history.forward();
};

const serializationKey = "save";

export const getStateFromUrl = (): SerializableState | null => {
	console.log("getStateFromUrl");
	const params = new URLSearchParams(document.location.search);

	if (params.has(serializationKey)) {
		try {
			return JSON.parse(decompressFromURI(params.get(serializationKey) ?? ""));
		} catch (error) {
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
	console.log("saveStateToUrl", data, isInternalRef.current);
	// prevent history changes if this is an internal event
	// this maintains forward/backward state
	if (isInternalRef.current) {
		isInternalRef.current = false;
		return;
	}

	const previousPath = "/" + window.location.search;
	let newPath = window.location.pathname;

	if (!isEmptyTree(data)) {
		const params = new URLSearchParams();
		params.set(serializationKey, compressToURI(JSON.stringify(data)));
		newPath += "?" + params.toString();
	}

	if (newPath !== previousPath) {
		window.history.pushState(data, "", newPath);
	}
};
