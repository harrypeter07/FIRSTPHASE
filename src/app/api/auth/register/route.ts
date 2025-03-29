/* eslint-disable @typescript-eslint/no-explicit-any */
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

    console.log("Registration attempt:", { email, role });

    // Input validation
    if (!email || !password || !role) {
      console.log("Missing required fields:", { email: !!email, password: !!password, role });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Password strength validation
    if (password.length < 8) {
      console.log("Password too short:", password.length);
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    console.log("Creating user in Supabase Auth...");
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (authError) {
      console.error("Auth signup error:", authError.message, authError.status);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      console.error("No user data returned from signup:", authData);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    console.log("User created successfully:", authData.user.id);

    // Map profile data based on role
    let profileData: any;
    const profileTable =
      role === "company" ? "companies" : role === "interviewer" ? "interviewers" : "job_seekers";

    if (role === "company") {
      const companyData = body as CompanyRegistrationData;
      // Validate required fields
      if (!companyData.companyName || !companyData.industry || !companyData.companySize || !companyData.location) {
        console.log("Missing required company fields:", companyData);
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id); // Cleanup
        return NextResponse.json({ error: "Missing required company fields" }, { status: 400 });
      }
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
      // Validate required fields
      if (!interviewerData.fullName || !interviewerData.expertise || !interviewerData.yearsOfExperience) {
        console.log("Missing required interviewer fields:", interviewerData);
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id); // Cleanup
        return NextResponse.json({ error: "Missing required interviewer fields" }, { status: 400 });
      }
      profileData = {
        user_id: authData.user.id,
        full_name: interviewerData.fullName,
        expertise: Array.isArray(interviewerData.expertise) 
          ? interviewerData.expertise 
          : (interviewerData.expertise as string).split(",").map((s: string) => s.trim()),
        years_of_experience: Number(interviewerData.yearsOfExperience),
        current_company: interviewerData.currentCompany || null,
        linkedin_profile: interviewerData.linkedinProfile || null,
      };
    } else if (role === "job_seeker") {
      const jobSeekerData = body as JobSeekerRegistrationData;
      // Validate required fields
      if (!jobSeekerData.fullName || !jobSeekerData.skills || !jobSeekerData.preferredRoles) {
        console.log("Missing required job seeker fields:", jobSeekerData);
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id); // Cleanup
        return NextResponse.json({ error: "Missing required job seeker fields" }, { status: 400 });
      }
      profileData = {
        user_id: authData.user.id,
        full_name: jobSeekerData.fullName,
        skills: Array.isArray(jobSeekerData.skills) 
          ? jobSeekerData.skills 
          : (jobSeekerData.skills as string).split(",").map((s: string) => s.trim()),
        experience: jobSeekerData.experience || null,
        education: jobSeekerData.education || null,
        resume_url: jobSeekerData.resumeUrl || null,
        linkedin_profile: jobSeekerData.linkedinProfile || null,
        portfolio_url: jobSeekerData.portfolioUrl || null,
        preferred_roles: Array.isArray(jobSeekerData.preferredRoles)
          ? jobSeekerData.preferredRoles
          : (jobSeekerData.preferredRoles as string).split(",").map((s: string) => s.trim()),
      };
    } else {
      console.error("Invalid role:", role);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id); // Cleanup
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Log the data being inserted
    console.log(`Inserting into ${profileTable}:`, profileData);

    // Insert profile data using the service role client to bypass RLS
    const { error: profileError } = await supabaseAdmin.from(profileTable).insert([profileData]);

    if (profileError) {
      console.error(`Profile insert error for ${profileTable}:`, profileError.message, profileError.details, profileError.hint);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id); // Cleanup
      return NextResponse.json(
        { error: `Failed to create ${role} profile: ${profileError.message}` },
        { status: 500 }
      );
    }

    console.log("Profile created successfully for:", { email, role });

    return NextResponse.json(
      {
        message: "Please check your email to confirm your account",
        userId: authData.user.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Error creating user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}