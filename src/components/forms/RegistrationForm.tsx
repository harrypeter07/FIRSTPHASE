import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole, RegistrationData } from "@/types/auth";

interface RegistrationFormProps {
	role: UserRole;
}

export function RegistrationForm({ role }: RegistrationFormProps) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const data: Record<string, any> = {
			email: formData.get("email"),
			password: formData.get("password"),
			role,
		};

		// Add role-specific fields
		switch (role) {
			case "company":
				data.companyName = formData.get("companyName");
				data.industry = formData.get("industry");
				data.companySize = formData.get("companySize");
				data.website = formData.get("website");
				data.location = formData.get("location");
				data.description = formData.get("description");
				break;

			case "interviewer":
				data.fullName = formData.get("fullName");
				data.expertise =
					(formData.get("expertise") as string)
						?.split(",")
						.map((s) => s.trim()) || [];
				data.yearsOfExperience = parseInt(
					formData.get("yearsOfExperience") as string
				);
				data.currentCompany = formData.get("currentCompany");
				data.linkedinProfile = formData.get("linkedinProfile");
				break;

			case "job_seeker":
				data.fullName = formData.get("fullName");
				data.skills =
					(formData.get("skills") as string)?.split(",").map((s) => s.trim()) ||
					[];
				data.experience = formData.get("experience");
				data.education = formData.get("education");
				data.resumeUrl = formData.get("resumeUrl");
				data.linkedinProfile = formData.get("linkedinProfile");
				data.portfolioUrl = formData.get("portfolioUrl");
				data.preferredRoles =
					(formData.get("preferredRoles") as string)
						?.split(",")
						.map((s) => s.trim()) || [];
				break;
		}

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "no-cache",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Registration failed");
			}

			// Redirect to login page on success
			router.push("/login?registered=true");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
					{error}
				</div>
			)}

			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700"
				>
					Email
				</label>
				<input
					type="email"
					name="email"
					id="email"
					required
					className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
				/>
			</div>

			<div>
				<label
					htmlFor="password"
					className="block text-sm font-medium text-gray-700"
				>
					Password
				</label>
				<input
					type="password"
					name="password"
					id="password"
					required
					minLength={8}
					className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
				/>
			</div>

			{/* Role-specific fields */}
			{role === "company" && (
				<>
					<div>
						<label
							htmlFor="companyName"
							className="block text-sm font-medium text-gray-700"
						>
							Company Name
						</label>
						<input
							type="text"
							name="companyName"
							id="companyName"
							required
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="industry"
							className="block text-sm font-medium text-gray-700"
						>
							Industry
						</label>
						<input
							type="text"
							name="industry"
							id="industry"
							required
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="companySize"
							className="block text-sm font-medium text-gray-700"
						>
							Company Size
						</label>
						<select
							name="companySize"
							id="companySize"
							required
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						>
							<option value="">Select size</option>
							<option value="1-10">1-10 employees</option>
							<option value="11-50">11-50 employees</option>
							<option value="51-200">51-200 employees</option>
							<option value="201-500">201-500 employees</option>
							<option value="501+">501+ employees</option>
						</select>
					</div>
					<div>
						<label
							htmlFor="website"
							className="block text-sm font-medium text-gray-700"
						>
							Website
						</label>
						<input
							type="url"
							name="website"
							id="website"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="location"
							className="block text-sm font-medium text-gray-700"
						>
							Location
						</label>
						<input
							type="text"
							name="location"
							id="location"
							required
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700"
						>
							Description
						</label>
						<textarea
							name="description"
							id="description"
							rows={4}
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
				</>
			)}

			{role === "interviewer" && (
				<>
					<div>
						<label
							htmlFor="fullName"
							className="block text-sm font-medium text-gray-700"
						>
							Full Name
						</label>
						<input
							type="text"
							name="fullName"
							id="fullName"
							required
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="expertise"
							className="block text-sm font-medium text-gray-700"
						>
							Expertise (comma-separated)
						</label>
						<input
							type="text"
							name="expertise"
							id="expertise"
							required
							placeholder="e.g., JavaScript, React, Node.js"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="yearsOfExperience"
							className="block text-sm font-medium text-gray-700"
						>
							Years of Experience
						</label>
						<input
							type="number"
							name="yearsOfExperience"
							id="yearsOfExperience"
							required
							min="0"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="currentCompany"
							className="block text-sm font-medium text-gray-700"
						>
							Current Company
						</label>
						<input
							type="text"
							name="currentCompany"
							id="currentCompany"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="linkedinProfile"
							className="block text-sm font-medium text-gray-700"
						>
							LinkedIn Profile
						</label>
						<input
							type="url"
							name="linkedinProfile"
							id="linkedinProfile"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
				</>
			)}

			{role === "job_seeker" && (
				<>
					<div>
						<label
							htmlFor="fullName"
							className="block text-sm font-medium text-gray-700"
						>
							Full Name
						</label>
						<input
							type="text"
							name="fullName"
							id="fullName"
							required
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="skills"
							className="block text-sm font-medium text-gray-700"
						>
							Skills (comma-separated)
						</label>
						<input
							type="text"
							name="skills"
							id="skills"
							required
							placeholder="e.g., JavaScript, React, Node.js"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="experience"
							className="block text-sm font-medium text-gray-700"
						>
							Experience
						</label>
						<textarea
							name="experience"
							id="experience"
							rows={4}
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="education"
							className="block text-sm font-medium text-gray-700"
						>
							Education
						</label>
						<textarea
							name="education"
							id="education"
							rows={4}
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="resumeUrl"
							className="block text-sm font-medium text-gray-700"
						>
							Resume URL
						</label>
						<input
							type="url"
							name="resumeUrl"
							id="resumeUrl"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="linkedinProfile"
							className="block text-sm font-medium text-gray-700"
						>
							LinkedIn Profile
						</label>
						<input
							type="url"
							name="linkedinProfile"
							id="linkedinProfile"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="portfolioUrl"
							className="block text-sm font-medium text-gray-700"
						>
							Portfolio URL
						</label>
						<input
							type="url"
							name="portfolioUrl"
							id="portfolioUrl"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label
							htmlFor="preferredRoles"
							className="block text-sm font-medium text-gray-700"
						>
							Preferred Roles (comma-separated)
						</label>
						<input
							type="text"
							name="preferredRoles"
							id="preferredRoles"
							required
							placeholder="e.g., Frontend Developer, Full Stack Developer"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
				</>
			)}

			<button
				type="submit"
				disabled={loading}
				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
			>
				{loading ? "Registering..." : "Register"}
			</button>
		</form>
	);
}
