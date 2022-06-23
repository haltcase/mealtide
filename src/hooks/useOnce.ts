import { useEffect, useRef } from "react";

export const useOnce = (callback: () => void, condition = true) => {
	const isCalled = useRef(false);

	useEffect(() => {
		if (condition && !isCalled.current) {
			isCalled.current = true;
			callback();
		}
	}, [callback, condition]);
};
