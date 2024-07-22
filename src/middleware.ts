import authConfig from "@/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
	const publicPaths = ["/login", "/signup", "/api/auth", "/ex"];
	const isPublicRoute =
		publicPaths.some((path) => req.nextUrl.pathname.startsWith(path)) ||
		req.nextUrl.pathname === "/";
	if (!req.auth && !isPublicRoute) {
		return Response.redirect(new URL("/", req.nextUrl.origin));
	}
});

// import { auth } from "@/auth";

// export default auth((req) => {
// 	const publicPaths = ["/login", "/signup", "/api/auth", "/ex"];
// 	const isPublicRoute =
// 		publicPaths.some((path) => req.nextUrl.pathname.startsWith(path)) ||
// 		req.nextUrl.pathname === "/";
// 	if (!req.auth && !isPublicRoute) {
// 		return Response.redirect(new URL("/api/auth/signin", req.nextUrl.origin));
// 	}
// });

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
