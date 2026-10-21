

import {
  Users,
  Scissors,
  GitBranch,
  ClipboardList,
  CalendarDays,
  Activity,
} from "lucide-react";

export const getDashboardCardsConfig = (stats) => [
  {
    title: "Total Users",
    value: stats?.totalUsers ?? 0,
    icon: Users,
  },

  {
    title: "Total Barbers",
    value: stats?.totalBarbers ?? 0,
    icon: Scissors,
  },

  {
    title: "Total Branches",
    value: stats?.totalBranches ?? 0,
    icon: GitBranch,
  },

  {
    title: "Total Services",
    value: stats?.totalServices ?? 0,
    icon: ClipboardList,
  },

  {
    title: "Total Slots",
    value: stats?.totalSlots ?? 0,
    icon: CalendarDays,
  },

  {
    title: "Today's Appointments",
    value: stats?.todayAppointments ?? 0,
    icon: CalendarDays,
  },

  {
    title: "This Month's Appointments",
    value: stats?.thisMonthAppointments ?? 0,
    icon: CalendarDays,
  },

  {
    title: "Active Appointments",
    value: stats?.activeAppointments ?? 0,
    icon: Activity,
  },
];