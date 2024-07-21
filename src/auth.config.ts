import prisma from "@/lib/prisma";
import { getStringFromBuffer } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export async function getUser(email: string) {
	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});
	return user;
}

export const authConfig = {
	secret: process.env.AUTH_SECRET,

	pages: {
		signIn: "/signin",
		newUser: "/signup",
	},
	session: { strategy: "jwt" },
	callbacks: {
		async authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnLoginPage = nextUrl.pathname.startsWith("/signin");
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
		// Resend({
		// 	from: "no-reply@send.ningxikeji.com",
		// }),
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
			},
			async authorize(credentials) {
				const parsedCredentials = signInSchema.safeParse(credentials);

				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
					const user = await getUser(email);

					if (!user) return null;

					const encoder = new TextEncoder();
					const saltedPassword = encoder.encode(password + user.salt);
					const hashedPasswordBuffer = await crypto.subtle.digest(
						"SHA-512",
						saltedPassword,
					);
					const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);

					if (hashedPassword === user.password) {
						return user;
					}
					return null;
				}

				return null;
			},
		}),

		GitHub,
		Google,
	],
} satisfies NextAuthConfig;
