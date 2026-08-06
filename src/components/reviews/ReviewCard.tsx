import { Star, Quote, ShieldCheck, Building2 } from "lucide-react";

interface ReviewCardProps {
  fullName: string;
  companyName?: string;
  rating: number;
  review: string;
}

export default function ReviewCard({
  fullName,
  companyName,
  rating,
  review,
}: ReviewCardProps) {
  return (
    <div className="group rounded-3xl border border-[#4C8DFF]/20 bg-[#111827]/70 backdrop-blur-xl p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#4C8DFF]/50 hover:shadow-[0_0_35px_rgba(76,141,255,0.18)]">

      <Quote
        size={34}
        className="text-[#4C8DFF] mb-5"
      />

      <div className="flex gap-1 mb-5">
        {Array.from({ length: rating }).map((_, index) => (
          <Star
            key={index}
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>

      <p className="text-gray-300 leading-7 italic mb-8">
        "{review}"
      </p>

      <div className="border-t border-white/10 pt-5">

        <h3 className="text-xl font-semibold">
          {fullName}
        </h3>

        {companyName && (
          <div className="flex items-center gap-2 text-gray-400 mt-3">
            <Building2 size={15} />
            {companyName}
          </div>
        )}

        <div className="flex items-center gap-2 text-green-400 text-sm mt-5">
          <ShieldCheck size={16} />
          Verified Customer
        </div>

      </div>

    </div>
  );
}