import { auth } from "@/auth";
import SignupForm from "@/components/signup-form";

import { redirect } from "next/navigation";

export default async function SignupPage() {
	const session = await auth();

	if (session) {
		redirect("/");
	}

	return (
		<main className="flex flex-col p-4">
			<SignupForm />
		</main>
	);
}
