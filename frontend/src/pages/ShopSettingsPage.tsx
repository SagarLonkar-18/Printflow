import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";

export default function ShopSettingsPage() {
	const [loaded, setLoaded] = useState(false);
	const [bwPrice, setBwPrice] = useState(0);
	const [colorPrice, setColorPrice] = useState(0);
	const [savingPricing, setSavingPricing] = useState(false);
	const [pricingSaved, setPricingSaved] = useState(false);

	useEffect(() => {
		api.get("/me/shop").then((res) => {
			setBwPrice(res.data.bwPrice);
			setColorPrice(res.data.colorPrice);
			setLoaded(true);
		});
	}, []);

	async function savePricing() {
		setSavingPricing(true);
		try {
			await api.patch("/me/shop/pricing", { bwPrice, colorPrice });
			setPricingSaved(true);
			setTimeout(() => setPricingSaved(false), 2000);
		} finally {
			setSavingPricing(false);
		}
	}

	if (!loaded) return null;

	return (
		<div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A]">
			<Navbar />

			<div className="max-w-2xl mx-auto px-6 py-12">
				<Link
					to="/dashboard"
					className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-black font-mono-code mb-8"
				>
					<ArrowLeft className="w-3.5 h-3.5" />
					<span>Back to dashboard</span>
				</Link>

				<div className="text-center mb-10">
					<h1 className="text-3xl font-bold font-serif-editorial text-[#1A1A1A]">Shop settings</h1>
					<p className="text-sm text-gray-500 font-sans-clean mt-2">
						Manage how your shop calculates order pricing.
					</p>
				</div>

				<div className="bg-white border border-[#E5E2D9] rounded-3xl p-8 space-y-5">
					<div>
						<h3 className="font-bold text-[#1A1A1A] text-lg font-serif-editorial">Pricing</h3>
						<p className="text-xs text-gray-500 font-mono-code mt-1">
							Price per physical sheet - used to calculate order totals
						</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-mono-code text-gray-500 mb-1.5 uppercase">
								Black &amp; White
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
								<input
									type="number"
									min={0}
									step="0.5"
									value={bwPrice}
									onChange={(e) => setBwPrice(Number(e.target.value))}
									className="w-full pl-7 pr-3 py-2.5 bg-[#FAF9F5] border border-[#E5E2D9] rounded-xl text-sm"
								/>
							</div>
						</div>
						<div>
							<label className="block text-xs font-mono-code text-gray-500 mb-1.5 uppercase">Color</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
								<input
									type="number"
									min={0}
									step="0.5"
									value={colorPrice}
									onChange={(e) => setColorPrice(Number(e.target.value))}
									className="w-full pl-7 pr-3 py-2.5 bg-[#FAF9F5] border border-[#E5E2D9] rounded-xl text-sm"
								/>
							</div>
						</div>
					</div>

					<button
						onClick={savePricing}
						disabled={savingPricing}
						className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-xl transition text-sm disabled:opacity-50"
					>
						{savingPricing ? "Saving..." : pricingSaved ? "Saved ✓" : "Save Pricing"}
					</button>
				</div>
			</div>
		</div>
	);
}