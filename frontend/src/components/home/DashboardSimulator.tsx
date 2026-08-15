import OrderCard from "../OrderCard";
import StatusTabs from "../StatusTabs";

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

interface DashboardSimulatorProps {
	orders: Order[];
	activeTab: string;
	setActiveTab: (id: string) => void;
	onPrintFile: (fileId: string) => void;
	onCompleteFile: (fileId: string) => void;
}

export default function DashboardSimulator({
	orders,
	activeTab,
	setActiveTab,
	onPrintFile,
	onCompleteFile,
}: DashboardSimulatorProps) {
	const allFiles = orders.flatMap((o) => o.files);
	const tabs = [
		{ id: "all", label: "All Files", count: allFiles.length },
		{
			id: "PENDING",
			label: "New",
			count: allFiles.filter((f) => f.status === "PENDING").length,
		},
		{
			id: "PRINTING",
			label: "Printing",
			count: allFiles.filter((f) => f.status === "PRINTING").length,
		},
		{
			id: "COMPLETED",
			label: "Completed",
			count: allFiles.filter((f) => f.status === "COMPLETED").length,
		},
	];

	const filteredOrders = orders.filter(
		(order) =>
			activeTab === "all" ||
			order.files.some((f) => f.status === activeTab),
	);

	return (
		<div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] shadow-xl h-[600px] flex flex-col">
			<div className="mb-6 shrink-0">
				<p className="text-center text-[11px] font-mono-code font-bold uppercase tracking-[0.15em] text-[#D97706] mb-2">
					Print Shop Owner View
				</p>
				<h3 className="text-2xl font-bold font-serif-editorial text-[#1A1A1A]">
					Order queue
				</h3>
				<p className="text-xs text-gray-500 font-mono-code mt-1">
					{orders.length} orders &middot; {allFiles.length} files
					total
				</p>
			</div>

			<div className="shrink-0">
				<StatusTabs
					tabs={tabs}
					activeTab={activeTab}
					onChange={setActiveTab}
				/>
			</div>

			<div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 mt-6">
				{filteredOrders.length === 0 ? (
					<div className="text-center py-16 bg-[#F2EFE9] border border-[#E5E2D9] rounded-2xl">
						<p className="text-gray-500 font-mono-code text-sm">
							No orders here yet.
						</p>
					</div>
				) : (
					filteredOrders.map((order) => (
						<OrderCard
							key={order.id}
							order={order}
							onPrintFile={onPrintFile}
							onCompleteFile={onCompleteFile}
						/>
					))
				)}
			</div>
		</div>
	);
}
