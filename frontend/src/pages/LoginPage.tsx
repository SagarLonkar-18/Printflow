import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import Navbar from "../components/Navbar";

export default function LoginPage() {
	const navigate = useNavigate();
	const setAuth = useAuthStore((s) => s.setAuth);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await api.post("/auth/login", {
				email,
				password,
			});

			setAuth(res.data.token, res.data.user);
			navigate("/dashboard");
		} catch {
			setError("Invalid email or password");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="relative min-h-screen overflow-hidden bg-[#FAFAF8] text-[#1A1A1A]">
			{/* Background decoration */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute left-[15%] top-[20%] h-[400px] w-[400px] rounded-full bg-[#D97706]/[0.07] blur-[120px]" />
				<div className="absolute right-[10%] bottom-[5%] h-[350px] w-[350px] rounded-full bg-[#D97706]/[0.05] blur-[120px]" />

				<div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#D97706]/10 to-transparent" />
			</div>

			{/* Navbar */}
			<div className="relative z-30">
				<Navbar />
			</div>

			{/* Main */}
			<main className="relative z-10 flex min-h-[calc(100vh-110px)] items-center justify-center px-6 py-16 ">
				<div className="w-full max-w-[480px]">
					{/* Heading outside card */}
					<div className="mb-8 text-center">
						<div className="mb-4 flex items-center justify-center gap-2">
							<span className="h-px w-8 bg-[#D97706]/40" />
							<span className="font-mono-code text-[10px] uppercase tracking-[0.25em] text-[#D97706]">
								Shop Owner Portal
							</span>
							<span className="h-px w-8 bg-[#D97706]/40" />
						</div>

						<h1 className="font-serif-editorial text-5xl leading-none text-[#1A1A1A] sm:text-6xl">
							Welcome back.
						</h1>

						<p className="mt-3 font-sans-clean text-sm leading-relaxed text-gray-500 sm:text-base">
							Sign in to manage your print shop and live order
							queue.
						</p>
					</div>

					{/* Card */}
					<div className="rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-[0_25px_80px_rgba(40,35,25,0.10)] backdrop-blur-xl sm:p-8">
						<form onSubmit={handleSubmit} className="space-y-5">
							{/* Email */}
							<div>
								<label className="mb-2 block font-mono-code text-[11px] uppercase tracking-wider text-gray-500">
									Email Address
								</label>

								<input
									type="email"
									placeholder="owner@printshop.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-full rounded-2xl border border-[#E8E5DF] bg-[#FAFAF8] px-4 py-3.5 font-sans-clean text-sm text-[#1A1A1A] outline-none transition placeholder:text-gray-400 focus:border-[#D97706]/50 focus:bg-white focus:ring-4 focus:ring-[#D97706]/[0.06]"
								/>
							</div>

							{/* Password */}
							<div>
								<label className="mb-2 block font-mono-code text-[11px] uppercase tracking-wider text-gray-500">
									Password
								</label>

								<input
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
									className="w-full rounded-2xl border border-[#E8E5DF] bg-[#FAFAF8] px-4 py-3.5 font-sans-clean text-sm text-[#1A1A1A] outline-none transition placeholder:text-gray-400 focus:border-[#D97706]/50 focus:bg-white focus:ring-4 focus:ring-[#D97706]/[0.06]"
								/>
							</div>

							{/* Error */}
							{error && (
								<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
									<p className="font-mono-code text-xs text-red-600">
										{error}
									</p>
								</div>
							)}

							{/* Submit */}
							<button
								type="submit"
								disabled={loading}
								className="group relative w-full overflow-hidden rounded-2xl bg-[#1A1A1A] py-4 font-sans-clean text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
							>
								<span className="relative z-10">
									{loading
										? "Logging in..."
										: "Log In to Dashboard"}
								</span>

								<span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

								<span className="pointer-events-none absolute -left-1/2 top-[-100%] h-[300%] w-[25%] rotate-[25deg] bg-white/20 opacity-0 blur-md transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100" />
							</button>
						</form>

						{/* Divider */}
						<div className="my-7 flex items-center gap-4">
							<div className="h-px flex-1 bg-[#E8E5DF]" />
							<span className="font-mono-code text-[10px] uppercase tracking-widest text-gray-400">
								New here?
							</span>
							<div className="h-px flex-1 bg-[#E8E5DF]" />
						</div>

						<button
							onClick={() => navigate("/signup")}
							className="w-full rounded-2xl border border-[#E5E2D9] bg-white py-3.5 font-sans-clean text-sm font-semibold text-[#1A1A1A] transition hover:border-[#D97706]/40 hover:bg-[#FFFDF9]"
						>
							Create your PrintFlow shop
						</button>
					</div>

					<p className="mt-6 text-center font-mono-code text-[10px] tracking-wide text-gray-400">
						Manage orders. Print faster. Skip WhatsApp.
					</p>
				</div>
			</main>
		</div>
	);
}
