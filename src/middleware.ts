import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const { pathname } = req.nextUrl;

	// Public routes that don't require authentication
	const publicRoutes = [
		"/",
		"/login",
		"/register",
		"/register/company",
		"/register/interviewer",
		"/register/job-seeker",
	];
	if (publicRoutes.includes(pathname)) {
		return NextResponse.next();
	}

	// Protected routes check
	if (!token && !pathname.startsWith("/register")) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// Role-based route protection
	if (token) {
		const userRole = token.role as string;

		if (pathname.startsWith("/dashboard")) {
			// Check if user is accessing the correct dashboard based on their role
			if (pathname.includes("/interviewer") && userRole !== "interviewer") {
				return NextResponse.redirect(new URL("/dashboard", req.url));
			}
			if (pathname.includes("/company") && userRole !== "company") {
				return NextResponse.redirect(new URL("/dashboard", req.url));
			}
			if (pathname.includes("/job-seeker") && userRole !== "job_seeker") {
				return NextResponse.redirect(new URL("/dashboard", req.url));
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/login", "/register/:path*", "/dashboard/:path*"],
};
