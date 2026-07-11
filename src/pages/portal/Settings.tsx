import { useTheme } from "@/hooks/useTheme";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { SUPPORT_EMAIL } from "@/utils/constants";

export default function PortalSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/portal" },
          { label: "Settings" },
        ]}
      />
      <h1 className="text-2xl font-display font-bold text-[var(--portal-text)]">
        Settings
      </h1>

      <div className="portal-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[var(--portal-text)] mb-4">
            Appearance
          </h2>
          <div className="flex gap-3">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  theme === t
                    ? "bg-[var(--portal-accent)] text-white"
                    : "border border-[var(--portal-border)] text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                }`}
              >
                {t} Mode
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--portal-border)] pt-6">
          <h2 className="text-lg font-semibold text-[var(--portal-text)] mb-2">
            Support
          </h2>
          <p className="text-sm text-[var(--portal-muted)] mb-3">
            For assistance, reach out to our team directly.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-[var(--portal-accent)] hover:underline text-sm font-medium"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
