import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        to={items[0]?.href ?? "/"}
        className="text-[var(--portal-muted)] hover:text-[var(--portal-accent)] transition-colors flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-[var(--portal-muted)]" />
          {item.href && index < items.length - 1 ? (
            <Link
              to={item.href}
              className="text-[var(--portal-muted)] hover:text-[var(--portal-accent)] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--portal-text)] font-medium">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
