import { useEffect, useState } from "react";

import ReviewStats from "@/components/reviews/ReviewStats";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewForm from "@/components/reviews/ReviewForm";

import {
  getApprovedReviews,
  type Review,
} from "@/services/review.service";

export default function Review() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    try {
      console.log("Loading approved reviews...");

      const data = await getApprovedReviews();

      console.log("Approved Reviews:", data);

      setReviews(data);
    } catch (error) {
      console.error("Review loading failed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#08111F] text-white">
      {/* Review statistics */}
      <ReviewStats />

      {/* Submit Review - NOW AT THE TOP */}
      <section className="max-w-7xl mx-auto px-6 pt-4 pb-16">
        <ReviewForm />
      </section>

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Customer Reviews
          </h2>

          <p className="text-gray-400 mt-3 text-base sm:text-lg">
            See what our customers say about their experience with AiraSpark.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-[#4C8DFF]/20 bg-[#111827]/70 py-28 text-center">
            <h2 className="text-3xl font-bold">
              Loading Reviews...
            </h2>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-[#4C8DFF]/20 bg-[#111827]/70 py-28 text-center">
            <h2 className="text-4xl font-bold">
              No Reviews Yet
            </h2>

            <p className="text-gray-400 mt-5 text-lg">
              Be the first to share your experience with AiraSpark.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                {...review}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}