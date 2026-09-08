import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Upload, Loader2, X } from "lucide-react";
import { api } from "../lib/api";
import { getPdfPageCount } from "../lib/pdfUtils";

interface ShopInfo {
	id: string;
	name: string;
	slug: string;
}

interface FileEntry {
	file: File;
	copies: number;
	colorMode: "BW" | "COLOR";
	doubleSided: boolean;
	pageCount: number | null;
}

export default function UploadPage() {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();

	const [shop, setShop] = useState<ShopInfo | null>(null);
	const [notFound, setNotFound] = useState(false);
	const [entries, setEntries] = useState<FileEntry[]>([]);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!slug) return;
		api.get(`/shops/${slug}`)
			.then((res) => setShop(res.data))
			.catch(() => setNotFound(true));
	}, [slug]);

	function addFiles(fileList: FileList | null) {
		if (!fileList) return;
		const newEntries: FileEntry[] = Array.from(fileList).map((file) => ({
			file,
			copies: 1,
			colorMode: "BW",
			doubleSided: false,
			pageCount: null,
		}));
		setEntries((prev) => [...prev, ...newEntries]);

		// Kick off page-count extraction in the background for each newly
		// added file. Never blocks the UI - the file shows up immediately,
		// and each entry's pageCount fills in independently once ready.
		newEntries.forEach(async (entry) => {
			const count = await getPdfPageCount(entry.file);
			setEntries((prev) =>
				prev.map((e) =>
					e.file === entry.file ? { ...e, pageCount: count } : e,
				),
			);
		});
	}

	function updateEntry(index: number, patch: Partial<FileEntry>) {
		setEntries((prev) =>
			prev.map((e, i) => (i === index ? { ...e, ...patch } : e)),
		);
	}

	function removeEntry(index: number) {
		setEntries((prev) => prev.filter((_, i) => i !== index));
	}

	async function handleSubmit() {
		if (entries.length === 0 || !slug) return;
		setUploading(true);
		setError(null);

		try {
			const uploadedFiles = [];
			for (const entry of entries) {
				const presignRes = await api.post(`/shops/${slug}/upload-url`, {
					fileName: entry.file.name,
					mimeType: entry.file.type,
				});
				const { uploadUrl, fileKey } = presignRes.data;

				await fetch(uploadUrl, {
					method: "PUT",
					headers: { "Content-Type": entry.file.type },
					body: entry.file,
				});

				uploadedFiles.push({
					fileKey,
					originalName: entry.file.name,
					pageCount: entry.pageCount ?? 1,
					doubleSided: entry.doubleSided,
					copies: entry.copies,
					colorMode: entry.colorMode,
				});
			}

			const orderRes = await api.post(`/shops/${slug}/orders`, {
				files: uploadedFiles,
			});

			navigate(`/order/${orderRes.data.id}`);
		} catch (err) {
			console.error(err);
			setError(
				"Something went wrong submitting your order. Please try again.",
			);
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
					<p className="text-2xl font-bold font-serif-editorial text-[#1A1A1A] mb-2">
						Shop not found
					</p>
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
			<div className="max-w-md mx-auto">
				<div className="text-center mb-8">
					<div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E5E2D9] text-[#1A1A1A] text-xs font-mono-code font-bold uppercase tracking-wider mb-4">
						<span className="w-2 h-2 rounded-full bg-[#D97706]" />
						<span>Upload your documents</span>
					</div>
					<h1 className="text-3xl font-bold font-serif-editorial text-[#1A1A1A]">
						{shop.name}
					</h1>
					<p className="text-sm text-gray-500 font-mono-code mt-1">
						Add one or more files, adjust settings per file
					</p>
				</div>

				<div className="bg-[#F2EFE9] border border-[#E5E2D9] rounded-3xl p-6 space-y-5">
					<label className="block border-2 border-dashed border-[#D97706]/40 rounded-2xl p-6 text-center bg-white/50 hover:bg-white transition cursor-pointer relative">
						<input
							type="file"
							accept="application/pdf"
							multiple
							className="absolute inset-0 opacity-0 cursor-pointer"
							onChange={(e) => addFiles(e.target.files)}
						/>

						<Upload className="w-7 h-7 text-[#D97706] mx-auto mb-2" />
						<p className="text-sm font-medium text-[#1A1A1A]">
							Tap to add PDF(s)
						</p>
						<p className="text-xs text-gray-500 mt-1 font-mono-code">
							You can select multiple files
						</p>
					</label>

					{entries.map((entry, i) => (
						<div
							key={i}
							className="bg-white border border-[#E5E2D9] rounded-2xl p-4 space-y-3.5"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex items-center space-x-2.5 min-w-0">
									<div className="w-9 h-9 rounded-lg bg-[#F2EFE9] flex items-center justify-center shrink-0">
										<FileText className="w-4 h-4 text-[#D97706]" />
									</div>
									<div className="min-w-0">
										<p className="text-sm font-semibold text-[#1A1A1A] truncate">
											{entry.file.name}
										</p>
										<p className="text-xs text-gray-400 font-mono-code mt-0.5">
											{entry.pageCount === null
												? "Calculating pages…"
												: `${entry.pageCount} pages`}
										</p>
									</div>
								</div>
								<button
									onClick={() => removeEntry(i)}
									className="p-1 text-gray-300 hover:text-red-600 transition shrink-0"
								>
									<X className="w-4 h-4" />
								</button>
							</div>

							<div className="h-px bg-[#F2EFE9]" />

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-500 font-mono-code">
										Copies
									</span>
									<input
										type="number"
										min={1}
										value={entry.copies}
										onChange={(e) =>
											updateEntry(i, {
												copies: Number(e.target.value),
											})
										}
										className="w-16 p-1.5 bg-[#FAF9F5] border border-[#E5E2D9] rounded-lg text-xs text-center font-medium"
									/>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-500 font-mono-code">
										Color
									</span>
									<div className="flex gap-1.5">
										{(["BW", "COLOR"] as const).map(
											(mode) => (
												<button
													key={mode}
													onClick={() =>
														updateEntry(i, {
															colorMode: mode,
														})
													}
													className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition border ${
														entry.colorMode === mode
															? "bg-[#1A1A1A] text-white border-black"
															: "bg-[#FAF9F5] text-gray-600 border-[#E5E2D9]"
													}`}
												>
													{mode === "BW"
														? "B&W"
														: "Color"}
												</button>
											),
										)}
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-500 font-mono-code">
										Sides
									</span>
									<div className="flex gap-1.5">
										{[
											{ value: false, label: "Single" },
											{ value: true, label: "Double" },
										].map((opt) => (
											<button
												key={String(opt.value)}
												onClick={() =>
													updateEntry(i, {
														doubleSided: opt.value,
													})
												}
												className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition border ${
													entry.doubleSided ===
													opt.value
														? "bg-[#1A1A1A] text-white border-black"
														: "bg-[#FAF9F5] text-gray-600 border-[#E5E2D9]"
												}`}
											>
												{opt.label}
											</button>
										))}
									</div>
								</div>
							</div>
						</div>
					))}

					{error && (
						<p className="text-red-600 text-xs font-mono-code">
							{error}
						</p>
					)}

					<button
						onClick={handleSubmit}
						disabled={entries.length === 0 || uploading}
						className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl shadow-md transition text-sm disabled:opacity-50 flex items-center justify-center space-x-2"
					>
						{uploading && (
							<Loader2 className="w-4 h-4 animate-spin" />
						)}
						<span>
							{uploading
								? "Submitting..."
								: `Submit Order${entries.length > 1 ? ` (${entries.length} files)` : ""}`}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}
