import {
  FolderKanban,
  FileText,
  CreditCard,
  Folder,
  Star,
} from "lucide-react";

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6 hover:border-blue-500 transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-400 text-sm">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </div>

      </div>

      <button className="mt-6 text-blue-400 hover:underline">
        View {title} →
      </button>

    </div>
  );
}

export default function CustomerStats() {
  return (
    <div className="grid grid-cols-5 gap-5">

      <StatCard
        title="Projects"
        value="0"
        color="bg-blue-600"
        icon={<FolderKanban />}
      />

      <StatCard
        title="Invoices"
        value="0"
        color="bg-green-600"
        icon={<FileText />}
      />

      <StatCard
        title="Payments"
        value="₹0"
        color="bg-purple-600"
        icon={<CreditCard />}
      />

      <StatCard
        title="Documents"
        value="0"
        color="bg-orange-600"
        icon={<Folder />}
      />

      <StatCard
        title="Reviews"
        value="0"
        color="bg-cyan-600"
        icon={<Star />}
      />

    </div>
  );
}