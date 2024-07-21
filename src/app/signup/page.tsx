import SignupForm from "@/components/auth/signup-form";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function createUser(email: string, hashedPassword: string, salt: string) {
	"use server";

	const existingUser = await prisma.user.findUnique({
		where: { email: email },
	});

	if (existingUser) {
		return { type: "error", description: "User already exists." };
	}

	await prisma.user.create({
		data: { email, password: hashedPassword, salt },
	});

	revalidatePath("/signup");
	return { type: "success", description: "User created successfully." };
}

export default function SignupPage() {
	return (
		<main className="container flex items-center justify-center min-h-screen">
			<SignupForm createUser={createUser} />
		</main>
	);
}
