import { useState } from "react";
import { QrCode, FileText, Upload, X, Send, CheckCircle2 } from "lucide-react";

interface SimFile {
	name: string;
	copies: number;
	colorMode: "BW" | "COLOR";
}

interface CustomerSimulatorProps {
	onOrderSubmitted: (files: SimFile[]) => void;
}

export default function CustomerSimulator({
	onOrderSubmitted,
}: CustomerSimulatorProps) {
	const [scanned, setScanned] = useState(false);
	const [files, setFiles] = useState<SimFile[]>([]);
	const [submitted, setSubmitted] = useState(false);

	function addFiles(fileList: FileList | null) {
		if (!fileList) return;
		const newEntries = Array.from(fileList).map((f) => ({
			name: f.name,
			copies: 1,
			colorMode: "BW" as const,
		}));
		setFiles((prev) => [...prev, ...newEntries]);
	}

	function updateFile(index: number, patch: Partial<SimFile>) {
		setFiles((prev) =>
			prev.map((f, i) => (i === index ? { ...f, ...patch } : f)),
		);
	}

	function removeFile(index: number) {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	}

	function handleSubmit() {
		if (files.length === 0) return;
		onOrderSubmitted(files);
		setSubmitted(true);
		setTimeout(() => {
			setSubmitted(false);
			setFiles([]);
			setScanned(false);
		}, 2000);
	}

	return (
		<div className="lg:col-span-5 bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] shadow-xl h-[600px] flex flex-col">
			<div className="text-center mb-6 shrink-0">
				<p className="text-[11px] font-mono-code font-bold uppercase tracking-[0.15em] text-[#D97706] mb-2">
					Customer View
				</p>
				<h3 className="text-2xl font-bold font-serif-editorial text-[#1A1A1A]">
					Print My Shop
				</h3>
				<p className="text-xs text-gray-500 font-mono-code mt-1">
					Try the exact flow your customers see
				</p>
			</div>

			{submitted ? (
				<div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
					<div className="w-14 h-14 rounded-full bg-green-100 border border-green-300 text-green-700 flex items-center justify-center mx-auto">
						<CheckCircle2 className="w-7 h-7" />
					</div>
					<p className="font-bold text-[#1A1A1A]">Order sent!</p>
					<p className="text-xs text-gray-500 font-mono-code">
						Check the dashboard on the right →
					</p>
				</div>
			) : !scanned ? (
				<div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
					<div className="w-56 h-56 bg-white p-3 rounded-2xl shadow-md border border-[#E5E2D9] flex items-center justify-center">
						<img
							src="/demo-qr.png"
							alt="Demo shop QR code"
							className="w-full h-full object-contain"
						/>
					</div>
					<div className="space-y-1.5">
						<h4 className="font-bold text-[#1A1A1A] text-base">
							Scan Counter QR Code
						</h4>
						<p className="text-xs text-gray-500 max-w-[260px] mx-auto">
							Customers scan the acrylic stand at your counter
							with their phone camera. No app needed.
						</p>
					</div>
					<button
						onClick={() => setScanned(true)}
						className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
					>
						<QrCode className="w-4 h-4 text-[#D97706]" />
						<span>Simulate QR Scan</span>
					</button>
				</div>
			) : (
				<div className="flex-1 flex flex-col min-h-0 space-y-4">
					<label className="shrink-0 block border-2 border-dashed border-[#D97706]/40 rounded-2xl p-6 text-center bg-white/50 hover:bg-white transition cursor-pointer relative">
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

					{files.length > 0 && (
						<div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
							{files.map((file, i) => (
								<div
									key={i}
									className="bg-white border border-[#E5E2D9] rounded-xl p-3 space-y-2"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2 min-w-0">
											<FileText className="w-4 h-4 text-[#D97706] shrink-0" />
											<span className="text-sm font-medium text-[#1A1A1A] truncate">
												{file.name}
											</span>
										</div>
										<button
											onClick={() => removeFile(i)}
											className="p-1 text-gray-400 hover:text-red-600 shrink-0"
										>
											<X className="w-4 h-4" />
										</button>
									</div>

									<div className="flex items-center gap-2">
										<input
											type="number"
											min={1}
											value={file.copies}
											onChange={(e) =>
												updateFile(i, {
													copies: Number(
														e.target.value,
													),
												})
											}
											className="w-16 p-1.5 bg-[#FAF9F5] border border-[#E5E2D9] rounded-lg text-xs text-center"
										/>
										<span className="text-xs text-gray-400 font-mono-code">
											copies
										</span>
										<div className="flex-1" />
										{(["BW", "COLOR"] as const).map(
											(mode) => (
												<button
													key={mode}
													onClick={() =>
														updateFile(i, {
															colorMode: mode,
														})
													}
													className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition border ${
														file.colorMode === mode
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
							))}
						</div>
					)}

					<div className="shrink-0 space-y-2">
						<button
							onClick={handleSubmit}
							disabled={files.length === 0}
							className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl shadow-md transition text-sm disabled:opacity-50 flex items-center justify-center space-x-2"
						>
							<Send className="w-4 h-4" />
							<span>
								Submit Order
								{files.length > 1
									? ` (${files.length} files)`
									: ""}
							</span>
						</button>

						<button
							onClick={() => setScanned(false)}
							className="w-full text-xs text-gray-500 hover:text-black underline font-mono-code"
						>
							← Back to QR Scan
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
