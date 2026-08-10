import { QrCode, Upload, FileText, CheckCircle2, Send } from "lucide-react";

interface CustomerSimulatorProps {
	step: number;
	setStep: (n: number) => void;
	simFile: any;
	setSimFile: (f: any) => void;
	copies: number;
	setCopies: (n: number) => void;
	color: string;
	setColor: (s: string) => void;
	paper: string;
	setPaper: (s: string) => void;
	binding: string;
	setBinding: (s: string) => void;
	notes: string;
	setNotes: (s: string) => void;
	onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onCompleteOrder: () => void;
}

export default function CustomerSimulator({
	step,
	setStep,
	simFile,
	setSimFile,
	copies,
	setCopies,
	color,
	setColor,
	paper,
	setPaper,
	binding,
	setBinding,
	notes,
	setNotes,
	onFileUpload,
	onCompleteOrder,
}: CustomerSimulatorProps) {
	return (
		<div className="lg:col-span-5 bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] shadow-xl relative">
			<div className="absolute top-4 right-4 flex items-center space-x-1.5">
				<span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
				<span className="text-xs font-mono-code text-gray-500">Customer Phone View</span>
			</div>

			<div className="flex items-center space-x-3 mb-6">
				<div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center border border-orange-200">
					<QrCode className="w-5 h-5 text-[#D97706]" />
				</div>
				<div>
					<h3 className="font-bold text-[#1A1A1A] text-base font-sans-clean">Step {step}: Mobile Ordering</h3>
					<p className="text-xs text-gray-500 font-mono-code">Gupta Print Hub Stand</p>
				</div>
			</div>

			<div className="w-full bg-gray-200 h-1.5 rounded-full mb-6 overflow-hidden">
				<div className="bg-[#D97706] h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
			</div>

			{step === 1 && (
				<div className="space-y-6 text-center py-6">
					<div className="w-44 h-44 mx-auto bg-white p-4 rounded-2xl shadow-md border border-[#E5E2D9] flex items-center justify-center">
						<img
							src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://printflow.shop/gupta"
							alt="QR"
							className="w-full h-full"
						/>
					</div>
					<div className="space-y-2">
						<h4 className="text-lg font-bold font-serif-editorial text-[#1A1A1A]">Scan Counter QR Code</h4>
						<p className="text-sm text-gray-600">
							Customers scan your acrylic counter stand with phone camera. No app download needed.
						</p>
					</div>
					<button
						onClick={() => setStep(2)}
						className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
					>
						<QrCode className="w-4 h-4 text-[#D97706]" />
						<span>Simulate QR Scan</span>
					</button>
				</div>
			)}

			{step === 2 && (
				<div className="space-y-6 py-4">
					<div className="border-2 border-dashed border-[#D97706]/40 rounded-2xl p-8 text-center bg-orange-50/50 hover:bg-orange-50 transition cursor-pointer relative">
						<input
							type="file"
							accept=".pdf"
							onChange={onFileUpload}
							className="absolute inset-0 opacity-0 cursor-pointer"
						/>
						<Upload className="w-12 h-12 text-[#D97706] mx-auto mb-3 animate-bounce" />
						<h4 className="font-bold text-[#1A1A1A] text-base">Upload Document (PDF)</h4>
						<p className="text-xs text-gray-500 mt-1">Tax_Audit_Report_2025.pdf (Preflight verified)</p>
					</div>

					<div className="space-y-3">
						<div className="text-xs font-mono-code text-gray-500 uppercase">Or select sample document:</div>
						<button
							onClick={() => {
								setSimFile({ name: "Assignment_Physics.pdf", pages: 12, size: "1.8 MB" });
								setStep(3);
							}}
							className="w-full p-3 rounded-xl bg-white hover:bg-gray-50 text-left text-sm flex items-center justify-between border border-[#E5E2D9]"
						>
							<div className="flex items-center space-x-3">
								<FileText className="w-4 h-4 text-[#D97706]" />
								<span className="font-medium text-[#1A1A1A]">Assignment_Physics.pdf (12 pgs)</span>
							</div>
							<span className="text-xs text-[#D97706] font-mono-code">Select</span>
						</button>
					</div>

					<button
						onClick={() => setStep(1)}
						className="text-xs text-gray-500 hover:text-black underline font-mono-code"
					>
						← Back to QR Scan
					</button>
				</div>
			)}

			{step === 3 && (
				<div className="space-y-5">
					<div className="p-3 rounded-xl bg-white border border-[#E5E2D9] flex items-center justify-between text-xs font-mono-code">
						<div className="flex items-center space-x-2">
							<FileText className="w-4 h-4 text-[#D97706]" />
							<span className="text-[#1A1A1A] font-bold truncate max-w-[180px]">
								{simFile?.name || "Document.pdf"}
							</span>
						</div>
						<span className="text-green-700 font-bold">
							₹{(simFile?.pages || 24) * copies * (color.includes("Color") ? 15 : 5)}
						</span>
					</div>

					<div className="space-y-4 text-sm font-sans-clean">
						<div>
							<label className="block text-xs font-mono-code text-gray-500 mb-1.5 uppercase">Copies</label>
							<div className="flex items-center space-x-3">
								{[1, 2, 5, 10].map((num) => (
									<button
										key={num}
										onClick={() => setCopies(num)}
										className={`flex-1 py-2 rounded-xl font-mono-code text-xs font-bold transition border ${copies === num ? "bg-[#1A1A1A] text-white border-black" : "bg-white text-gray-700 border-[#E5E2D9] hover:bg-gray-50"}`}
									>
										{num}x
									</button>
								))}
							</div>
						</div>

						<div>
							<label className="block text-xs font-mono-code text-gray-500 mb-1.5 uppercase">Color Mode</label>
							<div className="grid grid-cols-2 gap-3">
								{["B&W (Economy)", "Color (CMYK)"].map((mode) => (
									<button
										key={mode}
										onClick={() => setColor(mode)}
										className={`py-2 px-3 rounded-xl font-medium text-xs transition border text-center ${color === mode ? "bg-[#1A1A1A] text-white border-black" : "bg-white text-gray-700 border-[#E5E2D9] hover:bg-gray-50"}`}
									>
										{mode}
									</button>
								))}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-mono-code text-gray-500 mb-1 uppercase">Paper Size</label>
								<select
									value={paper}
									onChange={(e) => setPaper(e.target.value)}
									className="w-full p-2.5 bg-white border border-[#E5E2D9] rounded-xl text-xs font-medium"
								>
									<option value="A4">A4 (Standard)</option>
									<option value="A3">A3 (Large)</option>
									<option value="Legal">Legal</option>
								</select>
							</div>
							<div>
								<label className="block text-xs font-mono-code text-gray-500 mb-1 uppercase">Binding</label>
								<select
									value={binding}
									onChange={(e) => setBinding(e.target.value)}
									className="w-full p-2.5 bg-white border border-[#E5E2D9] rounded-xl text-xs font-medium"
								>
									<option value="None">Loose Sheets</option>
									<option value="Spiral Binding">Spiral Binding</option>
									<option value="Hardbound">Hardbound</option>
									<option value="Stapled">Stapled</option>
								</select>
							</div>
						</div>

						<div>
							<label className="block text-xs font-mono-code text-gray-500 mb-1 uppercase">Instructions</label>
							<input
								type="text"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="e.g. Print double-sided"
								className="w-full p-2.5 bg-white border border-[#E5E2D9] rounded-xl text-xs"
							/>
						</div>
					</div>

					<button
						onClick={onCompleteOrder}
						className="w-full py-3.5 bg-[#D97706] hover:bg-[#b45309] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 mt-4 text-sm"
					>
						<Send className="w-4 h-4" />
						<span>Send Order to Shop Dashboard</span>
					</button>
				</div>
			)}

			{step === 4 && (
				<div className="space-y-6 text-center py-8">
					<div className="w-16 h-16 rounded-full bg-green-100 border border-green-300 text-green-700 flex items-center justify-center mx-auto">
						<CheckCircle2 className="w-8 h-8" />
					</div>
					<div className="space-y-2">
						<h4 className="text-xl font-bold font-serif-editorial text-[#1A1A1A]">Order Sent Instantly!</h4>
						<p className="text-xs text-gray-600">
							Check the Shop Owner Dashboard on the right → Your order appeared immediately without
							WhatsApp ping-pong!
						</p>
					</div>
					<button
						onClick={() => { setStep(1); setSimFile(null); }}
						className="py-2.5 px-6 bg-[#1A1A1A] text-white font-semibold rounded-xl text-xs transition"
					>
						Simulate Another Order
					</button>
				</div>
			)}
		</div>
	);
}