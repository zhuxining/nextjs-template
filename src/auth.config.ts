import prisma from "@/lib/prisma";
import { getStringFromBuffer } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import Email from "next-auth/providers/email";
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

export default {
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
