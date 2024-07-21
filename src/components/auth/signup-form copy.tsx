"use client";

import { signIn } from "@/auth";
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
import prisma from "@/lib/prisma";
import { getStringFromBuffer } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export async function getUser(email: string) {
	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});
	return user;
}

export async function createUser(
	email: string,
	hashedPassword: string,
	salt: string,
) {
	const existingUser = await getUser(email);

	if (existingUser) {
		return {
			type: "error",
			description: "User already exists.",
		};
	}
	{
		const user = {
			email,
			password: hashedPassword,
			salt,
		};

		await prisma.user.create({
			data: user,
		});

		return {
			type: "success",
			description: "User created successfully.",
		};
	}
}

const FormSchema = z
	.object({
		email: z.string().email({
			message: "Please enter a valid email address.",
		}),
		password: z.string().min(8, {
			message: "Password must be at least 8 characters long.",
		}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export default function SignupPage() {
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
			const salt = crypto.randomUUID();
			const encoder = new TextEncoder();
			const saltedPassword = encoder.encode(data.password + salt);
			const hashedPasswordBuffer = await crypto.subtle.digest(
				"SHA-512",
				saltedPassword,
			);
			const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);

			const result = await createUser(data.email, hashedPassword, salt);

			if (result.type === "success") {
				const signInResult = await signIn("credentials", {
					email: data.email,
					password: data.password,
					redirect: false,
				});

				if (signInResult?.error) {
					throw new Error(signInResult.error);
				}

				toast({
					title: "Account created",
					description: "You have successfully signed up.",
				});
				router.push("/login");
			} else {
				throw new Error(result.description);
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
		<main className="container flex items-center justify-center min-h-screen">
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
		</main>
	);
}
