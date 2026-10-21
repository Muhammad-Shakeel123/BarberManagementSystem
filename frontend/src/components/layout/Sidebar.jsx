import {
  LayoutDashboard,
  CalendarDays,
  CalendarClock,
  Scissors,
  UserPlus,
  Armchair,
  ListOrdered,
  CreditCard,
  Users,
  GitBranch,
  ClipboardList,
  X,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const adminNavigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    label: "New Appointment",
    icon: UserPlus,
    path: "/admin/walk-in",
  },
  {
    label: "Appointments",
    icon: CalendarDays,
    path: "/admin/appointments",
  },
  {
    label: "Waiting Queue",
    icon: ListOrdered,
    path: "/admin/queue",
  },
  {
    label: "Reschedule History",
    icon: CalendarClock,
    path: "/admin/rescheduled-appointments",
  },
  {
    label: "Barbers",
    icon: Scissors,
    path: "/admin/barbers",
  },
  {
    label: "Chairs",
    path: "/admin/chairs",
    icon: Armchair,
  },
  {
    label: "Branches",
    icon: GitBranch,
    path: "/admin/branches",
  },
  {
    label: "Services",
    icon: ClipboardList,
    path: "/admin/services",
  },
  {
    label: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Slot Overview",
    icon: CalendarDays,
    path: "/admin/slot-analytics",
  },
  {
    label: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    label: "Audit Log",
    icon: ShieldCheck,
    path: "/admin/audit-logs",
  },
];

const customerNavigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/customer/dashboard",
  },
  {
    label: "Book Appointment",
    icon: CalendarDays,
    path: "/customer/book-appointment",
  },
  {
    label: "Appointments",
    icon: ClipboardList,
    path: "/customer/appointments",
  },
  {
    label: "Payment Details",
    icon: CreditCard,
    path: "/customer/payments",
  },
  {
    label: "Rescheduled Appointments",
    icon: CalendarClock,
    path: "/customer/rescheduled-appointments",
  },
];

const barberNavigation = [
  {
    label: "My Work Today",
    icon: PlayCircle,
    path: "/barber/dashboard",
  },
];

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user } = useAuth();

  const role = user?.role?.toLowerCase();
  const navigationItems =
    role === "admin"
      ? adminNavigation
      : role === "barber"
        ? barberNavigation
        : customerNavigation;

  const isAdmin = role === "admin";
  const isBarber = role === "barber";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 shrink-0 flex-col border-r border-[#485F4D]/40 bg-[#0C1124]/95 shadow-xl backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:w-64 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Main navigation"
    >
      {/* Brand Header */}
      <div className="border-b border-[#485F4D]/30 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-md shadow-[#4A6741]/30">
            <Scissors className="size-5 transition-transform hover:rotate-12 duration-300" />
            <span className="absolute -top-1 -right-1 flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8FA985] opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-[#8FA985] ring-2 ring-[#0C1124]"></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-base font-bold tracking-tight text-white">
                BarberPro
              </h1>
            </div>

            <p className="mt-0.5 truncate text-xs font-medium text-[#90A1B9]">
              {isAdmin
                ? "Executive Workspace"
                : isBarber
                  ? "Barber Workspace"
                  : "Customer Portal"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-[#90A1B9] transition hover:bg-[#1D293D] hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="mb-2.5 flex items-center justify-between px-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#90A1B9]/70">
            {isAdmin ? "Management" : isBarber ? "My Work" : "Navigation"}
          </p>
          <span className="text-[10px] font-semibold text-[#8FA985]">
            {navigationItems.length} links
          </span>
        </div>

        <div className="space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "group relative flex w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5",
                    "text-xs sm:text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/25 border border-[#8FA985]/40"
                      : "text-[#90A1B9] hover:bg-[#1D293D80] hover:text-white active:scale-[0.98]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={[
                        "size-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                        isActive
                          ? "text-[#CAD5E2]"
                          : "text-[#90A1B9] group-hover:text-white",
                      ].join(" ")}
                    />

                    <span className="truncate">{item.label}</span>

                    {isActive && (
                      <span className="ml-auto flex size-2 items-center justify-center">
                        <span className="size-1.5 rounded-full bg-white ring-2 ring-white/40" />
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className="border-t border-[#485F4D]/30 p-3">
        <div className="sidebar-user-card flex items-center gap-3 rounded-[14px] bg-[#1D293D80] border border-[#485F4D]/50 p-2.5 transition-all hover:border-[#8FA985]/60 hover:bg-[#1D293D]">
          <div className="user-avatar relative flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-xs font-bold uppercase text-white shadow-sm ring-1 ring-white/20">
            {user?.name
              ?.split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("") || "U"}
            <span className="user-avatar-status absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[#4bad46] ring-2 ring-[#0C1124]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">
              {user?.name || "User"}
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-[#4bad46]" />
              <p className="truncate text-[11px] font-medium capitalize text-[#90A1B9]">
                {role || "Member"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
