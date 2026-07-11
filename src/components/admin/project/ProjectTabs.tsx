interface Props {
  activeTab: string;
  onChange: (tab: string) => void;
}

const tabs = [
  "Overview",
  "Milestones",
  "Documents",
  "Invoices",
  "Payments",
  "Timeline",
  "Notes",
];

export default function ProjectTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-3">

      <div className="flex flex-wrap gap-2">

        {tabs.map((tab) => (

          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`rounded-xl px-5 py-2 transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            {tab}
          </button>

        ))}

      </div>

    </div>
  );
}