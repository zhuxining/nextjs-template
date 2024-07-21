import SigninForm from "@/components/auth/signin-form";

export default async function SigninPage() {
	return (
		<main className="flex flex-col p-4">
			<SigninForm />
		</main>
	);
}
