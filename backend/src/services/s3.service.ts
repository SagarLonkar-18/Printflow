import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3 = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

const ALLOWED_MIME_TYPES = new Set(["application/pdf"]);

export async function createPresignedUpload(
	shopSlug: string,
	originalName: string,
	mimeType: string,
) {
	if (!ALLOWED_MIME_TYPES.has(mimeType)) {
		throw new Error("UNSUPPORTED_FILE_TYPE");
	}

	const key = `uploads/${shopSlug}/${randomUUID()}-${originalName}`;

	const command = new PutObjectCommand({
		Bucket: process.env.S3_BUCKET_NAME!,
		Key: key,
		ContentType: mimeType,
	});

	const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes to complete the upload

	return { uploadUrl, key };
}
