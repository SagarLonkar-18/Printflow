import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import Navbar from "../components/Navbar";
import OrderCard from "../components/OrderCard";
import StatusTabs from "../components/StatusTabs";
import ShopQRCode from "../components/ShopQRCode";

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
	const [shop, setShop] = useState<{ name: string; slug: string } | null>(null);

	useEffect(() => {
		api.get("/me/shop").then((res) => setShop(res.data));
	}, []);

	useEffect(() => {
		api
			.get("/me/orders")
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

	function updateFileInState(fileId: string, patch: Partial<OrderFile>) {
		setOrders((prev) =>
			prev.map((order) => ({
				...order,
				files: order.files.map((f) => (f.id === fileId ? { ...f, ...patch } : f)),
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

	// Counts and filtering are file-based, not order-based - a print shop
	// owner thinks in terms of "how many files do I need to print," not
	// "how many orders," since one order can mix files at different stages.
	const allFiles = orders.flatMap((o) => o.files);
	const tabs = [
		{ id: "all", label: "All Files", count: allFiles.length },
		{ id: "PENDING", label: "New", count: allFiles.filter((f) => f.status === "PENDING").length },
		{ id: "PRINTING", label: "Printing", count: allFiles.filter((f) => f.status === "PRINTING").length },
		{ id: "COMPLETED", label: "Completed", count: allFiles.filter((f) => f.status === "COMPLETED").length },
	];

	// An order is shown if at least one of its files matches the active tab.
	const filteredOrders = orders.filter(
		(order) => activeTab === "all" || order.files.some((f) => f.status === activeTab),
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

			{shop && <ShopQRCode shopName={shop.name} shopSlug={shop.slug} />}

			<div className="max-w-5xl mx-auto px-6 py-10">
				<div className="mb-8">
					<h1 className="text-3xl font-bold font-serif-editorial text-[#1A1A1A]">Order queue</h1>
					<p className="text-sm text-gray-500 font-mono-code mt-1">
						{orders.length} orders &middot; {allFiles.length} files total
					</p>
				</div>

				<StatusTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

				{loading ? (
					<div className="text-center py-16 text-gray-500 font-mono-code text-sm">Loading orders...</div>
				) : filteredOrders.length === 0 ? (
					<div className="text-center py-16 bg-[#F2EFE9] border border-[#E5E2D9] rounded-2xl">
						<p className="text-gray-500 font-mono-code text-sm">No orders here yet.</p>
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