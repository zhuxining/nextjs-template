"use client";

import { authenticate } from "@/app/(sign)/signin/actions";
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
import { getMessageFromCode } from "@/lib/utils";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export default function SigninForm() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
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
		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("email", data.email);
			formData.append("password", data.password);

			const result = await authenticate(formData);

			if (result) {
				if (result.type === "error")
					toast({
						title: result.resultCode,
						description: getMessageFromCode(result.resultCode),
						variant: "destructive",
					});
				else {
					toast({
						title: result.resultCode,
						description: getMessageFromCode(result.resultCode),
					});
					router.push("/");
				}
			}
		} finally {
			setIsLoading(false);
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
							<Button className="w-full" type="submit" disabled={isLoading}>
								{isLoading ? "Sign In..." : "Sign In"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</main>
	);
}
