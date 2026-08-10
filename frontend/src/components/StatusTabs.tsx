interface Tab {
	id: string;
	label: string;
	count: number;
}

interface StatusTabsProps {
	tabs: Tab[];
	activeTab: string;
	onChange: (id: string) => void;
}

export default function StatusTabs({ tabs, activeTab, onChange }: StatusTabsProps) {
	return (
		<div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					onClick={() => onChange(tab.id)}
					className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 border whitespace-nowrap ${
						activeTab === tab.id
							? "bg-[#1A1A1A] text-white border-black"
							: "bg-white text-gray-700 border-[#E5E2D9] hover:bg-gray-50"
					}`}
				>
					<span>{tab.label}</span>
					<span className="w-5 h-5 rounded-full bg-gray-200 text-black flex items-center justify-center text-[10px]">
						{tab.count}
					</span>
				</button>
			))}
		</div>
	);
}