import { getUser, verifyPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { signInSchema } from "@/lib/zod";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import { AuthError } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

export default {
	adapter: PrismaAdapter(prisma) as Adapter,
	pages: {
		// signIn: "/signin",
		newUser: "/signup",
		error: "/auth/error",
	},
	session: { strategy: "jwt" },
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
			}
			return session;
		},
	},
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const parsedCredentials = signInSchema.safeParse(credentials);
				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
					try {
						const user = await getUser(email);
						if (!user) {
							console.log(`User not found: ${email}`);
							return null;
						}
						if (!user.password || !user.salt) {
							console.log(`User ${email} has incomplete credentials`);
							return null;
						}
						const isValid = await verifyPassword(
							password,
							user.password,
							user.salt,
						);
						if (isValid) {
							return user;
						}
						console.log(`Invalid password for user: ${email}`);
						return null;
					} catch (error) {
						if (error instanceof AuthError) {
							console.error(`Authentication error: ${error.message}`);
						} else {
							console.error("Unexpected error during authentication:", error);
						}
						return null;
					}
				}
				console.log("Invalid credentials format");
				return null;
			},
		}),
		Resend({
			from: "no-reply@send.ningxikeji.com",
		}),
		GitHub({ allowDangerousEmailAccountLinking: true }),
		Google,
	],
} satisfies NextAuthConfig;
