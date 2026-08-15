import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export default function HeroSection() {
	const navigate = useNavigate();
	const token = useAuthStore((s) => s.token);

	return (
		<section id="home" className="relative overflow-hidden pt-14 sm:pt-20 pb-4 scroll-mt-20">
			{/* =====================================================
				DECORATIVE ELEMENTS — desktop only
			===================================================== */}

			{/* LEFT — PDF image */}
			<div className="pointer-events-none absolute left-[5%] top-[16%] hidden xl:block hero-float-left">
					<img
						src="/pdf-icon.png"
						alt=""
						className="w-[150px] h-auto drop-shadow-[0_18px_32px_rgba(0,0,0,0.16)]"
					/>
			</div>

			{/* RIGHT — Receipt image */}
			<div className="pointer-events-none absolute right-[1%] top-[18%] hidden xl:block hero-float-right">
					<img
						src="/receipt-icon.png"
						alt=""
						className="w-[350px] h-auto drop-shadow-[0_20px_38px_rgba(0,0,0,0.16)]"
					/>
			</div>

			{/* =====================================================
				MAIN HERO CONTENT
			===================================================== */}

			<div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 px-6 lg:px-12">
				<h1 className="text-5xl sm:text-7xl font-serif-editorial tracking-tight text-[#1A1A1A] leading-[1.05]">
					Instant Print Orders for{" "}
					<span className="italic text-[#D97706]">
						PDF Uploads & QR Scans
					</span>
					, Without WhatsApp.
				</h1>

				<p className="text-lg sm:text-xl text-gray-600 font-sans-clean leading-relaxed max-w-2xl mx-auto font-normal">
					PrintFlow connects walk-in and remote customers directly to
					your shop counter dashboard. Customers scan your QR code,
					upload PDFs, pick print settings, and your dashboard updates
					instantly.
				</p>

				<div className="flex justify-center pt-2">
					<button
						onClick={() =>
							navigate(token ? "/dashboard" : "/signup")
						}
						className="bg-[#1A1A1A] hover:bg-black text-white px-8 py-4 rounded-full font-sans-clean font-semibold text-sm shadow-lg transition hover:cursor-pointer"
					>
						{token ? "Back to Dashboard" : "Get Started"}
					</button>
				</div>
			</div>

			{/* =====================================================
				FULL WIDTH PRODUCT VIDEO
			===================================================== */}

			<div className="relative z-10 mt-4 w-screen left-1/2 right-1/2 -mx-[50vw]">
				<div className="relative w-full">
					<video
						className="w-full h-auto block"
						autoPlay
						muted
						loop
						playsInline
						poster="/product-preview-poster.jpg"
					>
						<source src="/product-demo.mov" type="video/mp4" />
					</video>

					{/* Wavy cloud - top */}
					<svg
						className="absolute -top-px left-0 w-[100%] -ml-[0.5%] pointer-events-none"
						style={{
							height: "10vw",
							minHeight: "60px",
							maxHeight: "140px",
						}}
						viewBox="0 0 1440 160"
						preserveAspectRatio="none"
					>
						<path
							d="M0,80 C 240,140 480,20 720,60 C 960,100 1200,20 1440,70 L1440,0 L0,0 Z"
							fill="#ffffff"
						/>
					</svg>

					{/* Wavy cloud - bottom */}
					<svg
						className="absolute -bottom-px left-0 w-[100%] -ml-[0.5%] pointer-events-none"
						style={{
							height: "12vw",
							minHeight: "70px",
							maxHeight: "160px",
						}}
						viewBox="0 0 1440 160"
						preserveAspectRatio="none"
					>
						<path
							d="M0,80 C 240,20 480,140 720,90 C 960,40 1200,120 1440,60 L1440,160 L0,160 Z"
							fill="#F2EFE9"
						/>
					</svg>
				</div>
			</div>
		</section>
	);
}