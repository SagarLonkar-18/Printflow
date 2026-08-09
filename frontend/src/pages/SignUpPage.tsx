import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";

export default function SignupPage() {
	const navigate = useNavigate();
	const setAuth = useAuthStore((s) => s.setAuth);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [shopName, setShopName] = useState("");
	const [shopSlug, setShopSlug] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await api.post("/auth/signup", {
				email,
				password,
				shopName,
				shopSlug,
			});
			setAuth(res.data.token, res.data.user);
			navigate("/dashboard");
		} catch (err: any) {
			setError(
				err.response?.data?.error ?? "Signup failed. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200">
			<div className="card w-full max-w-sm bg-base-100 shadow-md p-6">
				<h1 className="text-2xl font-bold mb-4">Create Your Shop</h1>
				<form onSubmit={handleSubmit} className="space-y-3">
					<input
						type="text"
						placeholder="Shop Name"
						className="input input-bordered w-full"
						value={shopName}
						onChange={(e) => setShopName(e.target.value)}
						required
					/>
					<input
						type="text"
						placeholder="Shop URL slug (e.g. sagar-xerox)"
						className="input input-bordered w-full"
						value={shopSlug}
						onChange={(e) =>
							setShopSlug(e.target.value.toLowerCase())
						}
						pattern="[a-z0-9-]+"
						required
					/>
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
						placeholder="Password (min 8 characters)"
						className="input input-bordered w-full"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						minLength={8}
						required
					/>
					{error && <p className="text-error text-sm">{error}</p>}
					<button
						type="submit"
						className="btn btn-primary w-full"
						disabled={loading}
					>
						{loading ? "Creating account..." : "Sign Up"}
					</button>
				</form>
				<p className="text-sm text-center mt-3">
					Already have an account?{" "}
					<a href="/login" className="link link-primary">
						Log in
					</a>
				</p>
			</div>
		</div>
	);
}
