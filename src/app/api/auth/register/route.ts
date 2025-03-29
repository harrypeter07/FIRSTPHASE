import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import {
	RegistrationData,
	CompanyRegistrationData,
	InterviewerRegistrationData,
	JobSeekerRegistrationData,
} from "@/types/auth";

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as RegistrationData;
		const { email, password, role } = body;

		console.log("Registration attempt for:", { email, role });

		// Input validation
		if (!email || !password || !role) {
			console.log("Missing required fields:", {
				email: !!email,
				password: !!password,
				role,
			});
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			console.log("Invalid email format:", email);
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 }
			);
		}

		// Password strength validation
		if (password.length < 8) {
			console.log("Password too short");
			return NextResponse.json(
				{ error: "Password must be at least 8 characters long" },
				{ status: 400 }
			);
		}

		// Create user using Supabase Auth
		console.log("Creating user in Supabase Auth...");
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					role: role,
				},
			},
		});

		if (authError) {
			console.error("Error creating user in Auth:", authError);
			return NextResponse.json({ error: authError.message }, { status: 500 });
		}

		if (!authData.user) {
			console.error("No user data returned from Auth");
			return NextResponse.json(
				{ error: "Failed to create user" },
				{ status: 500 }
			);
		}

		console.log("User created successfully:", authData.user.id);

		try {
			// Map profile data based on role
			let profileData;
			if (role === "company") {
				const companyData = body as CompanyRegistrationData;
				profileData = {
					user_id: authData.user.id,
					name: companyData.companyName,
					industry: companyData.industry,
					company_size: companyData.companySize,
					website: companyData.website || null,
					location: companyData.location,
					description: companyData.description || null,
				};
			} else if (role === "interviewer") {
				const interviewerData = body as InterviewerRegistrationData;
				profileData = {
					user_id: authData.user.id,
					full_name: interviewerData.fullName,
					expertise: interviewerData.expertise,
					years_of_experience: interviewerData.yearsOfExperience,
					current_company: interviewerData.currentCompany || null,
					linkedin_profile: interviewerData.linkedinProfile || null,
				};
			} else {
				const jobSeekerData = body as JobSeekerRegistrationData;
				profileData = {
					user_id: authData.user.id,
					full_name: jobSeekerData.fullName,
					skills: jobSeekerData.skills,
					experience: jobSeekerData.experience || null,
					education: jobSeekerData.education || null,
					resume_url: jobSeekerData.resumeUrl || null,
					linkedin_profile: jobSeekerData.linkedinProfile || null,
					portfolio_url: jobSeekerData.portfolioUrl || null,
					preferred_roles: jobSeekerData.preferredRoles,
				};
			}

			// Create profile based on role
			const profileTable =
				role === "company"
					? "companies"
					: role === "interviewer"
					? "interviewers"
					: "job_seekers";

			console.log(`Creating ${role} profile...`, profileData);
			const { error: profileError } = await supabase
				.from(profileTable)
				.insert([profileData]);

			if (profileError) {
				throw profileError;
			}

			console.log("Registration completed successfully");
			return NextResponse.json(
				{
					message: "User registered successfully",
					userId: authData.user.id,
				},
				{ status: 201 }
			);
		} catch (error) {
			console.error(`Error creating ${role} profile:`, error);
			// Try to delete the user if profile creation fails
			try {
				const { error: deleteError } =
					await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
				if (deleteError) {
					console.error(
						"Error deleting user after profile creation failed:",
						deleteError
					);
				}
			} catch (deleteError) {
				console.error("Failed to delete user:", deleteError);
			}

			return NextResponse.json(
				{
					error: "Error creating user profile",
					details: error instanceof Error ? error.message : "Unknown error",
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
