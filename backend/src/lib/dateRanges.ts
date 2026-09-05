export function getDateRangeBounds(range: string): { start: Date; end: Date } | null {
	const now = new Date();

	if (range === "today") {
		const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const end = new Date(start);
		end.setDate(end.getDate() + 1);
		return { start, end };
	}

	if (range === "yesterday") {
		const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
		const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		return { start, end };
	}

	if (range === "week") {
		const start = new Date(now);
		start.setDate(now.getDate() - 7);
		return { start, end: now };
	}

	if (range === "month") {
		const start = new Date(now);
		start.setMonth(now.getMonth() - 1);
		return { start, end: now };
	}

	// "all" or unrecognized -> no filtering
	return null;
}