import {
  Eye,
  Mail,
  Pencil,
  Phone,
  Trash2,
  UserRound,
  Users,
  Scissors,
  CalendarDays,
  CircleCheck,
  CircleX,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

function UserTable({
  users,
  type,
  onView,
  onEdit,
  onDelete,
}) {
  const title = type === "customer" ? "Customers" : "Barbers";
  const Icon = type === "customer" ? Users : Scissors;

  const activeCount = users.filter((user) => user.isActive).length;

  if (!users.length) {
    return (
      <Card className="border-[#2d4053] bg-[#1b2a3a] text-white shadow-none">
        <CardContent className="p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#354a60] bg-[#22364a]">
            <Icon className="size-6 text-[#8ba2b8]" />
          </div>

          <h3 className="mt-4 font-bold text-white">
            No {title.toLowerCase()} found
          </h3>

          <p className="mt-1 text-sm text-[#71879c]">
            There are no registered {title.toLowerCase()} yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-[#2d4053] bg-[#1b2a3a] text-white shadow-none">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#2d4053] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-[#354a60] bg-[#22364a]">
              <Icon className="size-5 text-[#93a9bd]" />
            </div>

            <div>
              <h2 className="font-bold text-white">{title}</h2>

              <p className="mt-0.5 text-xs text-[#6f879d]">
                Manage registered {title.toLowerCase()} accounts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusSummary
              label="Total"
              value={users.length}
            />

            <StatusSummary
              label="Active"
              value={activeCount}
              active
            />
          </div>
        </div>

        {/* Column Header */}
        <div className="hidden border-b border-[#2a3e52] bg-[#172738] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#70879c] lg:grid lg:grid-cols-[minmax(0,1fr)_180px_130px] lg:items-center">
          <span>User</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Users */}
        <div className="divide-y divide-[#293d51]">
          {users.map((user) => (
            <div
              key={user._id}
              className="group flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-[#1e3042] lg:grid lg:grid-cols-[minmax(0,1fr)_180px_130px] lg:items-center"
            >
              {/* User Info */}
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#3a5065] bg-[#24384c]">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound className="size-5 text-[#8da3b8]" />
                  )}

                  <span
                    className={`absolute bottom-0.5 right-0.5 size-2.5 rounded-full border-2 border-[#24384c] ${
                      user.isActive
                        ? "bg-[#72c84b]"
                        : "bg-[#68798a]"
                    }`}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-white">
                      {user.name}
                    </p>

                    {user.role && (
                      <span className="hidden rounded-full border border-[#354a60] bg-[#22364a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#8197ac] sm:inline-flex">
                        {user.role}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-col gap-1 text-xs text-[#70879c] sm:flex-row sm:gap-4">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Mail className="size-3 shrink-0" />

                      <span className="truncate">
                        {user.email}
                      </span>
                    </span>

                    {user.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-3 shrink-0" />
                        {user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between lg:justify-start">
                <div className="flex items-center gap-2">
                  {user.isActive ? (
                    <CircleCheck className="size-4 text-[#72c84b]" />
                  ) : (
                    <CircleX className="size-4 text-[#8795a3]" />
                  )}

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                      user.isActive
                        ? "border-[#527546] bg-[#304536] text-[#9bc183]"
                        : "border-[#465668] bg-[#293847] text-[#8999a8]"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <span className="flex items-center gap-1.5 text-[11px] text-[#61798f] lg:hidden">
                  <CalendarDays className="size-3" />

                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-[#293d51] pt-3 lg:justify-end lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                <span className="hidden text-[11px] text-[#61798f] lg:flex lg:items-center lg:gap-1.5">
                  <CalendarDays className="size-3" />

                  {new Date(user.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <ActionButton
                    icon={Eye}
                    label={`View ${user.name}`}
                    onClick={() => onView?.(user)}
                  />

                  <ActionButton
                    icon={Pencil}
                    label={`Edit ${user.name}`}
                    onClick={() => onEdit?.(user)}
                  />

                  <ActionButton
                    icon={Trash2}
                    label={`Delete ${user.name}`}
                    danger
                    onClick={() => onDelete?.(user)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-[#2d4053] bg-[#172738] px-5 py-3">
          <p className="text-xs font-medium text-[#668097]">
            Showing{" "}
            <span className="font-bold text-[#9bb0c4]">
              {users.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#9bb0c4]">
              {users.length}
            </span>{" "}
            {title.toLowerCase()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusSummary({
  label,
  value,
  active = false,
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#33495e] bg-[#1d3043] px-3 py-1.5">
      {active && (
        <span className="size-1.5 rounded-full bg-[#72c84b]" />
      )}

      <span className="text-[10px] font-bold uppercase tracking-wide text-[#71889d]">
        {label}
      </span>

      <span className="text-xs font-extrabold text-white">
        {value}
      </span>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  danger = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex size-9 items-center justify-center rounded-lg border transition ${
        danger
          ? "border-transparent text-[#8193a4] hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-400"
          : "border-transparent text-[#8193a4] hover:border-[#3b5267] hover:bg-[#263b4f] hover:text-white"
      }`}
    >
      <Icon className="size-4" />
    </button>
  );
}

export default UserTable;