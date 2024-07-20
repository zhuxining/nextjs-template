"use client";

import { Button } from "@/components/ui/button";

import { signOut } from "next-auth/react";

export function SignOutButton() {
	return (
		<button type="button" onClick={() => signOut()}>
			Signout
		</button>
	);
}

// function SignOutButton() {
// 	return (
// 		<form
// 			action={async () => {
// 				"use server";
// 				await signOut({ redirectTo: "/login" });
// 			}}
// 		>
// 			<button type="submit">Sign Out</button>
// 		</form>

// 	);
// }
