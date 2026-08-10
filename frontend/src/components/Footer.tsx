import { Printer } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-[#1A1A1A] text-gray-400 py-12 text-sm font-sans-clean">
			<div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center text-white font-bold">
						<Printer className="w-4 h-4" />
					</div>
					<span className="font-serif-editorial font-bold text-white text-xl">
						Print<span className="text-[#D97706]">Flow</span>
					</span>
				</div>

				<div className="flex items-center space-x-6 text-xs font-mono-code text-gray-300">
					<a href="#simulator" className="hover:text-white transition">Simulator</a>
					<a href="#how-it-works" className="hover:text-white transition">How It Works</a>
					<a href="#faq" className="hover:text-white transition">FAQ</a>
				</div>

				<div className="text-xs font-mono-code text-gray-500">PrintFlow - a project by Sagar Lonkar</div>
			</div>
		</footer>
	);
}