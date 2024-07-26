import SigninForm from "@/components/auth/signin-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Leaf } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Sign In",
	description: "Signin to your account.",
};
export default async function SigninPage() {
	return (
		<main className="container h-screen flex items-center justify-center">
			<Button
				variant="ghost"
				className="absolute left-4 top-4 md:left-8 md:top-8"
				asChild
			>
				<Link href={"/"}>
					<ChevronLeft className="mr-2 h-4 w-4" /> Back
				</Link>
			</Button>

			<SigninForm />
		</main>
	);
}
