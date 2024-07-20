import { auth } from "@/auth";
import SigninForm from "@/components/auth/signin-form";

import { redirect } from "next/navigation";

export default async function LoginPage() {
	const session = await auth();

	if (session) {
		redirect("/");
	}

	return (
		<main className="flex flex-col p-4">
			<SigninForm />
		</main>
	);
}
