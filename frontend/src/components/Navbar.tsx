import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import logo from "/printflow-logo.png";

export default function Navbar() {
	const navigate = useNavigate();
	const token = useAuthStore((s) => s.token);
	const user = useAuthStore((s) => s.user);
	const logout = useAuthStore((s) => s.logout);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	function handleLogout() {
		logout();
		navigate("/login");
	}

	const navLinks = [
		{ label: "Home", to: "/" },
		{ label: "Live Simulator", to: "/#simulator" },
		{ label: "How It Works", to: "/#how-it-works" },
		{ label: "FAQ", to: "/#faq" },
	];

	const initial = user?.email?.[0]?.toUpperCase() ?? "?";

	return (
		<nav className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E5E2D9]">
			<div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
				<Link to="/" className="flex items-center">
					<img src={logo} alt="PrintFlow" className="h-9 w-auto" />
				</Link>

				<div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-600 font-sans-clean">
					{navLinks.map((link) =>
						link.to.startsWith("/#") ? (
							<a key={link.label} href={link.to} className="hover:text-[#1A1A1A] transition-colors">
								{link.label}
							</a>
						) : (
							<Link key={link.label} to={link.to} className="hover:text-[#1A1A1A] transition-colors">
								{link.label}
							</Link>
						),
					)}
				</div>

				<div className="hidden md:flex items-center space-x-3">
					{token ? (
						<>
							<Link
								to="/dashboard"
								title={user?.email}
								className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-[#F2EFE9] transition"
							>
								<div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold font-mono-code">
									{initial}
								</div>
								<span className="text-sm font-medium text-gray-700 flex items-center space-x-1">
									<LayoutDashboard className="w-4 h-4" />
									<span>Dashboard</span>
								</span>
							</Link>
							<button
								onClick={handleLogout}
								title="Log out"
								className="p-2.5 rounded-full text-gray-500 hover:text-white hover:bg-[#1A1A1A] transition"
							>
								<LogOut className="w-4 h-4" />
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="text-sm font-medium text-gray-600 hover:text-black px-4 py-2 transition"
							>
								Log In
							</Link>
							<Link
								to="/signup"
								className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full font-medium text-sm shadow-md transition"
							>
								Get Started
							</Link>
						</>
					)}
				</div>

				<div className="lg:hidden">
					<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-800">
						{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
					</button>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className="lg:hidden bg-[#FAF9F5] border-b border-[#E5E2D9] px-6 py-6 space-y-4 font-sans-clean">
					{navLinks.map((link) =>
						link.to.startsWith("/#") ? (
							<a
								key={link.label}
								href={link.to}
								onClick={() => setMobileMenuOpen(false)}
								className="block text-base font-medium"
							>
								{link.label}
							</a>
						) : (
							<Link
								key={link.label}
								to={link.to}
								onClick={() => setMobileMenuOpen(false)}
								className="block text-base font-medium"
							>
								{link.label}
							</Link>
						),
					)}
					<div className="pt-4 border-t border-[#E5E2D9] flex flex-col space-y-3">
						{token ? (
							<>
								<Link
									to="/dashboard"
									onClick={() => setMobileMenuOpen(false)}
									className="w-full py-3 text-center font-medium bg-gray-200 rounded-full"
								>
									Dashboard
								</Link>
								<button
									onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
									className="w-full py-3 text-center font-medium bg-[#1A1A1A] text-white rounded-full"
								>
									Log out
								</button>
							</>
						) : (
							<>
								<Link
									to="/login"
									onClick={() => setMobileMenuOpen(false)}
									className="w-full py-3 text-center font-medium bg-gray-200 rounded-full block"
								>
									Log In
								</Link>
								<Link
									to="/signup"
									onClick={() => setMobileMenuOpen(false)}
									className="w-full py-3 text-center font-medium bg-[#1A1A1A] text-white rounded-full block"
								>
									Get Started
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}