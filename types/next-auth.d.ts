import type { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: User & DefaultSession["user"];
	}

	interface User {
		role: string | null;
		password: string | null;
		salt: string | null;
	}
}
