import { useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmationPage() {
	const { id } = useParams<{ id: string }>();

	return (
		<div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] flex items-center justify-center px-6">
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
			<div className="max-w-sm w-full bg-[#F2EFE9] border border-[#E5E2D9] rounded-3xl p-8 text-center">
				<div className="w-14 h-14 rounded-full bg-green-100 border border-green-300 text-green-700 flex items-center justify-center mx-auto mb-4">
					<CheckCircle2 className="w-7 h-7" />
				</div>
				<h1 className="text-2xl font-bold font-serif-editorial text-[#1A1A1A] mb-2">
					Order submitted
				</h1>
				<p className="text-sm text-gray-600 font-sans-clean mb-4">
					Your document has been sent to the shop. They'll begin
					printing shortly.
				</p>
				<p className="text-xs text-gray-400 font-mono-code">
					Order ID: {id}
				</p>
			</div>
		</div>
	);
}
