"use client";

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
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
export default function SigninForm() {
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	});

	async function onSubmit(data: z.infer<typeof signInSchema>) {
		try {
			const result = await signIn("credentials", {
				email: data.email?.toString().toLowerCase(),
				password: data.password,
				redirect: false,
			});

			if (result?.error) {
				toast({
					title: "Error",
					description: "Invalid email or password.",
					variant: "destructive",
				});
			} else {
				router.push("/"); // Redirect to dashboard or home page
				toast({
					title: "Success",
					description: "You have successfully logged in.",
				});
			}
		} catch (error) {
			if (error instanceof AuthError) {
				return { error: "error", message: error.message, status: 401 };
			}

			throw error;
		}
	}

	return (
		<main className="container flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
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
							<Button className="w-full" type="submit">
								Sign In
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</main>
	);
}
