import { Sparkles } from "lucide-react";

export default function HeroSection() {
	return (
		<section className="relative pt-16 pb-28 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
				<div className="lg:col-span-7 space-y-8">
					<h1 className="text-5xl sm:text-7xl font-serif-editorial tracking-tight text-[#1A1A1A] leading-[1.05]">
						Instant Print Orders for{" "}
						<span className="italic text-[#D97706]">PDF Uploads & QR Scans</span> Without WhatsApp.
					</h1>

					<p className="text-lg sm:text-xl text-gray-600 font-sans-clean leading-relaxed max-w-2xl font-normal">
						PrintFlow connects walk-in and remote customers directly to your shop counter dashboard.
						Customers scan your QR code, upload PDFs, pick print settings, and your dashboard updates
						instantly.
					</p>

					<div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
						<a
							href="#simulator"
							className="bg-[#1A1A1A] hover:bg-black text-white px-8 py-4 rounded-full font-sans-clean font-semibold text-sm shadow-lg transition flex items-center justify-center space-x-3 group"
						>
							<span>Try Interactive Simulator</span>
						</a>
					</div>

					<div className="pt-6 border-t border-[#E5E2D9] text-[11px] font-mono-code uppercase tracking-widest text-gray-500">
						Designed for photocopy shops, print hubs, university copy centers & digital presses.
					</div>
				</div>

				<div className="lg:col-span-5 flex justify-center">
					<div className="relative w-full max-w-md bg-[#F2EFE9] border border-[#E5E2D9] rounded-3xl p-8 shadow-2xl overflow-hidden">
						<div className="absolute top-4 right-4 bg-[#D97706] text-white text-[10px] font-mono-code uppercase px-3 py-1 rounded-full font-bold">
							LIVE DEMO STAND
						</div>

						<div className="text-center space-y-4 py-6">
							<div className="w-40 h-40 mx-auto bg-white p-4 rounded-2xl shadow-inner border border-[#E5E2D9]">
								<img
									src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://printflow.shop/demo"
									alt="PrintFlow QR Stand"
									className="w-full h-full rounded"
								/>
							</div>
							<div>
								<h3 className="font-serif-editorial text-2xl text-[#1A1A1A]">Gupta Xerox & Press</h3>
								<p className="text-xs font-mono-code text-[#D97706] mt-1">
									Scan camera to test customer flow
								</p>
							</div>

							<div className="pt-4">
								<a
									href="#simulator"
									className="inline-flex items-center space-x-2 bg-[#1A1A1A] text-white text-xs font-mono-code px-5 py-2.5 rounded-xl hover:bg-black transition shadow"
								>
									<Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
									<span>Launch Interactive Simulator</span>
								</a>
							</div>
						</div>

						<div className="mt-4 pt-4 border-t border-[#E5E2D9] text-xs font-mono-code flex items-center justify-between text-gray-600">
							<span>Incoming: Tax_Audit.pdf</span>
							<span className="text-green-600 font-bold flex items-center">
								<span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping mr-1" /> Live
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}