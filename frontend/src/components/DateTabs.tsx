interface DateTabsProps {
	activeRange: string;
	onChange: (range: string) => void;
}

const RANGES = [
	{ id: "today", label: "Today" },
	{ id: "yesterday", label: "Yesterday" },
	{ id: "week", label: "This Week" },
	{ id: "month", label: "This Month" },
	{ id: "all", label: "All Time" },
];

export default function DateTabs({ activeRange, onChange }: DateTabsProps) {
	return (
		<div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
			{RANGES.map((r) => (
				<button
					key={r.id}
					onClick={() => onChange(r.id)}
					className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code font-semibold transition whitespace-nowrap border ${
						activeRange === r.id
							? "bg-[#1A1A1A] text-white border-black"
							: "bg-white text-gray-600 border-[#E5E2D9] hover:bg-gray-50"
					}`}
				>
					{r.label}
				</button>
			))}
		</div>
	);
}