import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
	Menu,
	X,
	LogOut,
	LayoutDashboard,
	UserRound,
	QrCode,
	ChevronDown,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
// import logo from "/printflow-logo-with-bg.png";
import logo from "/printflow_logo_light.png";
import { api } from "../lib/api";

export default function Navbar() {
	const navigate = useNavigate();

	const token = useAuthStore((s) => s.token);
	const logout = useAuthStore((s) => s.logout);

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);

	const [shop, setShop] = useState<{ name: string } | null>(null);
	const user = useAuthStore((s) => s.user);

	useEffect(() => {
		if (!token) return;
		api.get("/me/shop").then((res) => setShop(res.data));
	}, [token]);

	function handleLogout() {
		logout();
		setProfileOpen(false);
		setMobileMenuOpen(false);
		navigate("/login");
	}

	const navLinks = [
		{ label: "Home", to: "/#home" },
		{ label: "Live Simulator", to: "/#simulator" },
		{ label: "Features", to: "/#features" },
	];

	return (
		<nav className="sticky top-0 z-50 px-3 sm:px-6 lg:px-10 pt-3 sm:pt-4">
			<div
				className="
					max-w-[1450px]
					mx-auto
					h-[60px]
					sm:h-[64px]
					px-2
					sm:px-7
					lg:px-10

					flex
					items-center
					justify-between
					lg:grid
					lg:grid-cols-[1fr_auto_1fr]

					rounded-[22px]
					border
					border-white/40

					bg-white/25
					backdrop-blur-3xl
					backdrop-saturate-200

					shadow-[0_8px_32px_rgba(31,31,31,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]
				"
			>
				{/* LEFT — LOGO (grid column 1) */}
				<div className="flex items-center justify-start">
					<Link to="/#home" className="flex items-center">
						<img
							src={logo}
							alt="PrintFlow"
							className="
								h-10
								sm:h-12
								w-auto
								object-contain
								scale-110
								origin-left rounded-lg
							"
						/>
					</Link>
				</div>

				{/* CENTER — DESKTOP NAVIGATION (grid column 2) */}
				<div className="hidden lg:flex items-center justify-center gap-10">
					{navLinks.map((link) =>
						link.to.startsWith("/#") ? (
							<Link
								key={link.label}
								to={link.to}
								className="
									text-sm
									font-medium
									text-[#4B5563]
									hover:text-[#1A1A1A]
									transition-colors
									whitespace-nowrap
								"
							>
								{link.label}
							</Link>
						) : (
							<Link
								key={link.label}
								to={link.to}
								className="
									text-sm
									font-medium
									text-[#4B5563]
									hover:text-[#1A1A1A]
									transition-colors
									whitespace-nowrap
								"
							>
								{link.label}
							</Link>
						),
					)}
				</div>

				{/* RIGHT (grid column 3) — this ONE div holds both desktop actions
				    AND the mobile menu button, so it never wraps to a new grid row */}
				<div className="flex items-center justify-end gap-2.5">
					{/* Desktop-only actions */}
					<div className="hidden md:flex items-center gap-2.5">
						{token ? (
							<>
								{/* Dashboard */}
								<Link
									to="/dashboard"
									className="
										group
										flex
										items-center
										gap-2
										px-5
										py-2.5

										rounded-full

										bg-[#1A1A1A]/95
										text-white

										border
										border-white/10

										shadow-[0_6px_20px_rgba(0,0,0,0.18)]

										hover:bg-black
										hover:scale-[1.02]

										transition-all
										duration-200
									"
								>
									<LayoutDashboard className="w-3.5 h-3.5 text-white/80" />
									<span className="text-sm font-semibold">
										Dashboard
									</span>
								</Link>

								{/* Profile */}
								<div className="relative">
									<div
										className="
											flex
											items-center
											gap-1

											pl-1.5
											pr-1.5
											py-1.5

											rounded-full

											bg-white/30
											backdrop-blur-xl

											border
											border-white/50

											shadow-[0_4px_18px_rgba(0,0,0,0.08)]
										"
									>
										<button
											onClick={() =>
												setProfileOpen(!profileOpen)
											}
											className="
												w-8
												h-8

												rounded-full

												bg-[#1A1A1A]
												text-white

												flex
												items-center
												justify-center

												shadow-md

												hover:scale-105
												transition
											"
										>
											<UserRound className="w-3.5 h-3.5" />
										</button>

										<button
											onClick={() =>
												setProfileOpen(!profileOpen)
											}
											className="
												w-6
												h-8

												flex
												items-center
												justify-center

												text-[#6B7280]

												hover:text-[#1A1A1A]
												transition
											"
										>
											<ChevronDown
												className={`w-3.5 h-3.5 transition-transform duration-200 ${
													profileOpen
														? "rotate-180"
														: ""
												}`}
											/>
										</button>
									</div>

									{/* PROFILE DROPDOWN */}
									{profileOpen && (
										<div
											className="
												absolute
												right-0
												top-[calc(100%+12px)]

												w-[290px]

												overflow-hidden

												rounded-3xl

												bg-gray-100
												backdrop-blur-3xl
												backdrop-saturate-200

												border
												border-white/80

												shadow-[0_20px_60px_rgba(0,0,0,0.16)]
											"
										>
											{/* SHOP INFO */}
											<div className="px-6 py-5">
												<div className="flex items-center gap-4">
													<div
														className="
															w-12
															h-12

															rounded-2xl

															bg-[#1A1A1A]
															text-white

															flex
															items-center
															justify-center

															shadow-lg
														"
													>
														<UserRound className="w-5 h-5" />
													</div>

													<div className="min-w-0">
														<p className="font-semibold text-[#1A1A1A] truncate">
															{shop?.name ??
																"Your Shop"}
														</p>
														<p className="text-sm text-gray-500 truncate">
															{user?.email ?? ""}
														</p>
													</div>
												</div>
											</div>

											<div className="h-px bg-white/40" />

											{/* MENU */}
											<div className="p-2">
												<Link
													to="/dashboard/shop"
													onClick={() =>
														setProfileOpen(false)
													}
													className="
														flex
														items-center
														gap-3

														px-4
														py-3.5

														rounded-2xl

														text-sm
														font-medium
														text-[#374151]
														bg-gray-200

														hover:bg-black/80 hover:text-white
														transition
													"
												>
													<QrCode className="w-[18px] h-[18px]" />
													My QR
												</Link>
											</div>

											<div className="h-px bg-white/40" />

											{/* LOGOUT */}
											<div className="p-2">
												<button
													onClick={handleLogout}
													className="
														w-full

														flex
														items-center
														gap-3

														px-4
														py-3.5

														rounded-2xl

														text-sm
														font-semibold
														text-red-900

														bg-red-100

														hover:bg-red-700
														hover:text-white
														hover:cursor-pointer

														transition
													"
												>
													<LogOut className="w-[18px] h-[18px]" />
													Log out
												</button>
											</div>
										</div>
									)}
								</div>
							</>
						) : (
							<Link
								to="/login"
								className="
									px-6
									py-2.5

									rounded-full

									bg-[#1A1A1A]/95
									text-white

									border
									border-white/10

									text-sm
									font-semibold

									shadow-[0_6px_20px_rgba(0,0,0,0.16)]

									hover:bg-black
									hover:scale-[1.02]

									transition-all
									duration-200
								"
							>
								Login
							</Link>
						)}
					</div>

					{/* Mobile menu button — always in this same right-hand grid slot */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="
							md:hidden
							w-9
							h-9

							rounded-full

							bg-white/30
							backdrop-blur-xl

							border
							border-white/50

							flex
							items-center
							justify-center

							text-[#1A1A1A]

							shadow-sm
							shrink-0
						"
					>
						{mobileMenuOpen ? (
							<X className="w-4 h-4" />
						) : (
							<Menu className="w-4 h-4" />
						)}
					</button>
				</div>
			</div>

			{/* MOBILE MENU */}
			{mobileMenuOpen && (
				<div
					className="
					md:hidden
					max-w-[1450px]
					mx-auto
					mt-3
					rounded-[24px]
					bg-white/50
					backdrop-blur-3xl
					backdrop-saturate-200
					border
					border-white/50
					shadow-[0_15px_50px_rgba(0,0,0,0.10)]
					p-3
				"
				>
					<div className="space-y-1">
						{navLinks.map((link) => (
							<Link
								key={link.label}
								to={link.to}
								onClick={() => setMobileMenuOpen(false)}
								className="
						block
						px-4
						py-3.5

						rounded-2xl

						font-medium
						text-sm
						text-[#374151]

						hover:bg-white/70
						active:bg-white/90
						transition
					"
							>
								{link.label}
							</Link>
						))}
					</div>

					<div className="h-px bg-[#1A1A1A]/10 my-3" />

					{token ? (
						<div className="space-y-2">
							<Link
								to="/dashboard"
								onClick={() => setMobileMenuOpen(false)}
								className="
						flex
						items-center
						justify-center
						gap-2

						w-full
						py-3.5

						rounded-2xl

						bg-[#1A1A1A]
						text-white

						text-sm
						font-semibold

						shadow-[0_6px_20px_rgba(0,0,0,0.18)]

						active:scale-[0.98]
						transition
					"
							>
								<LayoutDashboard className="w-4 h-4" />
								Dashboard
							</Link>

							<Link
								to="/dashboard/shop"
								onClick={() => setMobileMenuOpen(false)}
								className="
						flex
						items-center
						justify-center
						gap-2

						w-full
						py-3.5

						rounded-2xl

						bg-[#1A1A1A]
						border
						border-white/70

						text-sm
						font-semibold
						text-white

						hover:bg-white/80
						active:scale-[0.98]
						transition
					"
							>
								<QrCode className="w-4 h-4" />
								My QR
							</Link>

							<button
								onClick={handleLogout}
								className="
						w-full
						py-3.5

						rounded-2xl

						bg-red-200
						border
						border-red-100

						text-sm
						font-semibold
						text-red-900

						hover:bg-red-100
						active:scale-[0.98]
						transition
					"
							>
								Log out
							</button>
						</div>
					) : (
						<Link
							to="/login"
							onClick={() => setMobileMenuOpen(false)}
							className="
					block
					w-full
					text-center

					py-3.5

					rounded-2xl

					bg-[#1A1A1A]
					text-white

					text-sm
					font-semibold

					shadow-[0_6px_20px_rgba(0,0,0,0.18)]

					active:scale-[0.98]
					transition
				"
						>
							Login
						</Link>
					)}
				</div>
			)}
		</nav>
	);
}
