import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { submitReview } from "@/services/review.service";

export default function ReviewForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      await submitReview({
        fullName,
        companyName,
        email,
        review,
        rating,
      });

      navigate("/thank-you");
    } catch (error) {
      console.error(error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-28 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="rounded-3xl border border-[#4C8DFF]/20 bg-[#111827]/70 backdrop-blur-xl p-8 md:p-12">

          <div className="text-center mb-10">

            <h2 className="text-4xl font-bold">
              Leave Your Review
            </h2>

            <p className="text-gray-400 mt-4">
              Thank You.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="block mb-2 text-sm text-gray-300">
                  Full Name
                </label>

                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl bg-[#1E293B] border border-white/10 px-4 py-3 outline-none focus:border-[#4C8DFF]"
                />

              </div>

              <div>

                <label className="block mb-2 text-sm text-gray-300">
                  Company Name (Optional)
                </label>

                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ABC Technologies"
                  className="w-full rounded-xl bg-[#1E293B] border border-white/10 px-4 py-3 outline-none focus:border-[#4C8DFF]"
                />

              </div>

            </div>

            <div>

              <label className="block mb-2 text-sm text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-xl bg-[#1E293B] border border-white/10 px-4 py-3 outline-none focus:border-[#4C8DFF]"
              />

            </div>

            <div>

              <label className="block mb-3 text-sm text-gray-300">
                Your Rating
              </label>

              <StarRating
                rating={rating}
                onChange={setRating}
              />

            </div>

            <div>

              <label className="block mb-2 text-sm text-gray-300">
                Your Review
              </label>

              <textarea
                required
                rows={7}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with AiraSpark..."
                className="w-full rounded-xl bg-[#1E293B] border border-white/10 px-4 py-4 resize-none outline-none focus:border-[#4C8DFF]"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#4C8DFF] py-4 text-lg font-bold hover:bg-[#3A79E8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit for Verification"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Your review will only appear  after it has been verified
              and approved by the AiraSpark team.
            </p>

          </form>

        </div>

      </div>
    </section>
  );
}