import { auth } from "@/auth";
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
import { Lock, LogOut, Settings } from "lucide-react";
import { SignInButton } from "./auth/signin-button";
import { SignOutButton } from "./auth/signout-button";

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
							{getUserInitials(session.user.name || "Av")}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>{session.user.email || "User"}</DropdownMenuLabel>
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
					<LogOut className="mr-2 h-4 w-4" />
					<SignOutButton />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function getUserInitials(name: string) {
	const [firstName, lastName] = name.split(" ").toString().toUpperCase();
	return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2);
}
