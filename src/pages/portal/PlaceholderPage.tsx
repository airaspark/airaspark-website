import { Navigate } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="portal-card p-8 text-center">
      <h1 className="text-xl font-display font-bold text-[var(--portal-text)] mb-2">
        {title}
      </h1>
      <p className="text-sm text-[var(--portal-muted)]">
        This module will be implemented in a future phase.
      </p>
    </div>
  );
}

export function PlaceholderRedirect({ to }: { to: string }) {
  return <Navigate to={to} replace />;
}
