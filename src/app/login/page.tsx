import { auth } from "@/auth";
import { signIn } from "@/auth";
import LoginForm from "@/components/login-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
});

export default async function LoginPage() {
	const session = await auth();

	if (session) {
		redirect("/");
	}

	return (
		<main className="flex flex-col p-4">
			<form
				action={async (formData) => {
					"use server";
					await signIn("credentials", formData);
				}}
				className="flex flex-col items-center gap-4 space-y-3"
			>
				<label
					className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
					htmlFor="email"
				>
					Email
				</label>
				<div className="relative">
					<input
						className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
						id="email"
						type="email"
						name="email"
						placeholder="Enter your email address"
						required
					/>
				</div>
				<label>
					Password
					<input name="password" type="password" />
				</label>
				<Button>Sign In</Button>
			</form>
		</main>
	);
}
