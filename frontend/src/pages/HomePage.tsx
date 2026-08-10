import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Printer,
	QrCode,
	Upload,
	CheckCircle2,
	Smartphone,
	Monitor,
	FileText,
	ChevronRight,
	Menu,
	X,
	Bell,
	Sparkles,
	Send,
} from "lucide-react";
import { MOCK_ORDERS, MOCK_FAQ } from "../mock";
import { toast } from "sonner";
import logo from "/printflow-logo.png";

export default function HomePage() {
	const navigate = useNavigate();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Interactive Simulator State
	const [simulatorStep, setSimulatorStep] = useState(1);
	const [simFile, setSimFile] = useState(null);
	const [simCopies, setSimCopies] = useState(2);
	const [simColor, setSimColor] = useState("Color (CMYK)");
	const [simPaper, setSimPaper] = useState("A4");
	const [simBinding, setSimBinding] = useState("Spiral Binding");
	const [simNotes, setSimNotes] = useState("Double sided please.");

	// Live Dashboard Orders state
	const [dashboardOrders, setDashboardOrders] = useState(MOCK_ORDERS);
	const [activeTab, setActiveTab] = useState("all");

	const handleFileUpload = (e) => {
		const file = e.target.files[0] || {
			name: "Tax_Audit_Report_2025_Final.pdf",
			size: "2.4 MB",
			pages: 24,
		};
		setSimFile(file);
		toast.success("PDF uploaded & preflight validated!");
		setSimulatorStep(3);
	};

	const handleCompleteOrder = () => {
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
		setSimulatorStep(4);
		toast.success(
			`🎉 Order #${newOrderId} sent successfully to shop dashboard!`,
		);
	};

	const updateOrderStatus = (orderId, newStatus) => {
		setDashboardOrders(
			dashboardOrders.map((o) =>
				o.id === orderId ? { ...o, status: newStatus } : o,
			),
		);
		toast.info(
			`Order ${orderId} status updated to: ${newStatus.toUpperCase()}`,
		);
	};

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

			<nav className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E5E2D9]">
				<div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
					<div
						className="flex items-center space-x-3 cursor-pointer"
						onClick={() =>
							window.scrollTo({ top: 0, behavior: "smooth" })
						}
					>
						{/* <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-md">
							<Printer className="w-5 h-5 text-[#D97706]" />
						</div>
						<div>
							<span className="text-2xl font-bold tracking-tight font-serif-editorial">
								Print
								<span className="text-[#D97706]">Flow</span>
							</span>
							<span className="block text-[9px] uppercase tracking-widest text-gray-500 font-mono-code -mt-1">
								Zero WhatsApp Friction
							</span>
						</div> */}
						<img src={logo} alt="PrintFlow Logo" className="w-42 h-auto" />
					</div>

					<div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-600 font-sans-clean">
						<a
							href="#simulator"
							className="hover:text-[#1A1A1A] transition-colors"
						>
							Live Simulator
						</a>
						<a
							href="#how-it-works"
							className="hover:text-[#1A1A1A] transition-colors"
						>
							How It Works
						</a>
						<a
							href="#faq"
							className="hover:text-[#1A1A1A] transition-colors"
						>
							FAQ
						</a>
					</div>

					<div className="hidden md:flex items-center space-x-4">
						<button
							onClick={() => navigate("/login")}
							className="text-sm font-medium text-gray-600 hover:text-black px-4 py-2 transition"
						>
							Log In
						</button>
						<button
							onClick={() => navigate("/signup")}
							className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full font-medium text-sm shadow-md transition flex items-center space-x-2 group"
						>
							<span>Get Started</span>
							{/* <div className="w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
								<ChevronRight className="w-3.5 h-3.5" />
							</div> */}
						</button>
					</div>

					<div className="lg:hidden">
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="p-2 text-gray-800"
						>
							{mobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>

				{mobileMenuOpen && (
					<div className="lg:hidden bg-[#FAF9F5] border-b border-[#E5E2D9] px-6 py-6 space-y-4 font-sans-clean">
						<a
							href="#simulator"
							onClick={() => setMobileMenuOpen(false)}
							className="block text-base font-medium"
						>
							Live Simulator
						</a>
						<a
							href="#how-it-works"
							onClick={() => setMobileMenuOpen(false)}
							className="block text-base font-medium"
						>
							How It Works
						</a>
						<a
							href="#faq"
							onClick={() => setMobileMenuOpen(false)}
							className="block text-base font-medium"
						>
							FAQ
						</a>
						<div className="pt-4 border-t border-[#E5E2D9] flex flex-col space-y-3">
							<button
								onClick={() => {
									navigate("/login");
									setMobileMenuOpen(false);
								}}
								className="w-full py-3 text-center font-medium bg-gray-200 rounded-full"
							>
								Log In
							</button>
							<button
								onClick={() => {
									navigate("/signup");
									setMobileMenuOpen(false);
								}}
								className="w-full py-3 text-center font-medium bg-[#1A1A1A] text-white rounded-full"
							>
								Get Started
							</button>
						</div>
					</div>
				)}
			</nav>

			<section className="relative pt-16 pb-28 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
					<div className="lg:col-span-7 space-y-8">
						{/* <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E5E2D9] text-[#1A1A1A] text-xs font-mono-code font-bold uppercase tracking-wider">
							<span className="w-2 h-2 rounded-full bg-[#D97706]" />
							<span>Zero WhatsApp Friction For Print Shops</span>
						</div> */}

						<h1 className="text-5xl sm:text-7xl font-serif-editorial tracking-tight text-[#1A1A1A] leading-[1.05]">
							Instant Print Orders for{" "}
							<span className="italic text-[#D97706]">
								PDF Uploads & QR Scans
							</span>{" "}
							Without WhatsApp.
						</h1>

						<p className="text-lg sm:text-xl text-gray-600 font-sans-clean leading-relaxed max-w-2xl font-normal">
							PrintFlow connects walk-in and remote customers
							directly to your shop counter dashboard. Customers
							scan your QR code, upload PDFs, pick print settings,
							and your dashboard updates instantly.
						</p>

						<div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
							<a
								href="#simulator"
								className="bg-[#1A1A1A] hover:bg-black text-white px-8 py-4 rounded-full font-sans-clean font-semibold text-sm shadow-lg transition flex items-center justify-center space-x-3 group"
							>
								<span>Try Interactive Simulator</span>
								{/* <div className="w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
									<ChevronRight className="w-3.5 h-3.5" />
								</div> */}
							</a>
							
						</div>

						<div className="pt-6 border-t border-[#E5E2D9] text-[11px] font-mono-code uppercase tracking-widest text-gray-500">
							Designed for photocopy shops, print hubs, university
							copy centers & digital presses.
						</div>
					</div>

					<div className="lg:col-span-5 flex justify-center">
						<div className="relative w-full max-w-md bg-[#F2EFE9] border border-[#E5E2D9] rounded-3xl p-8 shadow-2xl overflow-hidden">
							<div className="absolute top-4 right-4 bg-[#D97706] text-white text-[10px] font-mono-code uppercase px-3 py-1 rounded-full font-bold">
								LIVE DEMO STAND
							</div>

							<div className="text-center space-y-4 py-6">
								<div className="w-40 h-40 mx-auto bg-white p-4 rounded-2xl shadow-inner border border-[#E5E2D9]">
									<img
										src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://printflow.shop/demo"
										alt="PrintFlow QR Stand"
										className="w-full h-full rounded"
									/>
								</div>
								<div>
									<h3 className="font-serif-editorial text-2xl text-[#1A1A1A]">
										Gupta Xerox & Press
									</h3>
									<p className="text-xs font-mono-code text-[#D97706] mt-1">
										Scan camera to test customer flow
									</p>
								</div>

								<div className="pt-4">
									<a
										href="#simulator"
										className="inline-flex items-center space-x-2 bg-[#1A1A1A] text-white text-xs font-mono-code px-5 py-2.5 rounded-xl hover:bg-black transition shadow"
									>
										<Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
										<span>
											Launch Interactive Simulator
										</span>
									</a>
								</div>
							</div>

							<div className="mt-4 pt-4 border-t border-[#E5E2D9] text-xs font-mono-code flex items-center justify-between text-gray-600">
								<span>Incoming: Tax_Audit.pdf</span>
								<span className="text-green-600 font-bold flex items-center">
									<span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping mr-1" />{" "}
									Live
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section
				id="simulator"
				className="py-24 bg-[#F2EFE9] border-y border-[#E5E2D9]"
			>
				<div className="mt-7"></div>
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
						<div className="lg:col-span-5 bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] shadow-xl relative">
							<div className="absolute top-4 right-4 flex items-center space-x-1.5">
								<span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
								<span className="text-xs font-mono-code text-gray-500">
									Customer Phone View
								</span>
							</div>

							<div className="flex items-center space-x-3 mb-6">
								<div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center border border-orange-200">
									<Smartphone className="w-5 h-5 text-[#D97706]" />
								</div>
								<div>
									<h3 className="font-bold text-[#1A1A1A] text-base font-sans-clean">
										Step {simulatorStep}: Mobile Ordering
									</h3>
									<p className="text-xs text-gray-500 font-mono-code">
										Gupta Print Hub Stand
									</p>
								</div>
							</div>

							<div className="w-full bg-gray-200 h-1.5 rounded-full mb-6 overflow-hidden">
								<div
									className="bg-[#D97706] h-full transition-all duration-300"
									style={{
										width: `${(simulatorStep / 4) * 100}%`,
									}}
								/>
							</div>

							{simulatorStep === 1 && (
								<div className="space-y-6 text-center py-6">
									<div className="w-44 h-44 mx-auto bg-white p-4 rounded-2xl shadow-md border border-[#E5E2D9] flex items-center justify-center">
										<img
											src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://printflow.shop/gupta"
											alt="QR"
											className="w-full h-full"
										/>
									</div>
									<div className="space-y-2">
										<h4 className="text-lg font-bold font-serif-editorial text-[#1A1A1A]">
											Scan Counter QR Code
										</h4>
										<p className="text-sm text-gray-600">
											Customers scan your acrylic counter
											stand with phone camera. No app
											download needed.
										</p>
									</div>
									<button
										onClick={() => setSimulatorStep(2)}
										className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
									>
										<QrCode className="w-4 h-4 text-[#D97706]" />
										<span>Simulate QR Scan</span>
									</button>
								</div>
							)}

							{simulatorStep === 2 && (
								<div className="space-y-6 py-4">
									<div className="border-2 border-dashed border-[#D97706]/40 rounded-2xl p-8 text-center bg-orange-50/50 hover:bg-orange-50 transition cursor-pointer relative">
										<input
											type="file"
											accept=".pdf"
											onChange={handleFileUpload}
											className="absolute inset-0 opacity-0 cursor-pointer"
										/>
										<Upload className="w-12 h-12 text-[#D97706] mx-auto mb-3 animate-bounce" />
										<h4 className="font-bold text-[#1A1A1A] text-base">
											Upload Document (PDF)
										</h4>
										<p className="text-xs text-gray-500 mt-1">
											Tax_Audit_Report_2025.pdf (Preflight
											verified)
										</p>
									</div>

									<div className="space-y-3">
										<div className="text-xs font-mono-code text-gray-500 uppercase">
											Or select sample document:
										</div>
										<button
											onClick={() => {
												setSimFile({
													name: "Assignment_Physics.pdf",
													pages: 12,
													size: "1.8 MB",
												});
												setSimulatorStep(3);
												toast.success(
													"Sample PDF selected!",
												);
											}}
											className="w-full p-3 rounded-xl bg-white hover:bg-gray-50 text-left text-sm flex items-center justify-between border border-[#E5E2D9]"
										>
											<div className="flex items-center space-x-3">
												<FileText className="w-4 h-4 text-[#D97706]" />
												<span className="font-medium text-[#1A1A1A]">
													Assignment_Physics.pdf (12
													pgs)
												</span>
											</div>
											<span className="text-xs text-[#D97706] font-mono-code">
												Select
											</span>
										</button>
									</div>

									<button
										onClick={() => setSimulatorStep(1)}
										className="text-xs text-gray-500 hover:text-black underline font-mono-code"
									>
										← Back to QR Scan
									</button>
								</div>
							)}

							{simulatorStep === 3 && (
								<div className="space-y-5">
									<div className="p-3 rounded-xl bg-white border border-[#E5E2D9] flex items-center justify-between text-xs font-mono-code">
										<div className="flex items-center space-x-2">
											<FileText className="w-4 h-4 text-[#D97706]" />
											<span className="text-[#1A1A1A] font-bold truncate max-w-[180px]">
												{simFile?.name ||
													"Document.pdf"}
											</span>
										</div>
										<span className="text-green-700 font-bold">
											₹
											{(simFile?.pages || 24) *
												simCopies *
												(simColor.includes("Color")
													? 15
													: 5)}
										</span>
									</div>

									<div className="space-y-4 text-sm font-sans-clean">
										<div>
											<label className="block text-xs font-mono-code text-gray-500 mb-1.5 uppercase">
												Copies
											</label>
											<div className="flex items-center space-x-3">
												{[1, 2, 5, 10].map((num) => (
													<button
														key={num}
														onClick={() =>
															setSimCopies(num)
														}
														className={`flex-1 py-2 rounded-xl font-mono-code text-xs font-bold transition border ${simCopies === num ? "bg-[#1A1A1A] text-white border-black" : "bg-white text-gray-700 border-[#E5E2D9] hover:bg-gray-50"}`}
													>
														{num}x
													</button>
												))}
											</div>
										</div>

										<div>
											<label className="block text-xs font-mono-code text-gray-500 mb-1.5 uppercase">
												Color Mode
											</label>
											<div className="grid grid-cols-2 gap-3">
												{[
													"B&W (Economy)",
													"Color (CMYK)",
												].map((mode) => (
													<button
														key={mode}
														onClick={() =>
															setSimColor(mode)
														}
														className={`py-2 px-3 rounded-xl font-medium text-xs transition border text-center ${simColor === mode ? "bg-[#1A1A1A] text-white border-black" : "bg-white text-gray-700 border-[#E5E2D9] hover:bg-gray-50"}`}
													>
														{mode}
													</button>
												))}
											</div>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<div>
												<label className="block text-xs font-mono-code text-gray-500 mb-1 uppercase">
													Paper Size
												</label>
												<select
													value={simPaper}
													onChange={(e) =>
														setSimPaper(
															e.target.value,
														)
													}
													className="w-full p-2.5 bg-white border border-[#E5E2D9] rounded-xl text-xs font-medium"
												>
													<option value="A4">
														A4 (Standard)
													</option>
													<option value="A3">
														A3 (Large)
													</option>
													<option value="Legal">
														Legal
													</option>
												</select>
											</div>
											<div>
												<label className="block text-xs font-mono-code text-gray-500 mb-1 uppercase">
													Binding
												</label>
												<select
													value={simBinding}
													onChange={(e) =>
														setSimBinding(
															e.target.value,
														)
													}
													className="w-full p-2.5 bg-white border border-[#E5E2D9] rounded-xl text-xs font-medium"
												>
													<option value="None">
														Loose Sheets
													</option>
													<option value="Spiral Binding">
														Spiral Binding
													</option>
													<option value="Hardbound">
														Hardbound
													</option>
													<option value="Stapled">
														Stapled
													</option>
												</select>
											</div>
										</div>

										<div>
											<label className="block text-xs font-mono-code text-gray-500 mb-1 uppercase">
												Instructions
											</label>
											<input
												type="text"
												value={simNotes}
												onChange={(e) =>
													setSimNotes(e.target.value)
												}
												placeholder="e.g. Print double-sided"
												className="w-full p-2.5 bg-white border border-[#E5E2D9] rounded-xl text-xs"
											/>
										</div>
									</div>

									<button
										onClick={handleCompleteOrder}
										className="w-full py-3.5 bg-[#D97706] hover:bg-[#b45309] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 mt-4 text-sm"
									>
										<Send className="w-4 h-4" />
										<span>
											Send Order to Shop Dashboard
										</span>
									</button>
								</div>
							)}

							{simulatorStep === 4 && (
								<div className="space-y-6 text-center py-8">
									<div className="w-16 h-16 rounded-full bg-green-100 border border-green-300 text-green-700 flex items-center justify-center mx-auto">
										<CheckCircle2 className="w-8 h-8" />
									</div>
									<div className="space-y-2">
										<h4 className="text-xl font-bold font-serif-editorial text-[#1A1A1A]">
											Order Sent Instantly!
										</h4>
										<p className="text-xs text-gray-600">
											Check the Shop Owner Dashboard on
											the right → Your order appeared
											immediately without WhatsApp
											ping-pong!
										</p>
									</div>
									<button
										onClick={() => {
											setSimulatorStep(1);
											setSimFile(null);
										}}
										className="py-2.5 px-6 bg-[#1A1A1A] text-white font-semibold rounded-xl text-xs transition"
									>
										Simulate Another Order
									</button>
								</div>
							)}
						</div>

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
									<p className="text-xs text-gray-500 font-mono-code">
										{dashboardOrders.length} orders total
									</p>
								</div>
							</div>

							<div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
								{[
									{
										id: "all",
										label: "All Orders",
										count: dashboardOrders.length,
									},
									{
										id: "new",
										label: "New",
										count: dashboardOrders.filter(
											(o) => o.status === "new",
										).length,
									},
									{
										id: "printing",
										label: "Printing",
										count: dashboardOrders.filter(
											(o) => o.status === "printing",
										).length,
									},
									{
										id: "ready",
										label: "Ready",
										count: dashboardOrders.filter(
											(o) => o.status === "ready",
										).length,
									},
								].map((tab) => (
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
								{dashboardOrders
									.filter(
										(o) =>
											activeTab === "all" ||
											o.status === activeTab,
									)
									.map((order) => (
										<div
											key={order.id}
											className={`bg-white p-4 rounded-2xl border transition shadow-sm ${order.status === "new" ? "border-[#D97706] ring-1 ring-[#D97706]/30" : "border-[#E5E2D9]"}`}
										>
											<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
												<div className="flex items-center space-x-3">
													<span className="font-mono-code font-bold text-[#D97706] text-xs bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
														{order.id}
													</span>
													<span className="font-bold text-[#1A1A1A] text-sm">
														{order.customerName}
													</span>
													<span className="text-xs text-gray-500 font-mono-code">
														({order.phone})
													</span>
												</div>
												<div className="flex items-center space-x-2">
													<span className="text-xs font-mono-code text-gray-500">
														{order.timeAgo}
													</span>
													<span
														className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider ${
															order.status ===
															"new"
																? "bg-[#D97706] text-white animate-pulse"
																: order.status ===
																	  "printing"
																	? "bg-blue-100 text-blue-800 border border-blue-300"
																	: order.status ===
																		  "ready"
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
													<span className="text-gray-500">
														File:
													</span>{" "}
													<span className="text-[#1A1A1A] font-bold">
														{order.fileName}
													</span>
												</div>
												<div>
													<span className="text-gray-500">
														Specs:
													</span>{" "}
													<span className="text-[#1A1A1A] font-bold">
														{order.pages} pgs •{" "}
														{order.copies} copies •{" "}
														{order.color} •{" "}
														{order.paperSize}
													</span>
												</div>
												<div className="sm:col-span-2">
													<span className="text-gray-500">
														Binding & Notes:
													</span>{" "}
													<span className="text-[#D97706] font-medium">
														{order.binding} — "
														{order.notes}"
													</span>
												</div>
											</div>

											<div className="flex items-center justify-between pt-2 border-t border-[#E5E2D9] text-xs">
												<div className="font-mono-code font-bold text-[#1A1A1A] text-sm">
													Total: ₹{order.total}
												</div>
												<div className="flex items-center space-x-2">
													{order.status === "new" && (
														<button
															onClick={() =>
																updateOrderStatus(
																	order.id,
																	"printing",
																)
															}
															className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-lg transition shadow text-xs"
														>
															Start Printing
														</button>
													)}
													{order.status ===
														"printing" && (
														<button
															onClick={() =>
																updateOrderStatus(
																	order.id,
																	"ready",
																)
															}
															className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition shadow text-xs"
														>
															Mark Ready
														</button>
													)}
													{order.status ===
														"ready" && (
														<button
															onClick={() =>
																updateOrderStatus(
																	order.id,
																	"completed",
																)
															}
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
					</div>
				</div>
			</section>

			<section
				id="how-it-works"
				className="py-24 max-w-7xl mx-auto px-6 lg:px-12"
			>
				<div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
					<span className="text-[#D97706] text-xs font-mono-code font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 border border-orange-200">
						Architected for Speed
					</span>
					<h2 className="text-4xl sm:text-5xl font-serif-editorial text-[#1A1A1A]">
						From WhatsApp chaos to 3 streamlined steps
					</h2>
					<p className="text-gray-600 font-sans-clean text-base">
						No phone numbers to save, no messy document formats, no
						pricing haggling.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{[
						{
							step: "01",
							title: "Customer Scans QR Standee",
							desc: "Place our sleek acrylic QR code stand on your counter. Customers scan with any camera—zero app downloads.",
							icon: QrCode,
						},
						{
							step: "02",
							title: "Uploads PDF & Sets Options",
							desc: "Customer selects their PDF, specifies copies, B&W or color, paper size, and binding preference instantly.",
							icon: Upload,
						},
						{
							step: "03",
							title: "Order Pops on Dashboard",
							desc: "Owner sees the order the instant it's submitted. Click 'Start Printing', then 'Mark Ready' when done.",
							icon: Bell,
						},
					].map((item, idx) => (
						<div
							key={idx}
							className="bg-[#F2EFE9] border border-[#E5E2D9] rounded-3xl p-8 relative space-y-6 hover:border-[#D97706] transition duration-300"
						>
							<div className="absolute top-6 right-6 font-mono-code font-extrabold text-4xl text-gray-300">
								{item.step}
							</div>
							<div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-md">
								<item.icon className="w-7 h-7 text-[#D97706]" />
							</div>
							<div className="space-y-2">
								<h3 className="text-xl font-bold font-serif-editorial text-[#1A1A1A]">
									{item.title}
								</h3>
								<p className="text-gray-600 text-sm font-sans-clean leading-relaxed">
									{item.desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			<section id="faq" className="py-24 max-w-4xl mx-auto px-6 lg:px-12">
				<div className="text-center mb-16 space-y-4">
					<span className="text-[#D97706] text-xs font-mono-code font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 border border-orange-200">
						FAQ
					</span>
					<h2 className="text-4xl font-serif-editorial text-[#1A1A1A]">
						Frequently Asked Questions
					</h2>
				</div>

				<div className="space-y-6">
					{MOCK_FAQ.map((faq, idx) => (
						<div
							key={idx}
							className="bg-[#F2EFE9] rounded-2xl p-6 border border-[#E5E2D9] space-y-3"
						>
							<h3 className="text-lg font-bold text-[#1A1A1A] font-serif-editorial flex items-center space-x-3">
								<span className="text-[#D97706] font-mono-code text-sm">
									Q{idx + 1}.
								</span>
								<span>{faq.question}</span>
							</h3>
							<p className="text-gray-600 text-sm leading-relaxed pl-7 font-sans-clean">
								{faq.answer}
							</p>
						</div>
					))}
				</div>
			</section>

			<footer className="bg-[#1A1A1A] text-gray-400 py-12 text-sm font-sans-clean">
				<div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center text-white font-bold">
							<Printer className="w-4 h-4" />
						</div>
						<span className="font-serif-editorial font-bold text-white text-xl">
							Print<span className="text-[#D97706]">Flow</span>
						</span>
					</div>

					<div className="flex items-center space-x-6 text-xs font-mono-code text-gray-300">
						<a
							href="#simulator"
							className="hover:text-white transition"
						>
							Simulator
						</a>
						<a
							href="#how-it-works"
							className="hover:text-white transition"
						>
							How It Works
						</a>
						<a href="#faq" className="hover:text-white transition">
							FAQ
						</a>
					</div>

					<div className="text-xs font-mono-code text-gray-500">
						PrintFlow - a project by Sagar Lonkar
					</div>
				</div>
			</footer>
		</div>
	);
}
