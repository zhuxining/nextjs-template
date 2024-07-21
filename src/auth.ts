import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut, handlers } = NextAuth({
	adapter: PrismaAdapter(prisma) as Adapter,
	trustHost: true,
	...authConfig,
	logger: {
		error(code, ...message) {
			console.error(code, message);
		},
		warn(code, ...message) {
			console.warn(code, message);
		},
		debug(code, ...message) {
			console.debug(code, message);
		},
	},
});
