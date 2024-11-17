import type { NotificationData } from "@mantine/notifications";
import { notifications } from "@mantine/notifications";

export type Toasts = typeof toast;

export const toast = {
	success: (options: NotificationData): ReturnType<typeof notifications.show> =>
		notifications.show({
			color: "green",
			...options
		}),

	error: (options: NotificationData): ReturnType<typeof notifications.show> =>
		notifications.show({
			color: "red",
			...options
		}),

	info: (options: NotificationData): ReturnType<typeof notifications.show> =>
		notifications.show({
			color: "blue",
			...options
		})
};
