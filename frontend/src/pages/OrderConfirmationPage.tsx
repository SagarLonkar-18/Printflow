import { useParams } from "react-router-dom";

export default function OrderConfirmationPage() {
	const { id } = useParams<{ id: string }>();

	return (
		<div className="max-w-sm mx-auto p-6 text-center mt-12">
			<div className="text-5xl mb-4">✅</div>
			<h1 className="text-2xl font-bold mb-2">Order Submitted!</h1>
			<p className="text-gray-500 mb-4">
				Your document has been sent to the shop. They'll begin printing
				shortly.
			</p>
			<p className="text-xs text-gray-400">Order ID: {id}</p>
		</div>
	);
}
