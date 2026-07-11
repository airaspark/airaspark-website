import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CustomerHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Customer Profile
        </h1>

        <p className="mt-1 text-gray-400">
          View and manage customer information and activity
        </p>
      </div>

      <button
        onClick={() => navigate("/admin/customers")}
        className="flex items-center gap-2 rounded-xl border border-gray-700 px-5 py-3 hover:bg-gray-800 transition"
      >
        <ArrowLeft size={18} />
        Back to Customers
      </button>
    </div>
  );
}