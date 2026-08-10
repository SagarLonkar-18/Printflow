import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";

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
			const res = await api.post("/auth/login", { email, password });
			setAuth(res.data.token, res.data.user);
			navigate("/dashboard");
		} catch {
			setError("Invalid email or password");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] flex items-center justify-center px-6">
			<style
				dangerouslySetInnerHTML={{
					__html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-serif-editorial { font-family: 'Instrument Serif', serif; }
        .font-sans-clean { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono-code { font-family: 'JetBrains Mono', monospace; }
      `,
				}}
			/>

			<div className="w-full max-w-md bg-[#F2EFE9] border border-[#E5E2D9] rounded-3xl p-8 shadow-xl space-y-6">
				<div
					className="flex items-center space-x-3 cursor-pointer w-fit"
					onClick={() => navigate("/")}
				>
					<div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-md">
						<Printer className="w-5 h-5 text-[#D97706]" />
					</div>
					<span className="text-xl font-bold tracking-tight font-serif-editorial">
						Print<span className="text-[#D97706]">Flow</span>
					</span>
				</div>

				<div>
					<h1 className="text-2xl font-bold font-serif-editorial text-[#1A1A1A]">
						Welcome back
					</h1>
					<p className="text-xs text-gray-500 font-mono-code mt-1">
						Access your shop dashboard & live queue
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-mono-code text-gray-600 mb-1 uppercase">
							Email Address
						</label>
						<input
							type="email"
							placeholder="owner@printshop.com"
							className="w-full p-3 bg-white border border-[#E5E2D9] rounded-xl text-sm font-sans-clean"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="block text-xs font-mono-code text-gray-600 mb-1 uppercase">
							Password
						</label>
						<input
							type="password"
							placeholder="••••••••"
							className="w-full p-3 bg-white border border-[#E5E2D9] rounded-xl text-sm font-sans-clean"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					{error && (
						<p className="text-red-600 text-xs font-mono-code">
							{error}
						</p>
					)}

					<button
						type="submit"
						className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl shadow-md transition text-sm disabled:opacity-50"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Log In to Dashboard"}
					</button>
				</form>

				<div className="pt-4 border-t border-[#E5E2D9] text-center text-xs font-mono-code">
					<p className="text-gray-600">
						Don't have a shop account?{" "}
						<a
							href="/signup"
							className="text-[#D97706] font-bold hover:underline"
						>
							Sign up
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
