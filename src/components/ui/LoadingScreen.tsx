import logo from "@/assets/airaspark-logo.png";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  message = "Loading...",
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 ${
        fullScreen ? "min-h-screen bg-[#0B1220]" : "py-16"
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-[#4C8DFF]/20 blur-2xl rounded-full animate-pulse" />
        <img
          src={logo}
          alt="AiraSpark"
          className="relative w-16 h-16 object-contain animate-pulse"
        />
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#4C8DFF] animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <p className="text-[#AAB7C4] text-sm font-medium tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
}
