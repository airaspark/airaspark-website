import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  KeyRound,
  X,
} from "lucide-react";
import logo from "@/assets/airaspark-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/services/auth.service";
import { useToast } from "@/hooks/useToast";
import Breadcrumb, { type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import ThemeToggle from "@/components/portal/ThemeToggle";
import NotificationCenter from "@/components/portal/NotificationCenter";
import type { UserRole } from "@/types";

interface PortalLayoutProps {
  role: UserRole;
  basePath: string;
  navItems: { label: string; path: string; icon: typeof LayoutDashboard }[];
  breadcrumbs?: BreadcrumbItem[];
}

export default function PortalLayout({
  role,
  basePath,
  navItems,
  breadcrumbs = [],
}: PortalLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const accountLinks = [
    { label: "Profile", path: `${basePath}/profile`, icon: User },
    { label: "Settings", path: `${basePath}/settings`, icon: Settings },
    {
      label: "Change Password",
      path: `${basePath}/change-password`,
      icon: KeyRound,
    },
  ];

  async function handleLogout() {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  }

  const roleLabel =
    role === "admin" ? "Admin" : role === "staff" ? "Staff" : "Customer";

  return (
    <div className="min-h-screen portal-bg flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 portal-sidebar flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-[var(--portal-border)]">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="AiraSpark" className="w-9 h-9" />
            <div>
              <p className="font-display font-bold text-[var(--portal-text)] text-sm">
                AIRASPARK
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[var(--portal-muted)]">
                {roleLabel} Portal
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === `${basePath}/dashboard`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--portal-accent)]/15 text-[var(--portal-accent)] border border-[var(--portal-accent)]/25"
                    : "text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-white/5"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-[var(--portal-border)]">
            <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-[var(--portal-muted)]">
              Account
            </p>
            {accountLinks.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[var(--portal-accent)]/15 text-[var(--portal-accent)]"
                      : "text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-white/5"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-[var(--portal-border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 portal-header border-b border-[var(--portal-border)] backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              {breadcrumbs.length > 0 && (
                <Breadcrumb items={breadcrumbs} />
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <NotificationCenter />
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[var(--portal-border)]">
               {(user as any)?.profilePhoto ? (
  <img
    src={(user as any).profilePhoto}
    alt="Profile"
    className="w-8 h-8 rounded-full object-cover border border-[var(--portal-accent)]"
  />
) : (
  <div className="w-8 h-8 rounded-full bg-[var(--portal-accent)]/20 flex items-center justify-center text-[var(--portal-accent)] text-xs font-bold">
    {(user?.displayName ?? user?.email ?? "U")
      .charAt(0)
      .toUpperCase()}
  </div>
)}
                <div className="text-right">
                  <p className="text-xs font-medium text-[var(--portal-text)] truncate max-w-[120px]">
                    {user?.displayName ?? "User"}
                  </p>
                  <p className="text-[10px] text-[var(--portal-muted)]">
                    {user?.entityId ?? roleLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <button
          className="fixed top-4 right-4 z-50 lg:hidden p-2 rounded-lg bg-[var(--portal-card)] text-[var(--portal-text)]"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
