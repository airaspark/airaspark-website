import {
  File,
  Download,
  Eye,
  Upload,
} from "lucide-react";

export default function CustomerDocuments() {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold">
          Documents
        </h2>

        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 hover:bg-blue-700">

          <Upload size={16} />

          Upload

        </button>

      </div>

      <div className="space-y-4">

        <DocumentRow
          name="Proposal.pdf"
          size="2.4 MB"
        />

        <DocumentRow
          name="Agreement.pdf"
          size="4.1 MB"
        />

        <DocumentRow
          name="Requirements.docx"
          size="850 KB"
        />

      </div>

    </div>
  );
}

function DocumentRow({
  name,
  size,
}: {
  name: string;
  size: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-700 p-4">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-blue-600 p-3">

          <File size={18} />

        </div>

        <div>

          <h3 className="font-medium">
            {name}
          </h3>

          <p className="text-sm text-gray-400">
            {size}
          </p>

        </div>

      </div>

      <div className="flex gap-2">

        <button className="rounded-lg border border-gray-700 p-2 hover:bg-gray-800">

          <Eye size={18} />

        </button>

        <button className="rounded-lg border border-gray-700 p-2 hover:bg-gray-800">

          <Download size={18} />

        </button>

      </div>

    </div>
  );
}