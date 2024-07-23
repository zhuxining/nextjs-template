"use server";

import { signIn } from "@/auth";
import { signInSchema } from "@/lib/zod";
import { AuthError } from "next-auth";

export async function authenticate(formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const parsedCredentials = signInSchema.safeParse({ email, password });

	if (!parsedCredentials.success) {
		return { error: "Invalid credentials" };
	}

	try {
		await signIn("credentials", {
			email,
			password,
			redirect: false,
		});
		return { success: true };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
				case "AccessDenied":
					return { error: "Invalid credentials" };
				case "CallbackRouteError":
					return { error: "Invalid submission" };
				default:
					return { error: "An unknown error occurred" };
			}
		}
		return { error: "An unexpected error occurred" };
	}
}
