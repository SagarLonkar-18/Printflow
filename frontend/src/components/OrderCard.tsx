import { FileText, Printer, CheckCircle2 } from "lucide-react";

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

const STATUS_CONFIG = {
	PENDING: { label: "Pending", dot: "bg-[#D97706]" },
	PRINTING: { label: "Printing", dot: "bg-blue-500" },
	COMPLETED: { label: "Completed", dot: "bg-green-500" },
} as const;

function formatOrderTime(iso: string) {
	return new Date(iso).toLocaleTimeString(undefined, {
		hour: "numeric",
		minute: "2-digit",
	});
}

export default function OrderCard({ order, onPrintFile, onCompleteFile }: OrderCardProps) {
	const hasPending = order.files.some((f) => f.status === "PENDING");

	return (
		<div
			className={`bg-white p-5 rounded-2xl border transition shadow-sm ${
				hasPending ? "border-[#D97706] ring-1 ring-[#D97706]/20" : "border-[#E5E2D9]"
			}`}
		>
			<div className="flex items-center justify-between mb-3">
				<p className="text-xs text-gray-500 font-mono-code">
					Order &middot; {order.files.length} file{order.files.length !== 1 ? "s" : ""}
				</p>
				<p className="text-xs text-gray-500 font-mono-code">{formatOrderTime(order.createdAt)}</p>
			</div>

			<div className="space-y-3">
				{order.files.map((file) => {
					const status = STATUS_CONFIG[file.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;

					return (
						<div
							key={file.id}
							className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pb-3 border-b border-[#F2EFE9] last:border-0 last:pb-0"
						>
							<div className="flex items-center space-x-3 min-w-0 w-full sm:w-auto sm:mr-auto">
								<div className="w-10 h-10 rounded-xl bg-[#F2EFE9] flex items-center justify-center shrink-0">
									<FileText className="w-4 h-4 text-[#D97706]" />
								</div>
								<div className="min-w-0">
									<p className="font-bold text-[#1A1A1A] text-sm font-sans-clean truncate">{file.originalName}</p>
									<p className="text-xs text-gray-500 font-mono-code mt-0.5">
										{file.copies}x &middot; {file.colorMode}
									</p>
								</div>
							</div>

							<div className="flex items-center space-x-3 shrink-0">
								<div className="flex items-center space-x-1.5 bg-[#FAF9F5] border border-[#E5E2D9] rounded-full px-3 py-1.5">
									<span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
									<span className="text-xs font-mono-code font-medium text-gray-600">{status.label}</span>
								</div>

								{file.status === "PENDING" && (
									<button
										onClick={() => onPrintFile(file.id)}
										className="w-28 flex items-center justify-center space-x-1.5 py-2 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-lg transition text-xs"
									>
										<Printer className="w-3.5 h-3.5" />
										<span>Print</span>
									</button>
								)}
								{file.status === "PRINTING" && (
									<button
										onClick={() => onCompleteFile(file.id)}
										className="w-28 flex items-center justify-center space-x-1.5 py-2 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-lg transition text-xs"
									>
										<CheckCircle2 className="w-3.5 h-3.5" />
										<span>Complete</span>
									</button>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}