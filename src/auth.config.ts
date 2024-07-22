import prisma from "@/lib/prisma";
import { getStringFromBuffer } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import Resend from "next-auth/providers/resend";

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
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				Email: {},
				Password: {},
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
		Resend({
			from: "no-reply@send.ningxikeji.com",
		}),
		GitHub,
		Google,

		//NOTE:如果要启用 Nodemailer，不能用 Middleware 推荐的 auth.config.ts 方式配置，否则在验证邮件地址时会抛出如下错误：
		// Error: The edge runtime does not support Node.js 'stream' module.
		// see https://github.com/nextauthjs/next-auth/issues/10919 。

		// Nodemailer({
		// 	server: {
		// 		host: process.env.EMAIL_SERVER_HOST,
		// 		port: process.env.EMAIL_SERVER_PORT,
		// 		auth: {
		// 			user: process.env.EMAIL_SERVER_USER,
		// 			pass: process.env.EMAIL_SERVER_PASSWORD,
		// 		},
		// 	},
		// 	from: process.env.EMAIL_FROM,
		// }),
	],
} satisfies NextAuthConfig;
