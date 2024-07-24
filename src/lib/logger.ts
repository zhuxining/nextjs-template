import pino from "pino";

const logger = pino({
	level: process.env.NODE_ENV === "development" ? "debug" : "info",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
	base: {
		env: process.env.NODE_ENV,
	},
});

export default logger;
