import { Text } from "@mantine/core";

import { FirefoxShareModal } from "@/components/FirefoxShareModal";

import { toast } from "./toasts";

export const copyUrl = async (): Promise<void> => {
	try {
		await navigator.clipboard.writeText(document.location.toString());

		toast.success({
			message: "Copied URL to clipboard"
		});
	} catch {
		toast.error({
			message: "Could not copy URL to clipboard"
		});
	}
};

export const share = async (): Promise<void> => {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!navigator.share) {
		await navigator.clipboard.writeText(document.location.toString());

		toast.error({
			message: (
				<Text>
					Your browser doesn't support sharing content, but the URL has been
					copied to your clipboard.
					<br />
					<FirefoxShareModal label="Using Firefox?" />
				</Text>
			),
			autoClose: false,
			withCloseButton: true
		});

		return;
	}

	const content = {
		title: `Lunch order for ${new Date().toLocaleDateString()}`,
		text: "Visit mealtide to see the details for this order",
		url: document.location.toString()
	};

	try {
		await navigator.share(content);
		toast.success({ message: "Shared" });
	} catch {
		toast.error({ message: "Failed to share" });
	}
};
