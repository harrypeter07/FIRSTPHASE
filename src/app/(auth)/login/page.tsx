"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const result = await signIn("credentials", {
				redirect: false,
				email: formData.email,
				password: formData.password,
			});

			if (result?.error) {
				setError(result.error);
			} else {
				// Get the user's role from the session
				const response = await fetch("/api/auth/session");
				const session = await response.json();

				// Redirect based on role
				switch (session?.user?.role) {
					case "interviewer":
						router.push("/dashboard/interviewer");
						break;
					case "company":
						router.push("/dashboard/company");
						break;
					case "job_seeker":
						router.push("/dashboard/job-seeker");
						break;
					default:
						router.push("/dashboard");
				}
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Email address"
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Password"
								value={formData.password}
								onChange={handleChange}
							/>
						</div>
					</div>

					{error && (
						<div className="text-red-500 text-sm text-center">{error}</div>
					)}

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
								isLoading
									? "bg-indigo-400"
									: "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							}`}
						>
							{isLoading ? "Signing in..." : "Sign in"}
						</button>
					</div>

					<div className="text-sm text-center">
						<Link
							href="/register"
							className="font-medium text-indigo-600 hover:text-indigo-500"
						>
							Don&apos;t have an account? Register
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
