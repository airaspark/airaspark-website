import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen portal-bg flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-8xl font-display font-bold text-[var(--portal-accent)]/30">
          404
        </p>
        <h1 className="text-2xl font-bold text-[var(--portal-text)] mt-4 mb-2">
          Page Not Found
        </h1>
        <p className="text-[var(--portal-muted)] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="portal-btn-primary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="portal-btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
