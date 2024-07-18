import { auth } from "@/auth";

export default auth((req) => {
	const publicPaths = ["/", "/login", "/signup", "/api/auth"];

	const isPublicRoute = publicPaths.some((path) =>
		req.nextUrl.pathname.startsWith(path),
	);

	const isFile = /\.[\w]+$/.test(req.nextUrl.pathname);

	if (!req.auth && !isPublicRoute && !isFile) {
		const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);
		return Response.redirect(newUrl);
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
