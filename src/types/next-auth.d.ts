import "next-auth";
import { UserRole } from "./auth";

declare module "next-auth" {
	interface User {
		id: string;
		email: string;
		name: string;
		role: UserRole;
	}

	interface Session {
		user: User & {
			id: string;
			role: UserRole;
		};
	}
}
