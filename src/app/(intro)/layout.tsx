import Link from "next/link";

import { auth } from "@/auth";
import { SignInButton } from "@/components/auth/signin-button";
import { IntroNav } from "@/components/nav/intro-nav";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";
import { marketingConfig } from "@/config/intro";
import { cn } from "@/lib/utils";

interface MarketingLayoutProps {
	children: React.ReactNode;
}

export default async function MarketingLayout({
	children,
}: MarketingLayoutProps) {
	const session = await auth();
	return (
		<div className="flex min-h-screen flex-col">
			<header className="container z-40 bg-background">
				<div className="flex h-20 items-center justify-between py-6">
					<IntroNav items={marketingConfig.IntroNav} />
					<nav>
						<ThemeToggle />
						{session?.user ? (
							<UserMenu user={session.user} />
						) : (
							<SignInButton />
						)}
					</nav>
				</div>
			</header>
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}
