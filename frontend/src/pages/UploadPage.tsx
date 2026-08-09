import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

interface ShopInfo {
	id: string;
	name: string;
	slug: string;
}

export default function UploadPage() {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();

	const [shop, setShop] = useState<ShopInfo | null>(null);
	const [notFound, setNotFound] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [copies, setCopies] = useState(1);
	const [colorMode, setColorMode] = useState<"BW" | "COLOR">("BW");
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!slug) return;
		api.get(`/shops/${slug}`)
			.then((res) => setShop(res.data))
			.catch(() => setNotFound(true));
	}, [slug]);

	async function handleSubmit() {
		if (!file || !slug) return;
		setUploading(true);
		setError(null);

		try {
			// Step 1: ask backend for a presigned S3 URL
			const presignRes = await api.post(`/shops/${slug}/upload-url`, {
				fileName: file.name,
				mimeType: file.type,
			});
			const { uploadUrl, fileKey } = presignRes.data;

			// Step 2: upload the actual file bytes DIRECTLY to S3, not through our API
			await fetch(uploadUrl, {
				method: "PUT",
				headers: { "Content-Type": file.type },
				body: file,
			});

			// Step 3: create the order record, referencing the uploaded file
			const orderRes = await api.post(`/shops/${slug}/orders`, {
				fileKey,
				originalName: file.name,
				copies,
				colorMode,
			});

			navigate(`/order/${orderRes.data.id}`);
		} catch (err) {
			console.error(err);
			setError(
				"Something went wrong submitting your order. Please try again.",
			);
		} finally {
			setUploading(false);
		}
	}

	if (notFound)
		return (
			<div className="p-8 text-center text-error">Shop not found.</div>
		);
	if (!shop) return <div className="p-8 text-center">Loading...</div>;

	return (
		<div className="max-w-sm mx-auto p-6">
			<h1 className="text-2xl font-bold mb-1">{shop.name}</h1>
			<p className="text-sm text-gray-500 mb-6">
				Upload your document to print
			</p>

			<input
				type="file"
				accept="application/pdf"
				className="file-input file-input-bordered w-full mb-4"
				onChange={(e) => setFile(e.target.files?.[0] ?? null)}
			/>

			<div className="mb-3">
				<label className="label">Copies</label>
				<input
					type="number"
					min={1}
					value={copies}
					onChange={(e) => setCopies(Number(e.target.value))}
					className="input input-bordered w-full"
				/>
			</div>

			<div className="mb-4">
				<label className="label">Color</label>
				<select
					value={colorMode}
					onChange={(e) =>
						setColorMode(e.target.value as "BW" | "COLOR")
					}
					className="select select-bordered w-full"
				>
					<option value="BW">Black & White</option>
					<option value="COLOR">Color</option>
				</select>
			</div>

			{error && <p className="text-error text-sm mb-3">{error}</p>}

			<button
				className="btn btn-primary w-full"
				disabled={!file || uploading}
				onClick={handleSubmit}
			>
				{uploading ? "Submitting..." : "Submit Order"}
			</button>
		</div>
	);
}
