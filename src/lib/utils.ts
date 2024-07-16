import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
	Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

export function formatDate(input: string | number | Date): string {
	const date = new Date(input);
	return date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export enum ResultCode {
	InvalidCredentials = "INVALID_CREDENTIALS",
	InvalidSubmission = "INVALID_SUBMISSION",
	UserAlreadyExists = "USER_ALREADY_EXISTS",
	UnknownError = "UNKNOWN_ERROR",
	UserCreated = "USER_CREATED",
	UserLoggedIn = "USER_LOGGED_IN",
}

export const getMessageFromCode = (resultCode: string) => {
	switch (resultCode) {
		case ResultCode.InvalidCredentials:
			return "Invalid credentials!";
		case ResultCode.InvalidSubmission:
			return "Invalid submission, please try again!";
		case ResultCode.UserAlreadyExists:
			return "User already exists, please log in!";
		case ResultCode.UserCreated:
			return "User created, welcome!";
		case ResultCode.UnknownError:
			return "Something went wrong, please try again!";
		case ResultCode.UserLoggedIn:
			return "Logged in!";
	}
};
