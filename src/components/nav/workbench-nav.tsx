"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarNavItem } from "../../../types";

interface DashboardNavProps {
	items: SidebarNavItem[];
}
export function DashboardNav({ items }: DashboardNavProps) {
	const path = usePathname();

	if (!items?.length) {
		return null;
	}

	return (
		<nav className="grid items-start gap-2">
			{items.map((item) => {
				const Icon = item.icon;
				return (
					item.href && (
						<Link key={item.title} href={item.disabled ? "/" : item.href}>
							<span
								className={cn(
									"group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
									path === item.href ? "bg-accent" : "transparent",
									item.disabled && "cursor-not-allowed opacity-80",
								)}
							>
								<Icon className="mr-2 h-4 w-4" />
								<span>{item.title}</span>
							</span>
						</Link>
					)
				);
			})}
		</nav>
	);
}
