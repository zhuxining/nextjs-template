"use client";

import { authenticate } from "@/app/(sign)/signin/actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Leaf } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import type { z } from "zod";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button className="w-full" type="submit" disabled={pending}>
			{pending ? "Signing In..." : "Sign In"}
		</Button>
	);
}

export default function SigninForm() {
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [formError, setFormError] = useState<string | null>(null);

	const callbackUrl = searchParams.get("callbackUrl") ?? "/";

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onBlur",
	});

	const onSubmit = useCallback(
		async (data: z.infer<typeof signInSchema>) => {
			setFormError(null);
			const formData = new FormData();
			formData.append("email", data.email);
			formData.append("password", data.password);

			const result = await authenticate(formData);

			if (result.success) {
				router.push(callbackUrl);
				toast({
					title: "Success",
					description: "You have successfully logged in.",
				});
			} else {
				setFormError(result.error || "An unexpected error occurred");
			}
		},
		[toast, router, callbackUrl],
	);

	const handleGithubSignIn = useCallback(() => {
		signIn("github", { callbackUrl });
	}, [callbackUrl]);

	return (
		<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div className="flex flex-col space-y-2 text-center">
				<Leaf className="mx-auto h-6 w-6" />
				<h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
				<p className="text-sm text-muted-foreground">
					Enter your email to sign in to your account
				</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="Enter your email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="Enter your password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{formError && <div className="text-sm text-red-500">{formError}</div>}
					<SubmitButton />
				</form>
			</Form>

			<Separator className="my-4" />

			<Button variant="outline" onClick={handleGithubSignIn} className="w-full">
				<Icons.gitHub className="mr-2 h-4 w-4" />
				Sign In With Github
			</Button>
			<div className="mt-4 text-center text-sm text-muted-foreground">
				Don&apos;t have an account?{" "}
				<Link href="/signup" className="underline">
					Sign up
				</Link>
			</div>
		</div>
	);
}
