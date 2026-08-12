import { FileText } from "lucide-react";

interface OrderFile {
	id: string;
	originalName: string;
	copies: number;
	colorMode: string;
	status: string;
}

interface Order {
	id: string;
	createdAt: string;
	files: OrderFile[];
}

interface OrderCardProps {
	order: Order;
	onPrintFile: (fileId: string) => void;
	onCompleteFile: (fileId: string) => void;
}

function statusBadgeClass(status: string) {
	if (status === "PENDING") return "bg-[#D97706] text-white";
	if (status === "PRINTING") return "bg-blue-100 text-blue-800 border border-blue-300";
	return "bg-green-100 text-green-800 border border-green-300";
}

export default function OrderCard({ order, onPrintFile, onCompleteFile }: OrderCardProps) {
	const hasPending = order.files.some((f) => f.status === "PENDING");

	return (
		<div
			className={`bg-white p-5 rounded-2xl border transition shadow-sm ${
				hasPending ? "border-[#D97706] ring-1 ring-[#D97706]/20" : "border-[#E5E2D9]"
			}`}
		>
			<p className="text-xs text-gray-400 font-mono-code mb-3">
				Order &middot; {order.files.length} file{order.files.length !== 1 ? "s" : ""}
			</p>

			<div className="space-y-3">
				{order.files.map((file) => (
					<div
						key={file.id}
						className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2EFE9] last:border-0 last:pb-0"
					>
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 rounded-xl bg-[#F2EFE9] flex items-center justify-center shrink-0">
								<FileText className="w-4 h-4 text-[#D97706]" />
							</div>
							<div>
								<p className="font-bold text-[#1A1A1A] text-sm font-sans-clean">{file.originalName}</p>
								<p className="text-xs text-gray-500 font-mono-code mt-0.5">
									{file.copies}x &middot; {file.colorMode}
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-3">
							<span
								className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider ${statusBadgeClass(file.status)}`}
							>
								{file.status}
							</span>

							{file.status === "PENDING" && (
								<button
									onClick={() => onPrintFile(file.id)}
									className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-lg transition shadow text-xs"
								>
									Print
								</button>
							)}
							{file.status === "PRINTING" && (
								<button
									onClick={() => onCompleteFile(file.id)}
									className="px-3.5 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition shadow text-xs"
								>
									Mark Completed
								</button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}