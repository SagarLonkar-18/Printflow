import { useState } from "react";
import { MOCK_ORDERS } from "../mock";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import CustomerSimulator from "../components/home/CustomerSimulator";
import DashboardPreview from "../components/home/DashboardPreview";
import HowItWorksSection from "../components/home/HowItWorksSection";
import FAQSection from "../components/home/FAQSection";

export default function HomePage() {
	const [simStep, setSimStep] = useState(1);
	const [simFile, setSimFile] = useState<any>(null);
	const [simCopies, setSimCopies] = useState(2);
	const [simColor, setSimColor] = useState("Color (CMYK)");
	const [simPaper, setSimPaper] = useState("A4");
	const [simBinding, setSimBinding] = useState("Spiral Binding");
	const [simNotes, setSimNotes] = useState("Double sided please.");

	const [dashboardOrders, setDashboardOrders] = useState(MOCK_ORDERS);
	const [activeTab, setActiveTab] = useState("all");

	function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] || {
			name: "Tax_Audit_Report_2025_Final.pdf",
			size: "2.4 MB",
			pages: 24,
		};
		setSimFile(file);
		toast.success("PDF uploaded & preflight validated!");
		setSimStep(3);
	}

	function handleCompleteOrder() {
		const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
		const newOrder = {
			id: newOrderId,
			customerName: "You (Live Simulator)",
			phone: "+91 99999 88888",
			fileName: simFile?.name || "Customer_Document.pdf",
			pages: simFile?.pages || 24,
			copies: simCopies,
			color: simColor,
			paperSize: simPaper,
			binding: simBinding,
			notes: simNotes || "No special instructions",
			status: "new",
			timeAgo: "Just now",
			total:
				simCopies *
				(simColor.includes("Color") ? 15 : 5) *
				(simFile?.pages || 24),
		};

		setDashboardOrders([newOrder, ...dashboardOrders]);
		setSimStep(4);
		toast.success(
			`Order #${newOrderId} sent successfully to shop dashboard!`,
		);
	}

	function updateOrderStatus(orderId: string, newStatus: string) {
		setDashboardOrders(
			dashboardOrders.map((o) =>
				o.id === orderId ? { ...o, status: newStatus } : o,
			),
		);
		toast.info(
			`Order ${orderId} status updated to: ${newStatus.toUpperCase()}`,
		);
	}

	return (
		<div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] font-sans selection:bg-[#D97706] selection:text-white relative">
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

			<div className="bg-[#1A1A1A] text-[#FAF9F5] py-2 px-4 text-center text-xs font-mono-code tracking-wide">
				<span>
					⚡ PrintFlow: Instant QR PDF Ordering for Print Shops — No
					WhatsApp required.
				</span>
			</div>

			<Navbar />
			<HeroSection />

			<section
				id="simulator"
				className="py-24 bg-[#F2EFE9] border-y border-[#E5E2D9]"
			>
				<div className="max-w-7xl mx-auto px-6 lg:px-12">
					<div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
						<h2 className="text-4xl sm:text-5xl font-serif-editorial text-[#1A1A1A]">
							Experience the Customer & Shop Owner Flow
						</h2>
						<p className="text-gray-600 font-sans-clean text-base">
							Test the customer mobile ordering experience on the
							left, and watch the order sync instantly to the shop
							owner's live dashboard on the right.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
						<CustomerSimulator
							step={simStep}
							setStep={setSimStep}
							simFile={simFile}
							setSimFile={setSimFile}
							copies={simCopies}
							setCopies={setSimCopies}
							color={simColor}
							setColor={setSimColor}
							paper={simPaper}
							setPaper={setSimPaper}
							binding={simBinding}
							setBinding={setSimBinding}
							notes={simNotes}
							setNotes={setSimNotes}
							onFileUpload={handleFileUpload}
							onCompleteOrder={handleCompleteOrder}
						/>
						<DashboardPreview
							orders={dashboardOrders}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							onUpdateStatus={updateOrderStatus}
						/>
					</div>
				</div>
			</section>

			<HowItWorksSection />
			<FAQSection />
			<Footer />
		</div>
	);
}
