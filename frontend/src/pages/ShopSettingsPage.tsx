import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Copy, Check, ArrowLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";

export default function ShopSettingsPage() {
	const [shop, setShop] = useState<{ name: string; slug: string } | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		api.get("/me/shop").then((res) => setShop(res.data));
	}, []);

	if (!shop) return null;

	const shopUrl = `${window.location.origin}/shop/${shop.slug}`;

	function handleCopy() {
		navigator.clipboard.writeText(shopUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	function handleDownload() {
		const svg = document.getElementById("shop-qr-svg");
		if (!svg) return;
		const serializer = new XMLSerializer();
		const svgStr = serializer.serializeToString(svg);
		const canvas = document.createElement("canvas");
		canvas.width = 800;
		canvas.height = 800;
		const ctx = canvas.getContext("2d")!;
		const img = new Image();
		img.onload = () => {
			ctx.fillStyle = "#fff";
			ctx.fillRect(0, 0, 800, 800);
			ctx.drawImage(img, 40, 40, 720, 720);
			const link = document.createElement("a");
			link.download = `${shop.slug}-qr-code.png`;
			link.href = canvas.toDataURL("image/png");
			link.click();
		};
		img.src = "data:image/svg+xml;base64," + btoa(svgStr);
	}

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
					<h1 className="text-3xl font-bold font-serif-editorial text-[#1A1A1A]">Your shop's QR code</h1>
					<p className="text-sm text-gray-500 font-sans-clean mt-2">
						Print this and place it at your counter. Customers scan it to reach {shop.name}'s upload page.
					</p>
				</div>

				<div className="bg-[#F2EFE9] border border-[#E5E2D9] rounded-3xl p-10 flex flex-col items-center space-y-6">
					<div className="bg-white p-6 rounded-2xl border border-[#E5E2D9] shadow-sm">
						<QRCodeSVG id="shop-qr-svg" value={shopUrl} size={220} />
					</div>

					<div className="w-full space-y-3">
						<div className="flex items-center gap-2">
							<code className="flex-1 text-xs font-mono-code bg-white px-3 py-2.5 rounded-lg border border-[#E5E2D9] text-gray-700 truncate">
								{shopUrl}
							</code>
							<button
								onClick={handleCopy}
								className="p-2.5 rounded-lg bg-white border border-[#E5E2D9] hover:bg-gray-50 transition shrink-0"
								title="Copy link"
							>
								{copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
							</button>
						</div>

						<button
							onClick={handleDownload}
							className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-xl transition text-sm flex items-center justify-center space-x-2"
						>
							<Download className="w-4 h-4" />
							<span>Download QR code (PNG)</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}