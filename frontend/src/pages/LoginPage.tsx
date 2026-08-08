import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
		<div className="min-h-screen flex items-center justify-center bg-base-200">
			<div className="card w-full max-w-sm bg-base-100 shadow-md p-6">
				<h1 className="text-2xl font-bold mb-4">Shop Owner Login</h1>
				<form onSubmit={handleSubmit} className="space-y-3">
					<input
						type="email"
						placeholder="Email"
						className="input input-bordered w-full"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						className="input input-bordered w-full"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					{error && <p className="text-error text-sm">{error}</p>}
					<button
						type="submit"
						className="btn btn-primary w-full"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Log In"}
					</button>
				</form>
			</div>
		</div>
	);
}
