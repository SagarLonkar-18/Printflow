import { MOCK_FAQ } from "../../mock";

export default function FAQSection() {
	return (
		<section id="faq" className="py-24 max-w-4xl mx-auto px-6 lg:px-12">
			<div className="text-center mb-16 space-y-4">
				<span className="text-[#D97706] text-xs font-mono-code font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 border border-orange-200">
					FAQ
				</span>
				<h2 className="text-4xl font-serif-editorial text-[#1A1A1A]">Frequently Asked Questions</h2>
			</div>

			<div className="space-y-6">
				{MOCK_FAQ.map((faq, idx) => (
					<div key={idx} className="bg-[#F2EFE9] rounded-2xl p-6 border border-[#E5E2D9] space-y-3">
						<h3 className="text-lg font-bold text-[#1A1A1A] font-serif-editorial flex items-center space-x-3">
							<span className="text-[#D97706] font-mono-code text-sm">Q{idx + 1}.</span>
							<span>{faq.question}</span>
						</h3>
						<p className="text-gray-600 text-sm leading-relaxed pl-7 font-sans-clean">{faq.answer}</p>
					</div>
				))}
			</div>
		</section>
	);
}