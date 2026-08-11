import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Upload, Loader2 } from "lucide-react";
import { api } from "../lib/api";

interface ShopInfo {
	id: string;
	name: string;
	slug: string;
}

export default function UploadPage() {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();

	const [shop, setShop] = useState<ShopInfo | null>(null);
	const [notFound, setNotFound] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [copies, setCopies] = useState(1);
	const [colorMode, setColorMode] = useState<"BW" | "COLOR">("BW");
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!slug) return;
		api
			.get(`/shops/${slug}`)
			.then((res) => setShop(res.data))
			.catch(() => setNotFound(true));
	}, [slug]);

	async function handleSubmit() {
		if (!file || !slug) return;
		setUploading(true);
		setError(null);

		try {
			const presignRes = await api.post(`/shops/${slug}/upload-url`, {
				fileName: file.name,
				mimeType: file.type,
			});
			const { uploadUrl, fileKey } = presignRes.data;

			await fetch(uploadUrl, {
				method: "PUT",
				headers: { "Content-Type": file.type },
				body: file,
			});

			const orderRes = await api.post(`/shops/${slug}/orders`, {
				fileKey,
				originalName: file.name,
				copies,
				colorMode,
			});

			navigate(`/order/${orderRes.data.id}`);
		} catch (err) {
			console.error(err);
			setError("Something went wrong submitting your order. Please try again.");
		} finally {
			setUploading(false);
		}
	}

	const fontStyle = (
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
	);

	if (notFound) {
		return (
			<div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center px-6">
				{fontStyle}
				<div className="text-center">
					<p className="text-2xl font-bold font-serif-editorial text-[#1A1A1A] mb-2">Shop not found</p>
					<p className="text-sm text-gray-500 font-mono-code">
						Check the QR code and try scanning again.
					</p>
				</div>
			</div>
		);
	}

	if (!shop) {
		return (
			<div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center">
				{fontStyle}
				<Loader2 className="w-6 h-6 animate-spin text-[#D97706]" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] px-6 py-10">
			{fontStyle}
			<div className="max-w-sm mx-auto">
				<div className="text-center mb-8">
					<div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E5E2D9] text-[#1A1A1A] text-xs font-mono-code font-bold uppercase tracking-wider mb-4">
						<span className="w-2 h-2 rounded-full bg-[#D97706]" />
						<span>Upload your document</span>
					</div>
					<h1 className="text-3xl font-bold font-serif-editorial text-[#1A1A1A]">{shop.name}</h1>
					<p className="text-sm text-gray-500 font-mono-code mt-1">Choose your file and print settings</p>
				</div>

				<div className="bg-[#F2EFE9] border border-[#E5E2D9] rounded-3xl p-6 space-y-5">
					<label className="block border-2 border-dashed border-[#D97706]/40 rounded-2xl p-8 text-center bg-white/50 hover:bg-white transition cursor-pointer relative">
						<input
							type="file"
							accept="application/pdf"
							className="absolute inset-0 opacity-0 cursor-pointer"
							onChange={(e) => setFile(e.target.files?.[0] ?? null)}
						/>
						{file ? (
							<div className="flex items-center justify-center space-x-2">
								<FileText className="w-5 h-5 text-[#D97706]" />
								<span className="text-sm font-medium text-[#1A1A1A] truncate max-w-[220px]">
									{file.name}
								</span>
							</div>
						) : (
							<>
								<Upload className="w-8 h-8 text-[#D97706] mx-auto mb-2" />
								<p className="text-sm font-medium text-[#1A1A1A]">Tap to upload PDF</p>
								<p className="text-xs text-gray-500 mt-1 font-mono-code">PDF files only</p>
							</>
						)}
					</label>

					<div>
						<label className="block text-xs font-mono-code text-gray-600 mb-1.5 uppercase">Copies</label>
						<input
							type="number"
							min={1}
							value={copies}
							onChange={(e) => setCopies(Number(e.target.value))}
							className="w-full p-3 bg-white border border-[#E5E2D9] rounded-xl text-sm font-sans-clean"
						/>
					</div>

					<div>
						<label className="block text-xs font-mono-code text-gray-600 mb-1.5 uppercase">Color</label>
						<div className="grid grid-cols-2 gap-3">
							{(["BW", "COLOR"] as const).map((mode) => (
								<button
									key={mode}
									onClick={() => setColorMode(mode)}
									className={`py-2.5 px-3 rounded-xl font-medium text-xs transition border text-center ${
										colorMode === mode
											? "bg-[#1A1A1A] text-white border-black"
											: "bg-white text-gray-700 border-[#E5E2D9] hover:bg-gray-50"
									}`}
								>
									{mode === "BW" ? "Black & White" : "Color"}
								</button>
							))}
						</div>
					</div>

					{error && <p className="text-red-600 text-xs font-mono-code">{error}</p>}

					<button
						onClick={handleSubmit}
						disabled={!file || uploading}
						className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl shadow-md transition text-sm disabled:opacity-50 flex items-center justify-center space-x-2"
					>
						{uploading && <Loader2 className="w-4 h-4 animate-spin" />}
						<span>{uploading ? "Submitting..." : "Submit Order"}</span>
					</button>
				</div>
			</div>
		</div>
	);
}