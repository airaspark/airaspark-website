import { useEffect, useState } from "react";
import {
  approveReview,
  deleteReview,
  getPendingReviews,
  rejectReview,
  type Review,
} from "@/services/review.service";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    try {
      setLoading(true);

      const data = await getPendingReviews();

      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function handleApprove(id: string) {
    try {
      await approveReview(id, "admin");
      loadReviews();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleReject(id: string) {
    try {
      await rejectReview(id);
      loadReviews();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this review?")) return;

    try {
      await deleteReview(id);
      loadReviews();
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading Reviews...
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Pending Reviews
      </h1>

      {reviews.length === 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-700 p-10 text-center">

          <h2 className="text-2xl font-semibold">
            No Pending Reviews
          </h2>

          <p className="text-slate-400 mt-2">
            Every submitted review has already been processed.
          </p>

        </div>
      )}

      <div className="space-y-6">

        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
          >
            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-xl font-semibold">
                  {review.fullName}
                </h2>

                <p className="text-slate-400">
                  {review.companyName}
                </p>

                <p className="text-slate-400">
                  {review.email}
                </p>

              </div>

              <div className="text-yellow-400 text-lg">
                {"⭐".repeat(review.rating)}
              </div>

            </div>

            <p className="mt-6 whitespace-pre-wrap">
              {review.review}
            </p>

            <div className="flex gap-3 mt-8">

              <button
                onClick={() => handleApprove(review.id!)}
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(review.id!)}
                className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg"
              >
                Reject
              </button>

              <button
                onClick={() => handleDelete(review.id!)}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}