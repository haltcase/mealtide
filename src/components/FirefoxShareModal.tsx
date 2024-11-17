import {
	Anchor,
	Code,
	List,
	ListItem,
	Modal,
	Stack,
	Text
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export interface FirefoxShareModalProps {
	label: React.ReactNode;
}

export const FirefoxShareModal: React.FC<FirefoxShareModalProps> = ({
	label
}) => {
	const [isOpen, { open, close }] = useDisclosure();

	return (
		<>
			<Modal
				classNames={{
					overlay: "z-[501]",
					inner: "z-[502]"
				}}
				title={<Text className="font-bold">Sharing in Firefox Desktop</Text>}
				size="lg"
				opened={isOpen}
				onClose={close}
			>
				<Stack>
					<Text>
						Firefox Desktop has support for sharing, but you must currently
						enable a flag in order for it to work.
					</Text>

					<List type="ordered" className="list-decimal px-4">
						<ListItem>
							Visit{" "}
							<Anchor
								href="https://support.mozilla.org/en-US/kb/about-config-editor-firefox"
								target="_blank"
							>
								<Code>about:config</Code>
							</Anchor>{" "}
							to change Firefox preferences.
						</ListItem>

						<ListItem>
							In the preferences search bar, enter{" "}
							<Code>dom.webshare.enabled</Code>.
						</ListItem>

						<ListItem>
							Double click the row or click the togle button to change the
							preference from <Code>false</Code> to <Code>true</Code>.
						</ListItem>

						<ListItem>
							Return to mealtide and refresh the page to making sharing
							available.
						</ListItem>
					</List>
				</Stack>
			</Modal>

			<Anchor onClick={open}>{label}</Anchor>
		</>
	);
};
