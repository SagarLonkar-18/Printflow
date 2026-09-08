import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function getPdfPageCount(file: File): Promise<number> {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
		return pdf.numPages;
	} catch (err) {
		console.error("Failed to read PDF page count, falling back to 1", err);
		return 1;
	}
}