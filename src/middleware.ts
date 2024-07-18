import { auth } from "@/auth";

export default auth((req) => {
	const publicPaths = ["/login", "/signup", "/api/auth"];

	const isPublicRoute =
		publicPaths.some((path) => req.nextUrl.pathname.startsWith(path)) ||
		req.nextUrl.pathname === "/";

	if (!req.auth && !isPublicRoute) {
		return Response.redirect(new URL("/api/auth/signin", req.nextUrl.origin));
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
