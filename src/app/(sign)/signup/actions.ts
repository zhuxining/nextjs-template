"use server";

import { signIn } from "@/auth";
import { getStringFromBuffer, getUser, hashed } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { signUpSchema } from "@/lib/zod";
import { AuthError } from "next-auth";

async function createUser(email: string, hashedPassword: string, salt: string) {
	const existingUser = await getUser(email);

	if (existingUser) {
		return { error: "User already exists" };
	}

	const user = {
		email,
		password: hashedPassword,
		salt,
		name: email.split("@")[0].toString(),
	};

	await prisma.user.create({ data: user });
	return { success: true };
}

export async function signup(formData: FormData) {
	const email = formData.get("email")?.toString().toLowerCase() as string;
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	const parsedCredentials = signUpSchema.safeParse({
		email,
		password,
		confirmPassword,
	});

	if (!parsedCredentials.success) {
		return { error: "Invalid credentials" };
	}

	const salt = crypto.randomUUID();
	const hashedPassword = await hashed(password, salt);

	try {
		const result = await createUser(email, hashedPassword, salt);

		if ("error" in result) {
			return result;
		}

		await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		return { success: true };
	} catch (error) {
		if (error instanceof AuthError) {
			return { error: "Invalid credentials" };
		}
		return { error: "An unexpected error occurred" };
	}
}
