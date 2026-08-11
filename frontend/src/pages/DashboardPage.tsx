import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import Navbar from "../components/Navbar";
import OrderCard from "../components/OrderCard";
import StatusTabs from "../components/StatusTabs";

interface Order {
	id: string;
	originalName: string;
	copies: number;
	colorMode: string;
	status: string;
	createdAt: string;
}

export default function DashboardPage() {
	const token = useAuthStore((s) => s.token);

	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all");

	useEffect(() => {
		api.get("/me/orders")
			.then((res) => setOrders(res.data))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (!token) return;

		const socket: Socket = io(import.meta.env.VITE_API_URL, {
			auth: { token },
		});

		socket.on("order:new", (order: Order) => {
			setOrders((prev) => [order, ...prev]);
		});

		return () => {
			socket.disconnect();
		};
	}, [token]);

	async function handlePrint(orderId: string) {
		const res = await api.get(`/me/orders/${orderId}/download-url`);
		window.open(res.data.downloadUrl, "_blank");
		await markPrinting(orderId);
	}

	async function markPrinting(orderId: string) {
		await api.patch(`/me/orders/${orderId}/status`, { status: "PRINTING" });
		setOrders((prev) =>
			prev.map((o) =>
				o.id === orderId ? { ...o, status: "PRINTING" } : o,
			),
		);
	}

	async function markCompleted(orderId: string) {
		await api.patch(`/me/orders/${orderId}/status`, {
			status: "COMPLETED",
		});
		setOrders((prev) =>
			prev.map((o) =>
				o.id === orderId ? { ...o, status: "COMPLETED" } : o,
			),
		);
	}

	const tabs = [
		{ id: "all", label: "All Orders", count: orders.length },
		{
			id: "PENDING",
			label: "New",
			count: orders.filter((o) => o.status === "PENDING").length,
		},
		{
			id: "PRINTING",
			label: "Printing",
			count: orders.filter((o) => o.status === "PRINTING").length,
		},
		{
			id: "COMPLETED",
			label: "Completed",
			count: orders.filter((o) => o.status === "COMPLETED").length,
		},
	];

	const filteredOrders = orders.filter(
		(o) => activeTab === "all" || o.status === activeTab,
	);

	return (
		<div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A]">
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

			<Navbar />

			<div className="max-w-5xl mx-auto px-6 py-10">
				<div className="mb-8">
					<h1 className="text-3xl font-bold font-serif-editorial text-[#1A1A1A]">
						Order queue
					</h1>
					<p className="text-sm text-gray-500 font-mono-code mt-1">
						{orders.length} orders total
					</p>
				</div>

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
								onPrint={handlePrint}
								onMarkCompleted={markCompleted}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
