import { useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  Trash2,
  Save,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  changeMyPassword,
  updateMe,
  uploadMyAvatar,
  removeMyAvatar,
} from "@/services/user.service";

function Profile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const showResult = (nextMessage = "") => {
    setMessage(nextMessage);
    setError("");
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError("");
      const response = await updateMe({
        name: form.name.trim(),
        phone: form.phone.trim(),
      });
      updateUser(response.data);
      showResult("Profile details saved.");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to save profile details.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError("");
      const response = await uploadMyAvatar(file);
      updateUser(response.data);
      showResult("Profile picture updated.");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to upload profile picture.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsRemovingAvatar(true);
      setError("");
      const response = await removeMyAvatar();
      updateUser(response.data);
      showResult("Profile picture removed.");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to remove profile picture.",
      );
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setIsChangingPassword(true);
      setError("");
      await changeMyPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showResult("Password updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-white">
      <section className="rounded-3xl border border-[#485F4D] bg-[#1E2B3B] p-6 shadow-xl sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--accent-color)]">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-10" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isRemovingAvatar}
                className="flex size-10 items-center justify-center rounded-xl border border-[var(--btn-border)] bg-[var(--btn-gradient-from)] text-[var(--btn-text)] shadow-lg disabled:opacity-60"
                aria-label="Upload profile picture"
              >
                {isUploading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Camera className="size-4" />
                )}
              </button>
              {user?.profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading || isRemovingAvatar}
                  className="flex size-10 items-center justify-center rounded-xl border border-rose-500/40 bg-rose-950/80 text-rose-200 shadow-lg disabled:opacity-60"
                  aria-label="Remove profile picture"
                >
                  {isRemovingAvatar ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-color)]">
              Account settings
            </p>
            <h1 className="mt-1 text-3xl font-black">Your Profile</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Update your name, phone number, profile picture, and password.
            </p>
            <p className="mt-2 text-xs font-semibold capitalize text-[var(--text-subtle)]">
              {user?.role || "Member"} account · {user?.email}
            </p>
          </div>
        </div>
      </section>

      {message && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-sm text-emerald-200">
          <CheckCircle2 className="size-4" />
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleProfileSave}
          className="space-y-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-xl"
        >
          <div>
            <h2 className="text-lg font-bold">Personal details</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Keep your contact details up to date.
            </p>
          </div>
          <label className="block text-sm font-semibold text-[var(--text-subtle)]">
            Full name
            <input
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className="mt-2 h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-[var(--text-subtle)]">
            Email
            <input
              value={user?.email || ""}
              readOnly
              className="mt-2 h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] px-3 text-sm text-[var(--text-muted)] outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-[var(--text-subtle)]">
            Phone number
            <input
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              className="mt-2 h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
              required
            />
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[var(--btn-gradient-from)] to-[var(--btn-gradient-to)] px-5 text-sm font-bold text-[var(--btn-text)] disabled:opacity-60"
          >
            <Save className="size-4" />
            {isSaving ? "Saving..." : "Save details"}
          </button>
        </form>

        <form
          onSubmit={handlePasswordChange}
          className="space-y-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-xl"
        >
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <KeyRound className="size-5 text-[var(--accent-color)]" />
              Change password
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Use your current password to create a new one.
            </p>
          </div>
          {[
            ["currentPassword", "Current password"],
            ["newPassword", "New password"],
            ["confirmPassword", "Confirm new password"],
          ].map(([field, label]) => (
            <label
              key={field}
              className="block text-sm font-semibold text-[var(--text-subtle)]"
            >
              {label}
              <input
                type="password"
                value={passwordForm[field]}
                onChange={(event) =>
                  setPasswordForm({
                    ...passwordForm,
                    [field]: event.target.value,
                  })
                }
                className="mt-2 h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                minLength={6}
                required
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={isChangingPassword}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] px-5 text-sm font-bold text-[var(--text-subtle)] hover:border-[var(--accent-color)] disabled:opacity-60"
          >
            {isChangingPassword ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
