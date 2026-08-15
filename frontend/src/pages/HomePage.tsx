import { useState } from "react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import CustomerSimulator from "../components/home/CustomerSimulator";
import DashboardSimulator from "../components/home/DashboardSimulator";
import FeaturesSection from "../components/home/FeaturesSection";
import CursorFollower from "../components/CursorFollower";

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

const MOCK_QUEUE: Order[] = [
	{
		id: "order-1",
		createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
		files: [
			{ id: "file-1", originalName: "Semester_Notes_Final.pdf", copies: 3, colorMode: "BW", status: "PENDING" },
		],
	},
	{
		id: "order-2",
		createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
		files: [
			{ id: "file-2", originalName: "Company_Brochure_v3.pdf", copies: 1, colorMode: "COLOR", status: "PRINTING" },
		],
	},
	{
		id: "order-3",
		createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
		files: [
			{ id: "file-3", originalName: "Assignment_Physics.pdf", copies: 2, colorMode: "BW", status: "COMPLETED" },
		],
	},
];

export default function HomePage() {
	const [queueOrders, setQueueOrders] = useState<Order[]>(MOCK_QUEUE);
	const [activeTab, setActiveTab] = useState("all");

	function handleOrderSubmitted(files: { name: string; copies: number; colorMode: "BW" | "COLOR" }[]) {
		const newOrder: Order = {
			id: `order-${Math.floor(1000 + Math.random() * 9000)}`,
			createdAt: new Date().toISOString(),
			files: files.map((f, i) => ({
				id: `file-${Math.floor(1000 + Math.random() * 9000)}-${i}`,
				originalName: f.name,
				copies: f.copies,
				colorMode: f.colorMode,
				status: "PENDING",
			})),
		};
		setQueueOrders([newOrder, ...queueOrders]);
		toast.success("Order sent to dashboard");
	}

	function updateFileInState(fileId: string, status: string) {
		setQueueOrders((prev) =>
			prev.map((order) => ({
				...order,
				files: order.files.map((f) => (f.id === fileId ? { ...f, status } : f)),
			})),
		);
	}

	function handlePrintFile(fileId: string) {
		updateFileInState(fileId, "PRINTING");
		toast.info("File marked as printing");
	}

	function handleCompleteFile(fileId: string) {
		updateFileInState(fileId, "COMPLETED");
		toast.success("File marked as completed");
	}

	return (
		<div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#D97706] selection:text-white relative">
			<CursorFollower />
			<Navbar />
			<HeroSection />

			<section id="simulator" className="relative -mt-10 sm:-mt-14 py-24 bg-[#F2EFE9]">
				<div className="max-w-7xl mx-auto px-6 lg:px-12">
					<div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
						<h2 className="text-4xl sm:text-5xl font-serif-editorial text-[#1A1A1A]">Try it yourself</h2>
						<p className="text-gray-600 font-sans-clean text-base">
							Submit a sample order on the left and watch it appear in the order queue on the right —
							the same interface real shop owners use.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
						<CustomerSimulator onOrderSubmitted={handleOrderSubmitted} />
						<DashboardSimulator
							orders={queueOrders}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							onPrintFile={handlePrintFile}
							onCompleteFile={handleCompleteFile}
						/>
					</div>
				</div>
			</section>

			<FeaturesSection />
			<Footer />
		</div>
	);
}