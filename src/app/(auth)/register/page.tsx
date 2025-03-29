"use client";

import Link from "next/link";

export default function RegisterPage() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Choose Your Role
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Select how you want to join our platform
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<nav className="space-y-4">
						<Link
							href="/register/company"
							className="w-full flex items-center justify-center px-4 py-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Register as a Company
						</Link>

						<Link
							href="/register/interviewer"
							className="w-full flex items-center justify-center px-4 py-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Register as an Interviewer
						</Link>

						<Link
							href="/register/job-seeker"
							className="w-full flex items-center justify-center px-4 py-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Register as a Job Seeker
						</Link>
					</nav>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Already have an account?
								</span>
							</div>
						</div>

						<div className="mt-6">
							<Link
								href="/login"
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
							>
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
