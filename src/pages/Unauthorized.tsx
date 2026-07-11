import { Link } from "react-router-dom";
import { ShieldX, Home, LogIn } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen portal-bg flex items-center justify-center p-6">
      <div className="text-center max-w-md portal-card p-8">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--portal-text)] mb-2">
          Unauthorized Access
        </h1>
        <p className="text-[var(--portal-muted)] mb-8">
          You don&apos;t have permission to view this page. If you believe this
          is an error, contact{" "}
          <a
            href="mailto:contact@airaspark.com"
            className="text-[var(--portal-accent)]"
          >
            contact@airaspark.com
          </a>
          .
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/portal" className="portal-btn-primary">
            <LogIn className="w-4 h-4" />
            My Dashboard
          </Link>
          <Link to="/" className="portal-btn-secondary">
            <Home className="w-4 h-4" />
            Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
