import type { Icon, LucideIcon } from "lucide-react";

export type SiteConfig = {
	name: string;
	description: string;
	url: string;
	ogImage: string;
	links: {
		twitter: string;
		github: string;
	};
};

export type NavItem = {
	title: string;
	href: string;
	disabled?: boolean;
};

export type IntroNavItem = NavItem;

export type SidebarNavItem = {
	title: string;
	disabled?: boolean;
	external?: boolean;
	icon?: Icon;
} & (
	| {
			href: string;
			items?: never;
	  }
	| {
			href?: string;
			items: NavLink[];
	  }
);

export type DocsConfig = {
	IntroNav: IntroNavItem[];
	sidebarNav: SidebarNavItem[];
};

export type MarketingConfig = {
	IntroNav: IntroNavItem[];
};

export type DashboardConfig = {
	IntroNav: IntroNavItem[];
	sidebarNav: SidebarNavItem[];
};
