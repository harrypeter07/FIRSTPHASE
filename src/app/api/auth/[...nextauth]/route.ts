import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/types/auth";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password required");
				}

				try {
					const {
						data: { user },
						error,
					} = await supabase.auth.signInWithPassword({
						email: credentials.email,
						password: credentials.password,
					});

					if (error) {
						throw new Error(error.message);
					}

					if (!user) {
						throw new Error("User not found");
					}

					// Get user's role from user metadata
					const role = user.user_metadata?.role as UserRole;
					if (!role) {
						throw new Error("User role not found");
					}

					// Get user's profile based on role
					const profileTable =
						role === "company"
							? "companies"
							: role === "interviewer"
							? "interviewers"
							: "job_seekers";

					const { data: profileData, error: profileError } = await supabase
						.from(profileTable)
						.select("*")
						.eq("user_id", user.id)
						.single();

					if (profileError) {
						console.error(`Error fetching ${role} profile:`, profileError);
						throw new Error(`Error fetching ${role} profile`);
					}

					if (!profileData) {
						throw new Error(`${role} profile not found`);
					}

					// Return type must match the User interface
					return {
						id: user.id,
						email: user.email!,
						name: role === "company" ? profileData.name : profileData.full_name,
						role: role,
					};
				} catch (error) {
					console.error("Authorization error:", error);
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: "/login",
		signOut: "/login",
		error: "/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as UserRole;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
