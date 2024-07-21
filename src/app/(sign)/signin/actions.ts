"use server";
import { signIn } from "@/auth";
import { ResultCode } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";
import { AuthError } from "next-auth";

interface Result {
	type: string;
	resultCode: ResultCode;
}

export async function authenticate(
	formData: FormData,
): Promise<Result | undefined> {
	try {
		const email = formData.get("email");
		const password = formData.get("password");

		const parsedCredentials = signInSchema.safeParse({
			email,
			password,
		});

		if (parsedCredentials.success) {
			await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			return {
				type: "success",
				resultCode: ResultCode.UserLoggedIn,
			};
		}
		return {
			type: "error",
			resultCode: ResultCode.InvalidCredentials,
		};
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
	}
}
