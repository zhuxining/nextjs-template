import SignupForm from "@/components/auth/signup-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Sign Up",
	description: "Create an account to get started.",
};
export default async function SignupPage() {
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
			<SignupForm />
		</main>
	);
}
