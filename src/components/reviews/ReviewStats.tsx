import { Globe } from "lucide-react";

export default function ReviewStats() {
  return (
    <section className="pt-32 pb-16 px-6">
      <div className="max-w-6xl mx-auto text-center">

        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#4C8DFF]/30 bg-[#4C8DFF]/10 text-[#7FB0FF]">
          <Globe size={18} />
          Trusted by Businesses Across the World
        </div>

        <h1 className="text-6xl font-black mt-8">
          Client Reviews
        </h1>

        <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-400 leading-8">
          Thank you for your precious time and for choosing AiraSpark . We value your feedback and would love to hear about your experience with our services. Your reviews help us improve and provide better solutions for our clients.
        </p>

      </div>
    </section>
  );
}