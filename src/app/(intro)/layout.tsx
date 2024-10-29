import Link from "next/link";

import { auth } from "@/auth";
import { Footer } from "@/components/footer";
import Header from "@/components/header";

interface MarketingLayoutProps {
	children: React.ReactNode;
}

export default async function MarketingLayout({
	children,
}: MarketingLayoutProps) {
	const session = await auth();
	return (
		<div className="min-h-screen flex flex-col ">
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
