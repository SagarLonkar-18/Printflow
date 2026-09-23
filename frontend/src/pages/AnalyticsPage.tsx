import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, IndianRupee, FileStack, Files } from "lucide-react";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import DateTabs from "../components/DateTabs";

interface Analytics {
	totalRevenue: number;
	totalFiles: number;
	totalSheets: number;
	bwCount: number;
	colorCount: number;
	singleSidedCount: number;
	doubleSidedCount: number;
}

export default function AnalyticsPage() {
	const [data, setData] = useState<Analytics | null>(null);
	const [loading, setLoading] = useState(true);
	const [dateRange, setDateRange] = useState("today");

	useEffect(() => {
		setLoading(true);
		api
			.get(`/me/analytics?range=${dateRange}`)
			.then((res) => setData(res.data))
			.finally(() => setLoading(false));
	}, [dateRange]);

	return (
		<div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A]">
			<Navbar />

			<div className="max-w-3xl mx-auto px-6 py-12">
				<Link
					to="/dashboard"
					className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-black font-mono-code mb-8"
				>
					<ArrowLeft className="w-3.5 h-3.5" />
					<span>Back to dashboard</span>
				</Link>

				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold font-serif-editorial text-[#1A1A1A]">Analytics</h1>
					<p className="text-sm text-gray-500 font-sans-clean mt-2">
						Revenue and print breakdown for your shop.
					</p>
				</div>

				<DateTabs activeRange={dateRange} onChange={setDateRange} />

				{loading || !data ? (
					<div className="text-center py-16 text-gray-500 font-mono-code text-sm">Loading...</div>
				) : (
					<div className="space-y-6 mt-6">
						{/* Top-level stat cards */}
						<div className="grid grid-cols-3 gap-4">
							<div className="bg-white border border-[#E5E2D9] rounded-2xl p-5">
								<div className="flex items-center space-x-2 text-gray-400 mb-2">
									<IndianRupee className="w-4 h-4" />
									<span className="text-xs font-mono-code uppercase">Revenue</span>
								</div>
								<p className="text-2xl font-bold font-serif-editorial text-[#1A1A1A]">
									₹{data.totalRevenue.toFixed(2)}
								</p>
							</div>

							<div className="bg-white border border-[#E5E2D9] rounded-2xl p-5">
								<div className="flex items-center space-x-2 text-gray-400 mb-2">
									<Files className="w-4 h-4" />
									<span className="text-xs font-mono-code uppercase">Files</span>
								</div>
								<p className="text-2xl font-bold font-serif-editorial text-[#1A1A1A]">{data.totalFiles}</p>
							</div>

							<div className="bg-white border border-[#E5E2D9] rounded-2xl p-5">
								<div className="flex items-center space-x-2 text-gray-400 mb-2">
									<FileStack className="w-4 h-4" />
									<span className="text-xs font-mono-code uppercase">Sheets</span>
								</div>
								<p className="text-2xl font-bold font-serif-editorial text-[#1A1A1A]">{data.totalSheets}</p>
							</div>
						</div>

						{/* Breakdown by color mode */}
						<div className="bg-white border border-[#E5E2D9] rounded-2xl p-6">
							<h3 className="text-sm font-bold text-[#1A1A1A] mb-4">Color mode</h3>
							<BreakdownBar
								leftLabel="Black & White"
								leftCount={data.bwCount}
								rightLabel="Color"
								rightCount={data.colorCount}
							/>
						</div>

						{/* Breakdown by sides */}
						<div className="bg-white border border-[#E5E2D9] rounded-2xl p-6">
							<h3 className="text-sm font-bold text-[#1A1A1A] mb-4">Sides</h3>
							<BreakdownBar
								leftLabel="Single-sided"
								leftCount={data.singleSidedCount}
								rightLabel="Double-sided"
								rightCount={data.doubleSidedCount}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function BreakdownBar({
	leftLabel,
	leftCount,
	rightLabel,
	rightCount,
}: {
	leftLabel: string;
	leftCount: number;
	rightLabel: string;
	rightCount: number;
}) {
	const total = leftCount + rightCount;
	const leftPct = total > 0 ? (leftCount / total) * 100 : 50;

	return (
		<div>
			<div className="flex justify-between text-xs font-mono-code text-gray-500 mb-2">
				<span>
					{leftLabel} &middot; {leftCount}
				</span>
				<span>
					{rightLabel} &middot; {rightCount}
				</span>
			</div>
			<div className="h-2.5 w-full rounded-full bg-[#F2EFE9] overflow-hidden flex">
				<div className="h-full bg-[#1A1A1A]" style={{ width: `${leftPct}%` }} />
				<div className="h-full bg-[#D97706]" style={{ width: `${100 - leftPct}%` }} />
			</div>
		</div>
	);
}