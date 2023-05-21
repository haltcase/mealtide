import { ChakraProvider } from "@chakra-ui/react";

import theme from "@/theme";
import { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
};

export default App;
