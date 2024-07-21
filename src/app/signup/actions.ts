"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/prisma";
import { ResultCode, getStringFromBuffer } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { z } from "zod";
import { getUser } from "../signin/actions";

export async function createUser(
	email: string,
	hashedPassword: string,
	salt: string,
) {
	const existingUser = await getUser(email);

	if (existingUser) {
		return {
			type: "error",
			resultCode: ResultCode.UserAlreadyExists,
		};
	}
	{
		const user = {
			email,
			password: hashedPassword,
			salt,
		};

		await prisma.user.create({
			data: user,
		});

		return {
			type: "success",
			resultCode: ResultCode.UserCreated,
		};
	}
}

interface Result {
	type: string;
	resultCode: ResultCode;
}

export async function signup(formData: FormData): Promise<Result | undefined> {
	const email = formData.get("email")?.toString().toLowerCase() as string;
	const password = formData.get("password") as string;

	const parsedCredentials = signInSchema.safeParse({
		email,
		password,
	});

	if (parsedCredentials.success) {
		const salt = crypto.randomUUID();

		const encoder = new TextEncoder();
		const saltedPassword = encoder.encode(password + salt);
		const hashedPasswordBuffer = await crypto.subtle.digest(
			"SHA-256",
			saltedPassword,
		);
		const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);

		try {
			const result = await createUser(email, hashedPassword, salt);

			if (result.resultCode === ResultCode.UserCreated) {
				await signIn("credentials", {
					email,
					password,
					redirect: false,
				});
			}

			return result;
		} catch (error) {
			if (error instanceof AuthError) {
				switch (error.type) {
					case "CredentialsSignin":
						return {
							type: "error",
							resultCode: ResultCode.InvalidCredentials,
						};
					default:
						return {
							type: "error",
							resultCode: ResultCode.UnknownError,
						};
				}
			}
			return {
				type: "error",
				resultCode: ResultCode.UnknownError,
			};
		}
	}
	return {
		type: "error",
		resultCode: ResultCode.InvalidCredentials,
	};
}
