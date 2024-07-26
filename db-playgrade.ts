import prisma from "@/lib/prisma";

async function main() {
	// ... you will write your Prisma Client queries here
	const user = await prisma.user.create({
		data: {
			name: "aa",
			email: "bbfddb@prisma.io",
			role: "admin",
			password: "123123",
			salt: "sadf",
		},
	});
	console.log(user);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
