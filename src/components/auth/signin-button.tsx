"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";

export function SignInButton() {
	const pathname = usePathname();
	return (
		<Button disabled={pathname === "/signin"} onClick={() => signIn()}>
			Sign In
		</Button>
	);
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
