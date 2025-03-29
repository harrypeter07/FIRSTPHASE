export type UserRole = "company" | "interviewer" | "job_seeker";

export interface BaseRegistrationData {
	email: string;
	password: string;
	role: UserRole;
}

export interface CompanyRegistrationData extends BaseRegistrationData {
	role: "company";
	companyName: string;
	industry: string;
	companySize: string;
	website?: string;
	location: string;
	description?: string;
}

export interface InterviewerRegistrationData extends BaseRegistrationData {
	role: "interviewer";
	fullName: string;
	expertise: string[];
	yearsOfExperience: number;
	currentCompany?: string;
	linkedinProfile?: string;
}

export interface JobSeekerRegistrationData extends BaseRegistrationData {
	role: "job_seeker";
	fullName: string;
	skills: string[];
	experience?: string;
	education?: string;
	resumeUrl?: string;
	linkedinProfile?: string;
	portfolioUrl?: string;
	preferredRoles: string[];
}

export type RegistrationData =
	| CompanyRegistrationData
	| InterviewerRegistrationData
	| JobSeekerRegistrationData;
