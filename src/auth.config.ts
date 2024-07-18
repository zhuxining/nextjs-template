import prisma from "@/lib/prisma";
import { signInSchema } from "@/lib/zod";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { ZodError, z } from "zod";

async function getUser(email: string) {
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
		signIn: "/login",
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
			authorize: async (credentials) => {
				try {
					let user = null;

					const { email, password } =
						await signInSchema.parseAsync(credentials);

					// logic to salt and hash password
					const pwHash = saltAndHashPassword(password);

					// logic to verify if user exists
					user = await getUserFromDb(email, pwHash);

					if (!user) {
						throw new Error("User not found.");
					}

					// return json object with the user data
					return user;
				} catch (error) {
					if (error instanceof ZodError) {
						// Return `null` to indicate that the credentials are invalid
						return null;
					}
				}
			},
		}),

		GitHub,
		Google,
	],
} satisfies NextAuthConfig;

function getStringFromBuffer(buffer: ArrayBuffer) {
	return Array.from(new Uint8Array(buffer))
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}
