import type { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: User & DefaultSession["user"];
	}

	interface User {
		id: string;
		email: string;
		password: string;
		salt: string;
		role: string | null;
	}
}

export interface Session {
	user: {
		id: string;
		email: string;
	};
}

export interface AuthResult {
	type: string;
	message: string;
}

export interface User extends Record<string, any> {
	id: string;
	email: string;
	password: string;
	salt: string;
}
