"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CompanyDashboardData {
	companyName: string;
	industry: string;
	companySize: string;
	location: string;
	activeJobs: number;
	totalApplications: number;
	upcomingInterviews: number;
	recentApplications: Array<{
		id: string;
		candidateName: string;
		position: string;
		appliedDate: string;
		status: string;
	}>;
}

export default function CompanyDashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [dashboardData, setDashboardData] =
		useState<CompanyDashboardData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		} else if (
			status === "authenticated" &&
			session?.user?.role !== "company"
		) {
			router.push("/dashboard");
		}
	}, [status, session, router]);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const response = await fetch("/api/company/dashboard");
				if (!response.ok) {
					throw new Error("Failed to fetch dashboard data");
				}
				const data = await response.json();
				setDashboardData(data);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (session?.user) {
			fetchDashboardData();
		}
	}, [session]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="py-10">
				<header>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold leading-tight text-gray-900">
							Company Dashboard
						</h1>
					</div>
				</header>
				<main>
					<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
						{/* Stats Overview */}
						<div className="mt-8">
							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
								{/* Active Jobs Card */}
								<div className="bg-white overflow-hidden shadow rounded-lg">
									<div className="p-5">
										<div className="flex items-center">
											<div className="flex-shrink-0">
												<svg
													className="h-6 w-6 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
											</div>
											<div className="ml-5 w-0 flex-1">
												<dl>
													<dt className="text-sm font-medium text-gray-500 truncate">
														Active Jobs
													</dt>
													<dd className="flex items-baseline">
														<div className="text-2xl font-semibold text-gray-900">
															{dashboardData?.activeJobs || 0}
														</div>
													</dd>
												</dl>
											</div>
										</div>
									</div>
								</div>

								{/* Total Applications Card */}
								<div className="bg-white overflow-hidden shadow rounded-lg">
									<div className="p-5">
										<div className="flex items-center">
											<div className="flex-shrink-0">
												<svg
													className="h-6 w-6 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
													/>
												</svg>
											</div>
											<div className="ml-5 w-0 flex-1">
												<dl>
													<dt className="text-sm font-medium text-gray-500 truncate">
														Total Applications
													</dt>
													<dd className="flex items-baseline">
														<div className="text-2xl font-semibold text-gray-900">
															{dashboardData?.totalApplications || 0}
														</div>
													</dd>
												</dl>
											</div>
										</div>
									</div>
								</div>

								{/* Upcoming Interviews Card */}
								<div className="bg-white overflow-hidden shadow rounded-lg">
									<div className="p-5">
										<div className="flex items-center">
											<div className="flex-shrink-0">
												<svg
													className="h-6 w-6 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
											</div>
											<div className="ml-5 w-0 flex-1">
												<dl>
													<dt className="text-sm font-medium text-gray-500 truncate">
														Upcoming Interviews
													</dt>
													<dd className="flex items-baseline">
														<div className="text-2xl font-semibold text-gray-900">
															{dashboardData?.upcomingInterviews || 0}
														</div>
													</dd>
												</dl>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Recent Applications */}
						<div className="mt-8">
							<div className="bg-white shadow overflow-hidden sm:rounded-md">
								<div className="px-4 py-5 border-b border-gray-200 sm:px-6">
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Recent Applications
									</h3>
								</div>
								<ul role="list" className="divide-y divide-gray-200">
									{dashboardData?.recentApplications?.map((application) => (
										<li key={application.id}>
											<div className="px-4 py-4 sm:px-6">
												<div className="flex items-center justify-between">
													<div className="text-sm font-medium text-indigo-600 truncate">
														{application.candidateName}
													</div>
													<div className="ml-2 flex-shrink-0 flex">
														<span
															className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
																application.status === "pending"
																	? "bg-yellow-100 text-yellow-800"
																	: application.status === "accepted"
																	? "bg-green-100 text-green-800"
																	: "bg-red-100 text-red-800"
															}`}
														>
															{application.status}
														</span>
													</div>
												</div>
												<div className="mt-2 sm:flex sm:justify-between">
													<div className="sm:flex">
														<div className="flex items-center text-sm text-gray-500">
															<svg
																className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth="2"
																	d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
																/>
															</svg>
															{application.position}
														</div>
													</div>
													<div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
														<svg
															className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth="2"
																d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
															/>
														</svg>
														Applied on {application.appliedDate}
													</div>
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="mt-8">
							<div className="bg-white shadow sm:rounded-lg">
								<div className="px-4 py-5 sm:p-6">
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Quick Actions
									</h3>
									<div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
										<button
											type="button"
											className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										>
											<svg
												className="-ml-1 mr-2 h-5 w-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M12 6v6m0 0v6m0-6h6m-6 0H6"
												/>
											</svg>
											Post New Job
										</button>
										<button
											type="button"
											className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										>
											<svg
												className="-ml-1 mr-2 h-5 w-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											View Applications
										</button>
										<button
											type="button"
											className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										>
											<svg
												className="-ml-1 mr-2 h-5 w-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											Schedule Interviews
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
