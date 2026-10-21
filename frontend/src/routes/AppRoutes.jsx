import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Unauthorized from "@/pages/public/Unauthorized";
import Home from "@/pages/public/Home";

import DashboardLayout from "@/layouts/DashboardLayout";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import SlotAnalytics from "@/pages/admin/SlotAnalytics";
import Users from "@/pages/admin/Users";
import Branches from "@/pages/admin/Branches";
import BranchDetails from "@/pages/admin/BranchDetails";
import Services from "@/pages/admin/Services";
import Appointments from "@/pages/admin/Appointments";
import RescheduledAppointments from "@/pages/admin/RescheduledAppointments";
import Barbers from "@/pages/admin/Barbers";
import WalkInAppointment from "@/pages/admin/WalkInAppointment";
import BookAppointment from "@/pages/customer/BookAppointment";
import Chairs from "../pages/admin/Chairs";
import Queue from "@/pages/admin/Queue";
import Payments from "@/pages/admin/Payments";
import AuditLogs from "@/pages/admin/AuditLogs";

// customer
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import CustomerPayments from "@/pages/customer/Payments";
import CustomerAppointments from "@/pages/customer/Appointments";
import CustomerRescheduledAppointments from "@/pages/customer/RescheduledAppointments";
import BarberDashboard from "@/pages/barber/BarberDashboard";
import Profile from "@/pages/Profile";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<Profile />} />
            {/* ADMIN */}
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              <Route path="/admin/users" element={<Users />} />

              <Route path="/admin/slot-analytics" element={<SlotAnalytics />} />

              <Route path="/admin/branches" element={<Branches />} />

              <Route
                path="/admin/branches/:branchId"
                element={<BranchDetails />}
              />

              <Route path="/admin/services" element={<Services />} />

              <Route path="/admin/appointments" element={<Appointments />} />

              <Route path="/admin/walk-in" element={<WalkInAppointment />} />
              <Route path="/admin/queue" element={<Queue />} />

              <Route
                path="/admin/rescheduled-appointments"
                element={<RescheduledAppointments />}
              />

              <Route path="/admin/barbers" element={<Barbers />} />
              <Route path="/admin/chairs" element={<Chairs />} />
              <Route path="/admin/payments" element={<Payments />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
            </Route>

            {/* customer */}
            <Route element={<RoleRoute allowedRoles={["customer"]} />}>
              <Route
                path="/customer/dashboard"
                element={<CustomerDashboard />}
              />

              <Route
                path="/customer/book-appointment"
                element={<BookAppointment />}
              />

              <Route
                path="/customer/rescheduled-appointments"
                element={<CustomerRescheduledAppointments />}
              />

              <Route path="/customer/payments" element={<CustomerPayments />} />
              <Route
                path="/customer/appointments"
                element={<CustomerAppointments />}
              />
            </Route>

            {/* BARBER */}
            <Route element={<RoleRoute allowedRoles={["barber"]} />}>
              <Route path="/barber/dashboard" element={<BarberDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
