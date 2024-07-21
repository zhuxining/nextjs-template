import { auth } from "@/auth";
import SignupForm from "@/components/auth/signup-form";
import { redirect } from "next/navigation";

export default async function SignupPage() {
	const session = await auth();

	if (session) {
		redirect("/");
	}
	return (
		<main className="container flex items-center justify-center min-h-screen">
			<SignupForm />
		</main>
	);
}
