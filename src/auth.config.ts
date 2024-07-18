import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

export const authConfig = {
	secret: process.env.AUTH_SECRET,
	pages: {
		// signIn: "/login",
		newUser: "/signup",
	},
	session: { strategy: "jwt" },
	callbacks: {
		async authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnLoginPage = nextUrl.pathname.startsWith("/login");
			const isOnSignupPage = nextUrl.pathname.startsWith("/signup");

			if (isLoggedIn) {
				if (isOnLoginPage || isOnSignupPage) {
					return Response.redirect(new URL("/", nextUrl));
				}
			}
			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token = { ...token, id: user.id };
			}

			return token;
		},
		async session({ session, token }) {
			if (token) {
				const { id } = token as { id: string };
				const { user } = session;

				session = { ...session, user: { ...user, id } };
			}

			return session;
		},
	},
	providers: [
		Resend({
			from: "no-reply@send.ningxikeji.com",
		}),

		GitHub,
		Google,
	],
} satisfies NextAuthConfig;
