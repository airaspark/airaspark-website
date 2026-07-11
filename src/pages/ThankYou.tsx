import { CheckCircle, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center px-6 py-20 overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#4C8DFF]/10 blur-[180px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-2xl">

        <div className="bg-[#111827] border border-[#4C8DFF]/20 rounded-3xl p-10 shadow-2xl text-center">

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-[#4C8DFF]/15 flex items-center justify-center border border-[#4C8DFF]/30">
              <CheckCircle
                size={60}
                className="text-[#4C8DFF]"
              />
            </div>
          </div>

          {/* Heading */}

          <h1 className="text-5xl font-black mb-4">
            Thank You!
          </h1>

          <p className="text-xl text-gray-300 mb-2">
            Your review has been submitted successfully.
          </p>

          <p className="text-gray-500 mb-10">
            We appreciate your valuable feedback.
            <br />
            Your opinion helps us build better products and services.
          </p>

          {/* Information Card */}

          <div className="bg-[#0F172A] rounded-2xl border border-[#4C8DFF]/10 p-6 mb-10">

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">
                Status
              </span>

              <span className="text-green-400 font-semibold">
                Successfully Submitted
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">
                Review Visibility
              </span>

              <span className="text-white">
                Pending Approval
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gray-400">
                Team
              </span>

              <span className="text-[#4C8DFF]">
                AiraSpark Technologies
              </span>
            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-col md:flex-row gap-5">

            <button
              onClick={() => navigate("/")}
              className="flex-1 flex items-center justify-center gap-2 bg-[#4C8DFF] hover:bg-[#3A7DF7] transition-all duration-300 rounded-xl py-4 font-bold text-lg"
            >
              <Home size={22} />
              Return Home
            </button>

            <button
              onClick={() => navigate("/review")}
              className="flex-1 flex items-center justify-center gap-2 border border-[#4C8DFF]/30 hover:border-[#4C8DFF] hover:bg-[#4C8DFF]/10 transition-all duration-300 rounded-xl py-4 font-bold text-lg"
            >
              <ArrowLeft size={22} />
              Write Another
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}