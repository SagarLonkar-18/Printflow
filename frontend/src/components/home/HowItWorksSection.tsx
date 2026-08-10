import { QrCode, Upload, Bell } from "lucide-react";

const STEPS = [
	{ step: "01", title: "Customer Scans QR Standee", desc: "Place our sleek acrylic QR code stand on your counter. Customers scan with any camera—zero app downloads.", icon: QrCode },
	{ step: "02", title: "Uploads PDF & Sets Options", desc: "Customer selects their PDF, specifies copies, B&W or color, paper size, and binding preference instantly.", icon: Upload },
	{ step: "03", title: "Order Pops on Dashboard", desc: "Owner sees the order the instant it's submitted. Click 'Start Printing', then 'Mark Ready' when done.", icon: Bell },
];

export default function HowItWorksSection() {
	return (
		<section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
			<div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
				<span className="text-[#D97706] text-xs font-mono-code font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 border border-orange-200">
					Architected for Speed
				</span>
				<h2 className="text-4xl sm:text-5xl font-serif-editorial text-[#1A1A1A]">
					From WhatsApp chaos to 3 streamlined steps
				</h2>
				<p className="text-gray-600 font-sans-clean text-base">
					No phone numbers to save, no messy document formats, no pricing haggling.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{STEPS.map((item, idx) => (
					<div
						key={idx}
						className="bg-[#F2EFE9] border border-[#E5E2D9] rounded-3xl p-8 relative space-y-6 hover:border-[#D97706] transition duration-300"
					>
						<div className="absolute top-6 right-6 font-mono-code font-extrabold text-4xl text-gray-300">
							{item.step}
						</div>
						<div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-md">
							<item.icon className="w-7 h-7 text-[#D97706]" />
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-bold font-serif-editorial text-[#1A1A1A]">{item.title}</h3>
							<p className="text-gray-600 text-sm font-sans-clean leading-relaxed">{item.desc}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}