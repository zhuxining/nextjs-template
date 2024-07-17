import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
// import { getUser } from "./app/login/actions";
import { authConfig } from "./auth.config";
import { getStringFromBuffer } from "./lib/utils";

export const { auth, signIn, signOut, handlers } = NextAuth({
	...authConfig,
});
