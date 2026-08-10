import { Monitor } from "lucide-react";

interface MockOrder {
	id: string;
	customerName: string;
	phone: string;
	fileName: string;
	pages: number;
	copies: number;
	color: string;
	paperSize: string;
	binding: string;
	notes: string;
	status: string;
	timeAgo: string;
	total: number;
}

interface DashboardPreviewProps {
	orders: MockOrder[];
	activeTab: string;
	setActiveTab: (id: string) => void;
	onUpdateStatus: (orderId: string, newStatus: string) => void;
}

export default function DashboardPreview({ orders, activeTab, setActiveTab, onUpdateStatus }: DashboardPreviewProps) {
	const tabs = [
		{ id: "all", label: "All Orders", count: orders.length },
		{ id: "new", label: "New", count: orders.filter((o) => o.status === "new").length },
		{ id: "printing", label: "Printing", count: orders.filter((o) => o.status === "printing").length },
		{ id: "ready", label: "Ready", count: orders.filter((o) => o.status === "ready").length },
	];

	const filtered = orders.filter((o) => activeTab === "all" || o.status === activeTab);

	return (
		<div className="lg:col-span-7 bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] shadow-xl relative">
			<div className="absolute top-4 right-4 flex items-center space-x-2">
				<span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-ping" />
				<span className="text-xs font-mono-code text-[#D97706] font-bold uppercase tracking-wider">
					Shop Owner Dashboard (Live Sync)
				</span>
			</div>

			<div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E5E2D9]">
				<div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center shadow">
					<Monitor className="w-5 h-5 text-[#D97706]" />
				</div>
				<div>
					<h3 className="font-bold text-[#1A1A1A] text-base font-sans-clean">
						Gupta Xerox • Counter 1 Order Queue
					</h3>
					<p className="text-xs text-gray-500 font-mono-code">{orders.length} orders total</p>
				</div>
			</div>

			<div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 border whitespace-nowrap ${activeTab === tab.id ? "bg-[#1A1A1A] text-white border-black" : "bg-white text-gray-700 border-[#E5E2D9] hover:bg-gray-50"}`}
					>
						<span>{tab.label}</span>
						<span className="w-5 h-5 rounded-full bg-gray-200 text-black flex items-center justify-center text-[10px]">
							{tab.count}
						</span>
					</button>
				))}
			</div>

			<div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
				{filtered.map((order) => (
					<div
						key={order.id}
						className={`bg-white p-4 rounded-2xl border transition shadow-sm ${order.status === "new" ? "border-[#D97706] ring-1 ring-[#D97706]/30" : "border-[#E5E2D9]"}`}
					>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
							<div className="flex items-center space-x-3">
								<span className="font-mono-code font-bold text-[#D97706] text-xs bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
									{order.id}
								</span>
								<span className="font-bold text-[#1A1A1A] text-sm">{order.customerName}</span>
								<span className="text-xs text-gray-500 font-mono-code">({order.phone})</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-xs font-mono-code text-gray-500">{order.timeAgo}</span>
								<span
									className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider ${
										order.status === "new"
											? "bg-[#D97706] text-white animate-pulse"
											: order.status === "printing"
												? "bg-blue-100 text-blue-800 border border-blue-300"
												: order.status === "ready"
													? "bg-green-100 text-green-800 border border-green-300"
													: "bg-gray-100 text-gray-600"
									}`}
								>
									{order.status}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-code bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E2D9] mb-3">
							<div>
								<span className="text-gray-500">File:</span>{" "}
								<span className="text-[#1A1A1A] font-bold">{order.fileName}</span>
							</div>
							<div>
								<span className="text-gray-500">Specs:</span>{" "}
								<span className="text-[#1A1A1A] font-bold">
									{order.pages} pgs • {order.copies} copies • {order.color} • {order.paperSize}
								</span>
							</div>
							<div className="sm:col-span-2">
								<span className="text-gray-500">Binding & Notes:</span>{" "}
								<span className="text-[#D97706] font-medium">
									{order.binding} — "{order.notes}"
								</span>
							</div>
						</div>

						<div className="flex items-center justify-between pt-2 border-t border-[#E5E2D9] text-xs">
							<div className="font-mono-code font-bold text-[#1A1A1A] text-sm">Total: ₹{order.total}</div>
							<div className="flex items-center space-x-2">
								{order.status === "new" && (
									<button
										onClick={() => onUpdateStatus(order.id, "printing")}
										className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-lg transition shadow text-xs"
									>
										Start Printing
									</button>
								)}
								{order.status === "printing" && (
									<button
										onClick={() => onUpdateStatus(order.id, "ready")}
										className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition shadow text-xs"
									>
										Mark Ready
									</button>
								)}
								{order.status === "ready" && (
									<button
										onClick={() => onUpdateStatus(order.id, "completed")}
										className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition text-xs"
									>
										Archive
									</button>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}