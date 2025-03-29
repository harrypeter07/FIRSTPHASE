export type UserRole = "company" | "interviewer" | "job_seeker";

export interface RegistrationData {
	email: string;
	password: string;
	role: UserRole;
}

export interface CompanyRegistrationData extends RegistrationData {
	companyName: string;
	industry: string;
	companySize: string;
	website?: string;
	location: string;
	description?: string;
}

export interface InterviewerRegistrationData extends RegistrationData {
	fullName: string;
	expertise: string[];
	yearsOfExperience: number;
	currentCompany?: string;
	linkedinProfile?: string;
}

export interface JobSeekerRegistrationData extends RegistrationData {
	fullName: string;
	skills: string[];
	experience?: string;
	education?: string;
	resumeUrl?: string;
	linkedinProfile?: string;
	portfolioUrl?: string;
	preferredRoles: string[];
}
