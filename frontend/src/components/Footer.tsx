import logo from "/printflow_logo_dark.png";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="relative overflow-hidden bg-[#171717] text-gray-400 font-sans-clean">
			{/* Top accent */}
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D97706]/60 to-transparent" />

			{/* Subtle background glow */}
			<div className="absolute -top-32 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-[#D97706]/5 blur-3xl" />

			<div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-12">
				{/* Main Footer */}
				<div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
					{/* Left — Logo */}
					<div className="flex justify-center md:justify-start">
						<Link
							to="/#home"
							className="flex items-center transition-opacity hover:opacity-80 "
						>
							<img
								src={logo}
								alt="PrintFlow"
								className="h-12 w-auto rounded-lg"
							/>
						</Link>
					</div>

					{/* Center — Navigation */}
					<nav className="flex items-center justify-center gap-7 sm:gap-9 text-sm font-medium text-gray-400">
						<Link
							to="/#home"
							className="transition-colors hover:text-white"
						>
							Home
						</Link>

						<Link
							to="/#simulator"
							className="transition-colors hover:text-white"
						>
							Simulator
						</Link>

						<Link
							to="/#features"
							className="transition-colors hover:text-white"
						>
							Features
						</Link>
					</nav>

					{/* Right — Project info */}
					<div className="flex justify-center md:justify-end text-center md:text-right">
						<p className="text-xs font-mono-code tracking-wide text-gray-500">
							PrintFlow{" "}
							-
							a project by{" "}
							<span className="text-gray-300">
								Sagar Lonkar
							</span>
						</p>
					</div>
				</div>

				{/* Bottom divider */}
				<div className="mt-8 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-[11px] font-mono-code text-gray-500">
						© {new Date().getFullYear()} PrintFlow
					</p>

					<p className="text-[11px] font-mono-code text-gray-500">
						Upload. Queue. Print.
					</p>
				</div>
			</div>
		</footer>
	);
}