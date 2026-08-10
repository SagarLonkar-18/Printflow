import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Printer, FileText, LogOut } from "lucide-react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import logo from "/printflow-logo.png";
import Navbar from "../components/Navbar";

interface Order {
	id: string;
	originalName: string;
	copies: number;
	colorMode: string;
	status: string;
	createdAt: string;
}

export default function DashboardPage() {
	const navigate = useNavigate();
	const token = useAuthStore((s) => s.token);
	const user = useAuthStore((s) => s.user);
	const logout = useAuthStore((s) => s.logout);

	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all");

	// Source of truth: always fetch current orders via HTTP on mount.
	useEffect(() => {
		api
			.get("/me/orders")
			.then((res) => setOrders(res.data))
			.finally(() => setLoading(false));
	}, []);

	// Real-time layer: new orders pushed in live, on top of the initial fetch.
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

	async function markPrinting(orderId: string) {
		await api.patch(`/me/orders/${orderId}/status`, { status: "PRINTING" });
		setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "PRINTING" } : o)));
	}

	async function markCompleted(orderId: string) {
		await api.patch(`/me/orders/${orderId}/status`, { status: "COMPLETED" });
		setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "COMPLETED" } : o)));
	}

	function handleLogout() {
		logout();
		navigate("/login");
	}

	const tabs = [
		{ id: "all", label: "All Orders", count: orders.length },
		{ id: "PENDING", label: "New", count: orders.filter((o) => o.status === "PENDING").length },
		{ id: "PRINTING", label: "Printing", count: orders.filter((o) => o.status === "PRINTING").length },
		{ id: "COMPLETED", label: "Completed", count: orders.filter((o) => o.status === "COMPLETED").length },
	];

	const filteredOrders = orders.filter((o) => activeTab === "all" || o.status === activeTab);

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

				<div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 border whitespace-nowrap ${
								activeTab === tab.id
									? "bg-[#1A1A1A] text-white border-black"
									: "bg-white text-gray-700 border-[#E5E2D9] hover:bg-gray-50"
							}`}
						>
							<span>{tab.label}</span>
							<span className="w-5 h-5 rounded-full bg-gray-200 text-black flex items-center justify-center text-[10px]">
								{tab.count}
							</span>
						</button>
					))}
				</div>

				{loading ? (
					<div className="text-center py-16 text-gray-500 font-mono-code text-sm">
						Loading orders...
					</div>
				) : filteredOrders.length === 0 ? (
					<div className="text-center py-16 bg-[#F2EFE9] border border-[#E5E2D9] rounded-2xl">
						<p className="text-gray-500 font-mono-code text-sm">No orders here yet.</p>
					</div>
				) : (
					<div className="space-y-4">
						{filteredOrders.map((order) => (
							<div
								key={order.id}
								className={`bg-white p-5 rounded-2xl border transition shadow-sm ${
									order.status === "PENDING"
										? "border-[#D97706] ring-1 ring-[#D97706]/20"
										: "border-[#E5E2D9]"
								}`}
							>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
									<div className="flex items-center space-x-3">
										<div className="w-10 h-10 rounded-xl bg-[#F2EFE9] flex items-center justify-center">
											<FileText className="w-4 h-4 text-[#D97706]" />
										</div>
										<div>
											<p className="font-bold text-[#1A1A1A] text-sm font-sans-clean">
												{order.originalName}
											</p>
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
												onClick={() => markPrinting(order.id)}
												className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-lg transition shadow text-xs"
											>
												Start Printing
											</button>
										)}
										{order.status === "PRINTING" && (
											<button
												onClick={() => markCompleted(order.id)}
												className="px-3.5 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition shadow text-xs"
											>
												Mark Completed
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}