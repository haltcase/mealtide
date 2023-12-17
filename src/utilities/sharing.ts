// TODO
type ShowToastPlaceholder = (...args: unknown[]) => unknown;

export const copyUrl = (showToast: ShowToastPlaceholder): void => {
	navigator.clipboard
		.writeText(document.location.toString())
		.then(() =>
			showToast({ description: "Copied URL to clipboard", status: "success" })
		)
		.catch(() =>
			showToast({
				description: "Could not copy URL to clipboard",
				status: "error"
			})
		);
};

export const share = (showToast: ShowToastPlaceholder) => {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!navigator.share) {
		showToast({
			description: "Your browser doesn't support sharing content",
			status: "error"
		});
		return;
	}

	const content = {
		title: `Lunch Order for ${new Date().toLocaleDateString()}`,
		text: "Visit mealtide to see the details for this order",
		url: document.location.toString()
	};

	navigator
		.share(content)
		.then(() => showToast({ description: "Shared", status: "success" }))
		.catch(() =>
			showToast({ description: "Failed to share", status: "error" })
		);
};
