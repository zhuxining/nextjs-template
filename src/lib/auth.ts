import prisma from "@/lib/prisma";

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
	Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

export async function getUser(email: string) {
	return prisma.user.findUnique({ where: { email } });
}

export async function hashed(password: string, salt: string | null) {
	const encoder = new TextEncoder();
	const saltedPassword = encoder.encode(password + salt);
	const hashedPasswordBuffer = await crypto.subtle.digest(
		"SHA-512",
		saltedPassword,
	);
	const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);
	return hashedPassword;
}
export async function verifyPassword(
	password: string,
	hashedPassword: string,
	salt: string,
) {
	const computedHash = await hashed(password, salt);
	return computedHash === hashedPassword;
}
