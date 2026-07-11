import {
  UserPlus,
  FolderKanban,
  FileText,
  CreditCard,
  Upload,
  CheckCircle,
} from "lucide-react";

export default function CustomerTimeline() {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold">
          Activity Timeline
        </h2>

        <span className="text-sm text-gray-400">
          Latest Activity
        </span>

      </div>

      <div className="space-y-6">

        <TimelineItem
          icon={<UserPlus size={18} />}
          title="Customer Created"
          time="2 Jul 2026 • 10:30 AM"
          color="bg-blue-600"
        />

        <TimelineItem
          icon={<FolderKanban size={18} />}
          title="Project Created"
          time="3 Jul 2026 • 02:10 PM"
          color="bg-green-600"
        />

        <TimelineItem
          icon={<FileText size={18} />}
          title="Invoice Generated"
          time="4 Jul 2026 • 09:15 AM"
          color="bg-yellow-600"
        />

        <TimelineItem
          icon={<CreditCard size={18} />}
          title="Payment Received"
          time="5 Jul 2026 • 11:45 AM"
          color="bg-purple-600"
        />

        <TimelineItem
          icon={<Upload size={18} />}
          title="Document Uploaded"
          time="6 Jul 2026 • 03:20 PM"
          color="bg-cyan-600"
        />

        <TimelineItem
          icon={<CheckCircle size={18} />}
          title="Project Completed"
          time="10 Jul 2026 • 06:30 PM"
          color="bg-emerald-600"
        />

      </div>

    </div>
  );
}

function TimelineItem({
  icon,
  title,
  time,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex gap-4">

      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
        {icon}
      </div>

      <div>

        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="text-sm text-gray-400">
          {time}
        </p>

      </div>

    </div>
  );
}