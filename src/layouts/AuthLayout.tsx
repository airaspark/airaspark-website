import { Outlet } from "react-router-dom";
import logo from "@/assets/airaspark-logo.png";

export default function AuthLayout() {
  return (
    <div className="min-h-screen portal-bg flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#07111F]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#4C8DFF]/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#2563EB]/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <img src={logo} alt="AiraSpark" className="w-16 h-16 mb-8" />
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            AiraSpark  Portal
          </h1>
          <p className="text-[#94A3B8] text-lg leading-relaxed max-w-md">
             Secure access for AiraSpark customers.
            Sign in using your assigned account to access your personalized workspace.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
