"use client";

import { Button } from "@/components/ui/button";

import { signIn } from "next-auth/react";

export function SignInButton() {
	return <Button onClick={() => signIn()}>Sign In</Button>;
}

// export function SignInButton() {
// 	return (
// 		<form
// 			action={async () => {
// 				"use server";
// 				await signIn();
// 			}}
// 		>
// 			<Button type="submit">Sign in</Button>
// 		</form>
// 	);
// }
