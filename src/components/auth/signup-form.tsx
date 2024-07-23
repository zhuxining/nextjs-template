"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { signup } from "@/app/(sign)/signup/actions";
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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/lib/zod";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button className="w-full" type="submit" disabled={pending}>
			{pending ? "Creating Account..." : "Sign Up"}
		</Button>
	);
}

export default function SignupForm() {
	const { toast } = useToast();
	const router = useRouter();
	const [formError, setFormError] = useState<string | null>(null);

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onBlur",
	});

	const onSubmit = useCallback(
		async (data: z.infer<typeof signUpSchema>) => {
			setFormError(null);
			const formData = new FormData();
			formData.append("email", data.email);
			formData.append("password", data.password);
			formData.append("confirmPassword", data.confirmPassword);

			const result = await signup(formData);

			if ("success" in result) {
				router.push("/");
				toast({
					title: "Success",
					description: "Your account has been created successfully.",
				});
			} else {
				setFormError(result.error || "An unexpected error occurred");
			}
		},
		[toast, router],
	);

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Sign Up</CardTitle>
				<CardDescription>Create an account to get started.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
											placeholder="Create a password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Confirm your password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{formError && (
							<div className="text-sm text-red-500">{formError}</div>
						)}
						<SubmitButton />
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
