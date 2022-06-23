import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface TagGroupProps {
	children?: ReactNode;
}

export const TagGroup = ({ children }: TagGroupProps): JSX.Element => {
	return (
		<Box
			role="group"
			borderRadius={"md"}
			_first={{
				_notLast: { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
			}}
			_notFirst={{
				_last: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
			}}>
			{children}
		</Box>
	);
};
