"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegistrationForm } from "@/components/forms/RegistrationForm";

interface JobSeekerFormData {
	email: string;
	password: string;
	confirmPassword: string;
	fullName: string;
	skills: string[];
	experience: string;
	education: string;
	resumeUrl: string;
	linkedinProfile: string;
	portfolioUrl: string;
	preferredRoles: string[];
}

export default function JobSeekerRegistrationPage() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Register as a Job Seeker
				</h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<RegistrationForm role="job_seeker" />
				</div>
			</div>
		</div>
	);
}
