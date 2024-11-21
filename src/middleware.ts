import { type NextMiddleware, NextResponse } from "next/server";

export const queryHeader = "x-query";

export const middleware: NextMiddleware = (request) => {
	const responseHeaders = new Headers({
		...request.headers,
		[queryHeader]: request.nextUrl.search
	});

	return NextResponse.next({
		request: {
			headers: responseHeaders
		}
	});
};

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
	]
};
