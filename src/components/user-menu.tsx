import { auth, signIn, signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, Lock, LogOut, Settings } from "lucide-react";

import Link from "next/link";

export default async function UserMenu() {
	const session = await auth();

	if (!session) return <SignInButton />;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<Avatar>
						{session.user.image && (
							<AvatarImage
								src={session.user.image}
								alt="User profile picture"
							/>
						)}
						<AvatarFallback>
							{getUserInitials(session.user.email || "Av")}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>{session.user.name || "User"}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/settings">
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
					{session.user.role === "admin" && (
						<DropdownMenuItem asChild>
							<Link href="/admin">
								<Lock className="mr-2 h-4 w-4" />
								Admin
							</Link>
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<SignOutButton />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function SignInButton() {
	return (
		<form
			action={async () => {
				"use server";
				await signIn();
			}}
		>
			<Button type="submit">Sign in</Button>
		</form>
	);
}

function SignOutButton() {
	return (
		<form
			action={async () => {
				"use server";
				await signOut({ redirectTo: "/" });
			}}
		>
			<button type="submit">Sign Out</button>
		</form>
	);
}

function getUserInitials(name: string) {
	const [firstName, lastName] = name.split(" ").toString().toUpperCase();
	return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2);
}
