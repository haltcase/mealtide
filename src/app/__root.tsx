// TODO: Switch to a side-effect import when Start fully supports it
import globalStyles from "@/globals.css?url";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { Providers } from "@/providers/RootProviders";

export const metadata = {
  manifest: "/manifest.webmanifest",
};

const RootLayout: React.FC = () => (
  <html lang="en" {...mantineHtmlProps}>
    <head>
      <HeadContent />
      <ColorSchemeScript />
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>

      <Scripts />

      <Providers>
        <Outlet />
      </Providers>
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf8" },
      {
        name: "theme-color",
        content: "#00947e",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "mealtide" },
    ],
    links: [
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "stylesheet",
        href: globalStyles,
      }
    ],
  }),
  component: RootLayout,
});
