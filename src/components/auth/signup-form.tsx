"use client";

import { signup } from "@/app/signup/actions";
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
import { toast } from "@/components/ui/use-toast";
import type { ResultCode } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z
	.object({
		email: z.string().email({
			message: "Please enter a valid email address.",
		}),
		password: z.string().min(6, {
			message: "Password must be at least 6 characters long.",
		}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

interface SignupFormProps {
	signup: (
		formData: FormData,
	) => Promise<{ type: string; resultCode: ResultCode } | undefined>;
}

export default function SignupForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("email", data.email);
			formData.append("password", data.password);

			const result = await signup(formData);

			if (result?.type === "success") {
				toast({
					title: "Account created",
					description: "You have successfully signed up.",
				});
				router.push("/");
			} else {
				throw new Error(
					result?.resultCode || "An error occurred during signup",
				);
			}
		} catch (error) {
			console.error("Signup error:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "An unexpected error occurred. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

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
						<Button className="w-full" type="submit" disabled={isLoading}>
							{isLoading ? "Creating Account..." : "Sign Up"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
