import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import { io, Socket } from "socket.io-client";

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

	// Source of truth: always fetch current orders via HTTP on mount.
	useEffect(() => {
		api.get("/me/orders")
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

	if (loading) return <div className="p-8">Loading orders...</div>;

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Orders</h1>
			<div className="space-y-3">
				{orders.length === 0 && (
					<p className="text-gray-500">No orders yet.</p>
				)}
				{orders.map((order) => (
					<div
						key={order.id}
						className="card bg-base-100 shadow-sm p-4 flex flex-row justify-between items-center"
					>
						<div>
							<p className="font-medium">{order.originalName}</p>
							<p className="text-sm text-gray-500">
								{order.copies}x &middot; {order.colorMode}
							</p>
							<span className="badge badge-outline mt-1">
								{order.status}
							</span>
						</div>
						<div className="flex gap-2">
							{order.status === "PENDING" && (
								<button
									className="btn btn-sm btn-primary"
									onClick={() => markPrinting(order.id)}
								>
									Print
								</button>
							)}
							{order.status === "PRINTING" && (
								<button
									className="btn btn-sm btn-success"
									onClick={() => markCompleted(order.id)}
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
