import { SignOutButton } from "@/components/auth/signout-button";
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
import type { User } from "next-auth";
import Link from "next/link";

interface UserMenuProps {
	user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<Avatar>
						{user.image && (
							<AvatarImage src={user.image} alt="User profile picture" />
						)}
						<AvatarFallback>{getUserInitials(user.name || "X")}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>{user.email}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/settings">
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
					{user.role === "admin" && (
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
