import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ThemeSelector from "@/components/layout/ThemeSelector";
import { searchAppointments } from "@/services/appointment.service";
import {
  onAppointmentCancelled,
  onAppointmentCreated,
  onAppointmentUpdated,
  onQueueUpdated,
} from "@/services/socket.service";

function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role?.toLowerCase();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "A";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const query = searchTerm.trim();

    const timeoutId = window.setTimeout(async () => {
      if (query.length < 2) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }

      try {
        setSearchLoading(true);
        const response = await searchAppointments(query);
        setSearchResults(response?.data || []);
      } catch (error) {
        console.error("Global appointment search error:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const addNotification = (type, data = {}) => {
      const notification = {
        id: `${type}-${data.timestamp || Date.now()}`,
        type,
        title:
          type === "queue"
            ? "Queue updated"
            : type === "cancelled"
              ? "Appointment cancelled"
              : type === "created"
                ? "New appointment"
                : "Appointment updated",
        message:
          type === "queue"
            ? "The waiting queue has changed."
            : type === "cancelled"
              ? "An appointment was cancelled."
              : type === "created"
                ? "A new appointment was added to your schedule."
                : data.paymentStatus === "paid"
                  ? "Payment confirmed for an appointment."
                  : "An appointment status or time changed.",
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setNotifications((current) => [notification, ...current].slice(0, 8));
    };

    const cleanups = [
      onAppointmentCreated((data) => addNotification("created", data)),
      onAppointmentUpdated((data) => addNotification("updated", data)),
      onAppointmentCancelled((data) => addNotification("cancelled", data)),
      onQueueUpdated((data) => addNotification("queue", data)),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  const openSearchResult = (appointment) => {
    setSearchTerm("");
    setIsSearchOpen(false);

    if (role === "barber") {
      navigate("/barber/dashboard");
    } else if (role === "admin") {
      navigate(
        `/admin/appointments?search=${encodeURIComponent(appointment.customerId?.name || "")}`,
      );
    } else {
      navigate("/customer/appointments");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gradient-to-r from-[#485F4D] via-[#0C1124] to-[#485F4D] bg-[#0F172B]/90 px-4 backdrop-blur-md transition-all sm:px-6 njp-border-gradient-b">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="rounded-xl p-2 text-[#90A1B9] transition hover:bg-[#1D293D] hover:text-white active:scale-95 lg:hidden"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-bold text-white sm:text-lg">
              {getGreeting()}, {user?.name?.split(" ")[0] || "User"}
            </h2>
            <span className="hidden sm:inline-block size-2 rounded-full bg-[#4bad46]" />
          </div>

          <p className="hidden truncate text-xs font-medium text-[#90A1B9] sm:block">
            BarberPro Management System • Official Portal
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search */}
        <div className="relative hidden items-center sm:flex">
          <div className="flex h-10 items-center gap-2 rounded-[12px] border border-[#485F4D]/70 bg-[#172132] px-3 shadow-inner focus-within:border-[#8FA985]">
            <Search className="size-3.5 shrink-0 text-[#8FA985]" />
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search appointments..."
              className="w-36 bg-transparent text-xs font-medium text-white outline-none placeholder:text-[#90A1B9] lg:w-52"
              aria-label="Search appointments"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-[#90A1B9] hover:text-white"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="hidden rounded bg-[#0F172B] px-1.5 py-0.5 text-[10px] font-semibold text-[#CAD5E2] border border-[#485F4D] lg:block">
                Ctrl K
              </kbd>
            )}
          </div>

          {isSearchOpen && searchTerm.trim().length >= 2 && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-2 shadow-2xl">
              {searchLoading ? (
                <p className="px-3 py-5 text-center text-xs text-[var(--text-muted)]">
                  Searching...
                </p>
              ) : searchResults.length === 0 ? (
                <p className="px-3 py-5 text-center text-xs text-[var(--text-muted)]">
                  No appointments found.
                </p>
              ) : (
                searchResults.map((appointment) => (
                  <button
                    key={appointment._id}
                    type="button"
                    onClick={() => openSearchResult(appointment)}
                    className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-[var(--bg-elevated)]"
                  >
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-[var(--accent-color)]" />
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-bold text-[var(--text-main)]">
                        {appointment.customerId?.name || "Appointment"}
                      </span>
                      <span className="mt-1 block truncate text-[11px] text-[var(--text-muted)]">
                        {appointment.serviceIds
                          ?.map((service) => service.name)
                          .join(", ") || "Service"}{" "}
                        · {new Date(appointment.startTime).toLocaleDateString()}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((open) => !open);
              setNotifications([]);
            }}
            className="group relative rounded-[12px] border border-[#485F4D]/60 bg-[#172132] p-2.5 text-[#90A1B9] transition hover:border-[#8FA985] hover:text-white active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="size-4 transition-transform group-hover:rotate-12" />
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-2 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--border-color-subtle)] px-3 py-2">
                <p className="text-xs font-bold text-[var(--text-main)]">
                  Notifications
                </p>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  aria-label="Close notifications"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              {notifications.length === 0 ? (
                <p className="px-3 py-6 text-center text-xs text-[var(--text-muted)]">
                  No new notifications.
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex gap-3 rounded-xl p-3"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] text-[var(--accent-color)]">
                      {notification.type === "queue" ? (
                        <Clock3 className="size-4" />
                      ) : notification.type === "cancelled" ? (
                        <Info className="size-4" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-main)]">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="mx-0.5 hidden h-6 w-px bg-[#485F4D]/40 sm:block" />

        {/* User Card */}
        <div className="topbar-user-card hidden items-center gap-2.5 rounded-[12px] border border-[#485F4D]/60 bg-[#1D293D80] py-1 pl-2.5 pr-1.5 sm:flex">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="text-right"
          >
            <p className="max-w-28 truncate text-xs font-bold text-white">
              {user?.name || "User"}
            </p>

            <p className="text-[10px] font-medium capitalize text-[#8FA985]">
              {user?.role || "Member"}
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="user-avatar flex size-8 items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-xs font-bold text-white shadow-xs"
            aria-label="Open profile"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              initials
            )}
          </button>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#485F4D]/70 bg-[#172132] px-3.5 py-2 text-xs font-semibold text-[#CAD5E2] transition hover:border-rose-500/50 hover:bg-rose-950/30 hover:text-rose-400 active:scale-95"
          aria-label="Logout"
        >
          <LogOut className="size-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
