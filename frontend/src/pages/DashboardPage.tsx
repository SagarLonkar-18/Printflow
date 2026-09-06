import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import Navbar from "../components/Navbar";
import OrderCard from "../components/OrderCard";
import StatusTabs from "../components/StatusTabs";
import DateTabs from "../components/DateTabs";
import { Link } from "react-router-dom";

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

export default function DashboardPage() {
	const token = useAuthStore((s) => s.token);

	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all");
	const [dateRange, setDateRange] = useState("today");

	const dateRangeRef = useRef(dateRange);
	useEffect(() => {
		dateRangeRef.current = dateRange;
	}, [dateRange]);

	useEffect(() => {
		setLoading(true);
		api.get(`/me/orders?range=${dateRange}`)
			.then((res) => setOrders(res.data))
			.finally(() => setLoading(false));
	}, [dateRange]);

	useEffect(() => {
		if (!token) return;

		const socket: Socket = io(import.meta.env.VITE_API_URL, {
			auth: { token },
		});

		socket.on("order:new", (order: Order) => {
			if (
				dateRangeRef.current === "today" ||
				dateRangeRef.current === "all"
			) {
				setOrders((prev) => [order, ...prev]);
			}
		});

		return () => {
			socket.disconnect();
		};
	}, [token]);

	function updateFileInState(fileId: string, patch: Partial<OrderFile>) {
		setOrders((prev) =>
			prev.map((order) => ({
				...order,
				files: order.files.map((f) =>
					f.id === fileId ? { ...f, ...patch } : f,
				),
			})),
		);
	}

	async function handlePrintFile(fileId: string) {
		const res = await api.get(`/me/files/${fileId}/download-url`);
		window.open(res.data.downloadUrl, "_blank");
		await api.patch(`/me/files/${fileId}/status`, { status: "PRINTING" });
		updateFileInState(fileId, { status: "PRINTING" });
	}

	async function handleCompleteFile(fileId: string) {
		await api.patch(`/me/files/${fileId}/status`, { status: "COMPLETED" });
		updateFileInState(fileId, { status: "COMPLETED" });
	}

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
		<div className="min-h-screen bg-white text-[#1A1A1A]">
			<Navbar />

			<div className="max-w-5xl mx-auto px-6 py-10">
				<div className="flex items-start justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl font-bold font-serif-editorial text-[#1A1A1A]">
							Order queue
						</h1>
						<p className="text-sm text-gray-500 font-mono-code mt-1">
							{orders.length} orders &middot; {allFiles.length}{" "}
							files total
						</p>
					</div>
					<Link
						to="/dashboard/shop"
						className="shrink-0 flex items-center space-x-2 text-xs font-mono-code font-bold text-white bg-[#D97706] hover:bg-[#b45309] px-4 py-2.5 rounded-lg transition whitespace-nowrap shadow-sm"
					>
						<span>View QR Code</span>
					</Link>
				</div>

				<DateTabs activeRange={dateRange} onChange={setDateRange} />
				<StatusTabs
					tabs={tabs}
					activeTab={activeTab}
					onChange={setActiveTab}
				/>

				{loading ? (
					<div className="text-center py-16 text-gray-500 font-mono-code text-sm">
						Loading orders...
					</div>
				) : filteredOrders.length === 0 ? (
					<div className="text-center py-16 bg-[#F2EFE9] border border-[#E5E2D9] rounded-2xl">
						<p className="text-gray-500 font-mono-code text-sm">
							No orders here yet.
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{filteredOrders.map((order) => (
							<OrderCard
								key={order.id}
								order={order}
								onPrintFile={handlePrintFile}
								onCompleteFile={handleCompleteFile}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
