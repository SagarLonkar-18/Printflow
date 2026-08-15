import { QrCode, Upload, Radio, Settings2, LayoutDashboard, CheckCircle2 } from "lucide-react";

const FEATURES = [
	{
		icon: QrCode,
		title: "QR Ordering",
		tag: "scanToOrder()",
		desc: "Customers scan your counter QR code and land on the order page instantly. No app, no download.",
	},
	{
		icon: Upload,
		title: "PDF Upload",
		tag: "uploadDocument()",
		desc: "Customers upload their PDF directly from their phone, preflight-checked before it reaches your queue.",
	},
	{
		icon: Settings2,
		title: "Print Settings",
		tag: "setPrintOptions()",
		desc: "Copies, color mode, paper size, and binding — all chosen by the customer before the order is sent.",
	},
	{
		icon: Radio,
		title: "Live Sync",
		tag: "liveSync()",
		desc: "Orders appear on your dashboard the moment they're submitted, over a live socket connection.",
	},
	{
		icon: LayoutDashboard,
		title: "Order Queue",
		tag: "getOrderQueue()",
		desc: "See every file across every order, filterable by status, so nothing gets missed at the counter.",
	},
	{
		icon: CheckCircle2,
		title: "Status Tracking",
		tag: "updateStatus()",
		desc: "Move files from New to Printing to Completed with a single click, right from the dashboard.",
	},
];

export default function FeaturesSection() {
	return (
		<section id="features" className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
			<div className="max-w-2xl mb-16 space-y-4">
				{/* <span className="text-[#D97706] text-xs font-mono-code font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 border border-orange-200 inline-block">
					Features
				</span> */}
				<h2 className="text-4xl sm:text-5xl font-serif-editorial text-[#1A1A1A]">
					Six pieces. One counter workflow.
				</h2>
				<p className="text-gray-600 font-sans-clean text-base">
					Each piece maps to a clear moment in the order flow, from QR scan to completed print.
				</p>
			</div>

			<div className="border border-[#E5E2D9] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
				{FEATURES.map((f, idx) => {
					const isLastCol = (idx + 1) % 3 === 0;
					const isLastRow = idx >= FEATURES.length - 3;
					return (
						<div
							key={f.title}
							className={`p-8 space-y-4 bg-white ${!isLastCol ? "md:border-r" : ""} ${
								!isLastRow ? "border-b" : ""
							} border-[#E5E2D9]`}
						>
							<div className="w-10 h-10 rounded-xl bg-[#F2EFE9] border border-[#E5E2D9] flex items-center justify-center">
								<f.icon className="w-5 h-5 text-[#1A1A1A]" />
							</div>
							<div>
								<h3 className="font-bold text-[#1A1A1A] text-base font-sans-clean">{f.title}</h3>
								{/* <code className="text-xs font-mono-code text-gray-500 bg-[#F2EFE9] border border-[#E5E2D9] px-2 py-1 rounded-md inline-block mt-1">
									{f.tag}
								</code> */}
							</div>
							<p className="text-sm text-gray-600 font-sans-clean leading-relaxed">{f.desc}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}