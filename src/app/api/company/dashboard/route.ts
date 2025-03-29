import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

interface CompanyData {
	id: string;
	name: string;
	industry: string;
	company_size: string;
	location: string;
	user_id: string;
}

interface ApplicationData {
	id: string;
	created_at: string;
	status: string;
	job_seekers: {
		full_name: string;
	};
	jobs: {
		title: string;
	};
}

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return new NextResponse(
				JSON.stringify({ error: "Authentication required" }),
				{ status: 401 }
			);
		}

		if (session.user.role !== "company") {
			return new NextResponse(
				JSON.stringify({ error: "Unauthorized access" }),
				{ status: 403 }
			);
		}

		// Fetch company profile data
		const { data: companyData, error: companyError } = await supabase
			.from("companies")
			.select("*")
			.eq("user_id", session.user.id)
			.single();

		if (companyError) {
			console.error("Error fetching company data:", companyError);
			return new NextResponse(
				JSON.stringify({ error: "Error fetching company data" }),
				{ status: 500 }
			);
		}

		const company = companyData as CompanyData;

		// Fetch active jobs count
		const { count: activeJobs, error: jobsError } = await supabase
			.from("jobs")
			.select("*", { count: "exact" })
			.eq("company_id", company.id)
			.eq("status", "active");

		if (jobsError) {
			console.error("Error fetching jobs count:", jobsError);
			return new NextResponse(
				JSON.stringify({ error: "Error fetching jobs data" }),
				{ status: 500 }
			);
		}

		// Fetch total applications count
		const { count: totalApplications, error: applicationsError } =
			await supabase
				.from("applications")
				.select("*", { count: "exact" })
				.eq("company_id", company.id);

		if (applicationsError) {
			console.error("Error fetching applications count:", applicationsError);
			return new NextResponse(
				JSON.stringify({ error: "Error fetching applications data" }),
				{ status: 500 }
			);
		}

		// Fetch upcoming interviews count
		const { count: upcomingInterviews, error: interviewsError } = await supabase
			.from("interviews")
			.select("*", { count: "exact" })
			.eq("company_id", company.id)
			.gte("scheduled_at", new Date().toISOString());

		if (interviewsError) {
			console.error("Error fetching interviews count:", interviewsError);
			return new NextResponse(
				JSON.stringify({ error: "Error fetching interviews data" }),
				{ status: 500 }
			);
		}

		// Fetch recent applications
		const { data: recentApplications, error: recentError } = await supabase
			.from("applications")
			.select(
				`
        id,
        created_at,
        status,
        job_seekers (
          full_name
        ),
        jobs (
          title
        )
      `
			)
			.eq("company_id", company.id)
			.order("created_at", { ascending: false })
			.limit(5);

		if (recentError) {
			console.error("Error fetching recent applications:", recentError);
			return new NextResponse(
				JSON.stringify({ error: "Error fetching recent applications" }),
				{ status: 500 }
			);
		}

		// Format the response data
		const dashboardData = {
			companyName: company.name,
			industry: company.industry,
			companySize: company.company_size,
			location: company.location,
			activeJobs: activeJobs || 0,
			totalApplications: totalApplications || 0,
			upcomingInterviews: upcomingInterviews || 0,
			recentApplications: (
				recentApplications as unknown as ApplicationData[]
			).map((app) => ({
				id: app.id,
				candidateName: app.job_seekers.full_name,
				position: app.jobs.title,
				appliedDate: new Date(app.created_at).toLocaleDateString(),
				status: app.status,
			})),
		};

		return new NextResponse(JSON.stringify(dashboardData), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Dashboard error:", error);
		return new NextResponse(
			JSON.stringify({ error: "Internal server error" }),
			{ status: 500 }
		);
	}
}
