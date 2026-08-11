import { FileText } from "lucide-react";

interface Order {
	id: string;
	originalName: string;
	copies: number;
	colorMode: string;
	status: string;
}

interface OrderCardProps {
	order: Order;
	onPrint: (id: string) => void;
	onMarkCompleted: (id: string) => void;
}

export default function OrderCard({ order, onPrint, onMarkCompleted }: OrderCardProps) {
	return (
		<div
			className={`bg-white p-5 rounded-2xl border transition shadow-sm ${
				order.status === "PENDING" ? "border-[#D97706] ring-1 ring-[#D97706]/20" : "border-[#E5E2D9]"
			}`}
		>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 rounded-xl bg-[#F2EFE9] flex items-center justify-center">
						<FileText className="w-4 h-4 text-[#D97706]" />
					</div>
					<div>
						<p className="font-bold text-[#1A1A1A] text-sm font-sans-clean">{order.originalName}</p>
						<p className="text-xs text-gray-500 font-mono-code mt-0.5">
							{order.copies}x &middot; {order.colorMode}
						</p>
					</div>
				</div>

				<div className="flex items-center space-x-3">
					<span
						className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider ${
							order.status === "PENDING"
								? "bg-[#D97706] text-white"
								: order.status === "PRINTING"
									? "bg-blue-100 text-blue-800 border border-blue-300"
									: "bg-green-100 text-green-800 border border-green-300"
						}`}
					>
						{order.status}
					</span>

					{order.status === "PENDING" && (
						<button
							onClick={() => onPrint(order.id)}
							className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-lg transition shadow text-xs"
						>
							Start Printing
						</button>
					)}
					{order.status === "PRINTING" && (
						<button
							onClick={() => onMarkCompleted(order.id)}
							className="px-3.5 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition shadow text-xs"
						>
							Mark Completed
						</button>
					)}
				</div>
			</div>
		</div>
	);
}