import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShopQRCodeProps {
	shopName: string;
	shopSlug: string;
}

export default function ShopQRCode({ shopName, shopSlug }: ShopQRCodeProps) {
	const [copied, setCopied] = useState(false);

	const shopUrl = `${window.location.origin}/shop/${shopSlug}`;

	function handleCopy() {
		navigator.clipboard.writeText(shopUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="bg-[#F2EFE9] border border-[#E5E2D9] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
			<div className="bg-white p-3 rounded-xl border border-[#E5E2D9] shrink-0">
				<QRCodeSVG value={shopUrl} size={140} />
			</div>

			<div className="flex-1 text-center sm:text-left">
				<h3 className="font-bold text-[#1A1A1A] font-serif-editorial text-lg">Your shop's QR code</h3>
				<p className="text-sm text-gray-600 font-sans-clean mt-1">
					Print this and place it at your counter. Customers scan it to reach {shopName}'s upload page.
				</p>
				<div className="flex items-center gap-2 mt-3">
					<code className="text-xs font-mono-code bg-white px-3 py-1.5 rounded-lg border border-[#E5E2D9] text-gray-700 truncate max-w-[240px]">
						{shopUrl}
					</code>
					<button
						onClick={handleCopy}
						className="p-2 rounded-lg bg-white border border-[#E5E2D9] hover:bg-gray-50 transition shrink-0"
						title="Copy link"
					>
						{copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
					</button>
				</div>
			</div>
		</div>
	);
}