import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

export default function StarRating({
  rating,
  onChange,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform duration-200 hover:scale-125"
        >
          <Star
            size={32}
            className={`transition-colors duration-200 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-500"
            }`}
          />
        </button>
      ))}
    </div>
  );
}