import { useNavigate } from "react-router-dom";

export default function Review() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#111827] rounded-2xl p-8 border border-[#4C8DFF]/20">
        <h1 className="text-4xl font-bold mb-2">Client Reviews</h1>
        <p className="text-gray-400 mb-6">We value your feedback.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/thank-you");
          }}
          className="space-y-4"
        >
          <input
            required
            placeholder="Full Name"
            className="w-full p-3 rounded bg-[#1E293B]"
          />
          <input
            required
            placeholder="Company Name"
            className="w-full p-3 rounded bg-[#1E293B]"
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-[#1E293B]"
          />
          <textarea
            required
            rows={6}
            placeholder="Your Review"
            className="w-full p-3 rounded bg-[#1E293B]"
          ></textarea>
          <button className="w-full bg-[#4C8DFF] py-3 rounded font-bold">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}