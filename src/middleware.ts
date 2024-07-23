import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl } = req;

	const isAuth = !!req.auth;

	const publicPaths = ["/login", "/signup", "/api/auth", "/ex"];
	const isPublicRoute = publicPaths.some((path) =>
		nextUrl.pathname.startsWith(path),
	);

	if (!isAuth && !isPublicRoute) {
		return Response.redirect(new URL("/signin", nextUrl));
	}

	if (
		isAuth &&
		(nextUrl.pathname === "/signin" || nextUrl.pathname === "/signup")
	) {
		return Response.redirect(new URL("/", nextUrl));
	}
});
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
