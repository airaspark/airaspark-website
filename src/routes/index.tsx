import { Routes, Route, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  CreditCard,
  Milestone,
  Files,
  FileCheck,
  ScrollText,
  Receipt,
  Award,
  Star,
} from "lucide-react";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PortalLayout from "@/layouts/PortalLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Customers from "@/pages/admin/Customers";
import CustomerProfile from "@/pages/admin/CustomerProfile";
import Projects from "@/pages/admin/Projects";
import AdminInvoices from "@/pages/admin/Invoices";

import Home from "@/pages/Home";
import Review from "@/pages/Review";
import Payment from "@/pages/Payment";
import ThankYou from "@/pages/ThankYou";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import LinkCustomerAccount from "@/pages/auth/LinkCustomerAccount";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import RoleRedirect from "@/routes/RoleRedirect";

import CustomerDashboard from "@/pages/customer/Dashboard";
import StaffDashboard from "@/pages/staff/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import PortalProfile from "@/pages/portal/Profile";
import PortalSettings from "@/pages/portal/Settings";
import ChangePassword from "@/pages/portal/ChangePassword";
import PlaceholderPage from "@/pages/portal/PlaceholderPage";
import ProjectDetails from "@/pages/admin/ProjectDetails";
import Staff from "@/pages/admin/Staff";
import CompleteProfile from "@/pages/staff/CompleteProfile";
import CompleteProfileForm from "@/components/staff/CompleteProfileForm";
import DailyReports from "@/pages/staff/DailyReports";
import AdminDailyReports from "@/pages/admin/DailyReports";
import CustomerProjects from "@/pages/customer/Projects";
import CustomerPayments from "@/pages/customer/Payments";
import AdminPayments from "@/pages/admin/Payments";
import Receipts from "@/pages/customer/Receipts";
import AdminReceipts from "@/pages/admin/Receipts";
import StaffPayments from "@/pages/staff/Payments";
import StaffReceipts from "@/pages/staff/Receipts";
import CustomerInvoices from "@/pages/customer/Invoices";
import StaffInvoices from "@/pages/staff/Invoices";
import StaffCustomers from "@/pages/staff/Customers";

const customerNav = [
  { label: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
  { label: "Projects", path: "/customer/projects", icon: FolderKanban },
  { label: "Invoices", path: "/customer/invoices", icon: FileText },
  { label: "Payments", path: "/customer/payments", icon: CreditCard },
  { label: "Agreements", path: "/customer/agreements", icon: FileCheck },
  { label: "Receipts", path: "/customer/receipts", icon: Receipt },
];

const staffNav = [
  { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
  { label: "Customers", path: "/staff/customers", icon: FolderKanban },
  { label: "Projects", path: "/staff/projects", icon: FolderKanban },
  {
  label: "Payments",
  path: "/staff/payments",
  icon: CreditCard,
},


 { label: "Receipts", path: "/staff/receipts", icon: Receipt },
  { label: "Daily Reports", path: "/staff/daily-reports", icon: FileText },
  
  
  { label: "Invoices", path: "/staff/invoices", icon: FileText },
];

const adminNav = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },

  { label: "Customers", path: "/admin/customers", icon: FolderKanban },

  { label: "Staff", path: "/admin/staff", icon: FolderKanban },

  {
    label: "Daily Reports",
    path: "/admin/daily-reports",
    icon: FileText,
  },

  { label: "Projects", path: "/admin/projects", icon: FolderKanban },

  { label: "Payments", path: "/admin/payments", icon: CreditCard },

  { label: "Receipts", path: "/admin/receipts", icon: Receipt },

  { label: "Invoices", path: "/admin/invoices", icon: FileText },

  { label: "Reviews", path: "/admin/reviews", icon: Star },

  { label: "Documents", path: "/admin/documents", icon: Files },

  { label: "Analytics", path: "/admin/analytics", icon: LayoutDashboard },

  { label: "Activity Logs", path: "/admin/activity", icon: Milestone },

  { label: "Settings", path: "/admin/global-settings", icon: FileCheck },
];

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public website — preserved unchanged */}
      <Route path="/" element={<Home />} />
      <Route path="/review" element={<Review />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/thank-you" element={<ThankYou />} />

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/link-account"
          element={
            <ProtectedRoute requireLinked={false}>
              <LinkCustomerAccount />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Role redirect hub */}
      <Route path="/portal" element={<RoleRedirect />} />

      {/* Customer portal */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <PortalLayout
              role="customer"
              basePath="/customer"
              navItems={customerNav}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
      
       <Route path="projects" element={<CustomerProjects />} />

        <Route
  path="invoices"
  element={<CustomerInvoices />}
/>
        <Route path="payments" element={<CustomerPayments />} />
       
        <Route path="documents" element={<PlaceholderPage title="Documents" />} />
        
        <Route path="agreements" element={<PlaceholderPage title="Agreements" />} />
        <Route path="receipts" element={<Receipts />} />
        <Route path="profile" element={<PortalProfile />} />
        <Route path="settings" element={<PortalSettings />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      {/* Staff portal */}
      <Route

  path="/staff/complete-profile"

  element={<CompleteProfileForm />}

/>

<Route

  path="/staff"

  element={

    <ProtectedRoute allowedRoles={["staff"]}>

      <PortalLayout

        role="staff"

        basePath="/staff"

        navItems={staffNav}

      />

    </ProtectedRoute>

  }

>

    <Route index element={<Navigate to="dashboard" replace />} />

    <Route path="dashboard" element={<StaffDashboard />} />
    <Route path="daily-reports" element={<DailyReports />} />
        <Route
  path="customers"
  element={<StaffCustomers />}
/>
        <Route path="projects" element={<Projects />} />
        <Route
  path="projects/:id"
  element={<ProjectDetails />}
/>
        <Route path="milestones" element={<PlaceholderPage title="Milestones" />} />
        <Route path="payments" element={<StaffPayments />} />
<Route path="receipts" element={<StaffReceipts />} />
        <Route path="documents" element={<PlaceholderPage title="Documents" />} />
        <Route path="invoices" element={<StaffInvoices />} />
        <Route path="profile" element={<PortalProfile />} />
        <Route path="settings" element={<PortalSettings />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      {/* Admin portal */}
    <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PortalLayout
        role="admin"
        basePath="/admin"
        navItems={adminNav}
      />
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="dashboard" replace />} />

  <Route path="dashboard" element={<AdminDashboard />} />

  <Route path="customers" element={<Customers />} />
  <Route path="customers/:id" element={<CustomerProfile />} />
  <Route path="staff" element={<Staff />} />
  <Route

  path="daily-reports"

  element={<AdminDailyReports />}

/>
  <Route
  path="complete-profile"
  element={<CompleteProfile />}
/>
  <Route path="projects" element={<Projects />} />
  <Route
  path="projects/:id"
  element={<ProjectDetails />}
/>
  <Route path="payments" element={<AdminPayments />} />
  <Route path="receipts" element={<AdminReceipts />} />
  <Route path="invoices" element={<AdminInvoices />} />
  <Route path="reviews" element={<PlaceholderPage title="Reviews" />} />
  <Route path="documents" element={<PlaceholderPage title="Documents" />} />
  <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
  <Route path="activity" element={<PlaceholderPage title="Activity Logs" />} />
  <Route path="global-settings" element={<PlaceholderPage title="Global Settings" />} />
  <Route path="profile" element={<PortalProfile />} />
  <Route path="settings" element={<PortalSettings />} />
  <Route path="change-password" element={<ChangePassword />} />
</Route>

      {/* Error pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
