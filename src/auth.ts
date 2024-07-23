import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import authConfig from "./auth.config";

const nodeMailerProvider = Nodemailer({
	server: {
		host: process.env.EMAIL_SERVER_HOST,
		port: Number(process.env.EMAIL_SERVER_PORT),
		auth: {
			user: process.env.EMAIL_SERVER_USER,
			pass: process.env.EMAIL_SERVER_PASSWORD,
		},
	},
	from: process.env.EMAIL_FROM,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [...authConfig.providers, nodeMailerProvider],
	logger: {
		error(code, ...message) {
			console.error(code, message);
		},
		warn(code, ...message) {
			console.warn(code, message);
		},
		debug(code, ...message) {
			console.debug(code, message);
		},
	},
});
