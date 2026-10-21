import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CircleAlert,
  Plus,
  Users as UsersIcon,
  X,
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  UserX,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  createCustomer,
  deleteUser,
  getAllUsers,
  updateUser,
} from "@/services/user.service";

import { Card, CardContent } from "@/components/ui/card";

import UserTypeCards from "@/components/users/UserTypeCards";
import UserTable from "@/components/users/UserTable";

function Users() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeType, setActiveType] = useState(
    searchParams.get("type") === "barber" ? "barber" : "customer",
  );

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAllUsers();

      setUsers(response.data || []);
    } catch (err) {
      console.error("Users error:", err);

      setError(err?.response?.data?.message || "Unable to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const customers = users.filter((user) => user.role === "customer");
  const barbers = users.filter((user) => user.role === "barber");

  const displayedUsers = activeType === "customer" ? customers : barbers;

  const activeCustomers = customers.filter((user) => user.isActive).length;
  const activeBarbers = barbers.filter((user) => user.isActive).length;

  const closeModal = () => {
    if (isSubmitting) return;

    setSelectedUser(null);
    setModalType(null);
    setActionError("");
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setActionError("");
    setModalType("view");
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setActionError("");
    setModalType("edit");
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`,
    );

    if (!confirmed) return;

    try {
      setActionError("");

      await deleteUser(user._id);

      setUsers((currentUsers) =>
        currentUsers.filter((item) => item._id !== user._id),
      );
    } catch (err) {
      console.error("Delete user error:", err);

      setActionError(err?.response?.data?.message || "Unable to delete user.");
    }
  };

  const handleSaveUser = async (formData) => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      setActionError("");

      const response = await updateUser(selectedUser._id, formData);

      const updatedUser = response.data;

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === selectedUser._id ? updatedUser : user,
        ),
      );

      closeModal();
    } catch (err) {
      console.error("Update user error:", err);

      setActionError(err?.response?.data?.message || "Unable to update user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCustomer = async (formData) => {
    try {
      setIsSubmitting(true);
      setActionError("");

      const response = await createCustomer(formData);

      const newCustomer = response.data;

      setUsers((currentUsers) => [...currentUsers, newCustomer]);

      setActiveType("customer");
      closeModal();
    } catch (err) {
      console.error("Create customer error:", err);

      setActionError(
        err?.response?.data?.message || "Unable to create customer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
           <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="
              mb-6 inline-flex items-center gap-2
              rounded-xl
              border border-[#485F4D]/70
              bg-[#172132]
              px-3.5 py-2
              text-xs font-bold
              text-[#CAD5E2]
              shadow-sm
              transition-all duration-200
              hover:border-[#8FA985]
              hover:bg-[#202F43]
              hover:text-white
              active:scale-[0.97]
            "
        >
          <ArrowLeft className="size-3.5" />
          Back to Dashboard
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] shadow-lg shadow-[#4A6741]/20">
              <UsersIcon className="size-7 text-white" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  User Management
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D] bg-[#172132] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#8FA985]">
                  <span className="size-1.5 rounded-full bg-[#4bad46]" />
                  {users.length} Users
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-[#90A1B9] sm:text-sm">
                Manage registered customer profiles and barber accounts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedUser(null);
              setActionError("");
              setModalType("create");
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] px-5 text-sm font-bold text-white shadow-lg shadow-[#4A6741]/20 transition hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="size-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Users"
          value={users.length}
          description="All registered accounts"
          icon={UsersIcon}
        />

        <SummaryCard
          label="Customers"
          value={customers.length}
          description={`${activeCustomers} currently active`}
          icon={UserRound}
          accent
        />

        <SummaryCard
          label="Barbers"
          value={barbers.length}
          description={`${activeBarbers} currently active`}
          icon={ShieldCheck}
        />

        <SummaryCard
          label="Active Accounts"
          value={users.filter((user) => user.isActive).length}
          description="Currently operational"
          icon={CheckCircle2}
          accent
        />
      </div>

      {/* User Type */}
      <UserTypeCards
        customers={customers.length}
        barbers={barbers.length}
        activeType={activeType}
        onSelect={setActiveType}
      />

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Error */}
      {actionError && !modalType && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex min-h-56 items-center justify-center rounded-3xl border border-[#485F4D]/50 bg-[#1D293D80]">
          <div className="text-center">
            <div className="mx-auto size-8 animate-spin rounded-full border-2 border-[#485F4D] border-t-[#8FA985]" />

            <p className="mt-4 text-sm font-medium text-[#90A1B9]">
              Loading users...
            </p>
          </div>
        </div>
      ) : error ? (
        <Card className="border-[#485F4D]/50 bg-[#1D293D80] text-white shadow-none">
          <CardContent className="p-10 text-center">
            <CircleAlert className="mx-auto mb-3 size-9 text-[#90A1B9]" />

            <p className="text-sm font-semibold text-[#CAD5E2]">
              Unable to load users.
            </p>

            <button
              type="button"
              onClick={loadUsers}
              className="mt-5 rounded-xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      ) : (
        <UserTable
          users={displayedUsers}
          type={activeType}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      )}

      {/* Modal */}
      {modalType && (
        <UserModal
          type={modalType}
          user={selectedUser}
          isSubmitting={isSubmitting}
          error={actionError}
          onClose={closeModal}
          onSave={modalType === "edit" ? handleSaveUser : null}
          onCreate={modalType === "create" ? handleCreateCustomer : null}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  accent = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        accent
          ? "border-[#485F4D] bg-[#1D293D80]"
          : "border-[#485F4D]/50 bg-[#1D293D80]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#90A1B9]">
            {label}
          </p>

          <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1.5 text-xs font-medium text-[#90A1B9]/70">
            {description}
          </p>
        </div>

        <div
          className={`flex size-11 items-center justify-center rounded-xl border ${
            accent
              ? "border-[#485F4D] bg-[#172132]"
              : "border-[#485F4D]/50 bg-[#172132]"
          }`}
        >
          <Icon
            className={`size-5 ${
              accent ? "text-[#8FA985]" : "text-[#90A1B9]"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

function UserModal({
  type,
  user,
  isSubmitting,
  error,
  onClose,
  onSave,
  onCreate,
}) {
  const isView = type === "view";
  const isEdit = type === "edit";
  const isCreate = type === "create";

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    isActive: user?.isActive !== false,
    password: "",
  });

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isCreate) {
      await onCreate({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      return;
    }

    await onSave({
      name: form.name,
      email: form.email,
      phone: form.phone,
      isActive: form.isActive,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060d18]/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#485F4D] bg-[#1E2B3B] shadow-2xl shadow-black/40"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#485F4D]/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E]">
              {isView ? (
                <UserRound className="size-5 text-white" />
              ) : isEdit ? (
                <UserRound className="size-5 text-white" />
              ) : (
                <Plus className="size-5 text-white" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                {isView
                  ? "User Details"
                  : isEdit
                    ? "Edit User"
                    : "Create Customer"}
              </h2>

              <p className="mt-0.5 text-xs text-[#90A1B9]">
                {isView
                  ? "View account information."
                  : isEdit
                    ? "Update the user's account information."
                    : "Create a new customer account."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex size-9 items-center justify-center rounded-xl text-[#90A1B9] transition hover:bg-[#172132] hover:text-white disabled:opacity-40"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* View */}
        {isView ? (
          <div className="space-y-3 p-6">
            <InfoRow
              icon={UserRound}
              label="Name"
              value={user?.name}
            />

            <InfoRow
              icon={Mail}
              label="Email"
              value={user?.email}
            />

            <InfoRow
              icon={Phone}
              label="Phone"
              value={user?.phone || "-"}
            />

            <InfoRow
              icon={ShieldCheck}
              label="Role"
              value={
                user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "-"
              }
            />

            <InfoRow
              icon={user?.isActive ? CheckCircle2 : UserX}
              label="Status"
              value={user?.isActive ? "Active" : "Inactive"}
              valueClass={
                user?.isActive ? "text-[#8FA985]" : "text-rose-400"
              }
            />

            <InfoRow
              icon={CalendarDays}
              label="Created"
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-PK")
                  : "-"
              }
            />

            <div className="flex justify-end border-t border-[#485F4D]/40 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 p-6">
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-sm text-rose-300">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {error}
                </div>
              )}

              <DarkInput
                label="Name"
                value={form.name}
                onChange={(value) => updateField("name", value)}
                required
                disabled={isSubmitting}
              />

              <DarkInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => updateField("email", value)}
                required
                disabled={isSubmitting}
              />

              <DarkInput
                label="Phone"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                disabled={isSubmitting}
              />

              {isCreate && (
                <DarkInput
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(value) => updateField("password", value)}
                  required
                  minLength={6}
                  disabled={isSubmitting}
                />
              )}

              {isEdit && (
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#485F4D]/60 bg-[#172132] p-4 transition hover:border-[#8FA985]">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      updateField("isActive", event.target.checked)
                    }
                    disabled={isSubmitting}
                    className="size-4 rounded border-[#485F4D] bg-[#172132] accent-[#4bad46]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Active account
                    </p>

                    <p className="mt-0.5 text-xs text-[#90A1B9]">
                      Allow this user to access the system.
                    </p>
                  </div>
                </label>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#485F4D]/40 bg-[#172132] px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-[#485F4D]/70 bg-[#1D293D80] px-4 py-2.5 text-sm font-semibold text-[#CAD5E2] transition hover:bg-[#1D293D] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-w-32 items-center justify-center rounded-xl border border-[#485F4D] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : isCreate
                    ? "Create Customer"
                    : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function DarkInput({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  minLength,
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#90A1B9]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        minLength={minLength}
        disabled={disabled}
        className="h-11 w-full rounded-xl border border-[#485F4D]/60 bg-[#172132] px-3.5 text-sm font-medium text-white outline-none transition placeholder:text-[#90A1B9]/60 focus:border-[#8FA985] focus:ring-2 focus:ring-[#485F4D]/20 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass = "text-white",
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#485F4D]/50 bg-[#172132] px-4 py-3.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1D293D]">
        <Icon className="size-4 text-[#90A1B9]" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]/70">
          {label}
        </p>

        <p className={`mt-0.5 truncate text-sm font-semibold ${valueClass}`}>
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default Users;