import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeSelector from "@/components/layout/ThemeSelector";
import { registerUser } from "@/services/auth.service";
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Scissors,
  Sparkles,
  User,
  ShieldCheck,
  Award,
  Clock,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedPhone.length < 10) {
      setError("Phone number must be at least 10 digits long.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        name: trimmedName,
        email: formData.email.trim().toLowerCase(),
        phone: trimmedPhone,
        password: formData.password,
      });

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#0F172B] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeSelector compact />
      </div>
      <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-[#4A6741]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full bg-[#6B8C5E]/15 blur-3xl" />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-8 lg:flex-row lg:items-center">
        {/* Left Side: NJP Feature Showcase */}
        <section
          className="w-full space-y-6 lg:w-1/2"
          aria-label="Welcome section"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex size-14 items-center justify-center rounded-[16px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/30">
              <Scissors className="size-7" />
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                BarberPro Official
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-1.5 w-5 rounded-full bg-[#4bad46]" />
                <p className="text-xs font-semibold text-[#90A1B9]">
                  Create Member Account
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1 leading-tight">
            <h1 className="text-3xl font-extrabold sm:text-4xl">Join The</h1>
            <h1 className="text-3xl font-extrabold sm:text-4xl bg-gradient-to-r from-[#8FA985] via-[#6B8C5E] to-[#4A6741] bg-clip-text text-transparent">
              Premier Salon Network
            </h1>
            <p className="pt-2 text-sm text-[#90A1B9] sm:text-base">
              Experience transparent booking, priority queue tracking, and
              verified stylist ratings.
            </p>
          </div>

          {/* 3 Stats Box */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-[14px] border border-[#485F4D]/50 bg-[#1D293D80] p-3.5 text-center transition-all hover:border-[#8FA985]">
              <Sparkles className="size-4 text-[#8FA985] mb-1" />
              <p className="text-lg font-bold text-white">Instant</p>
              <p className="text-[11px] font-medium text-[#90A1B9]">
                Confirmation
              </p>
            </div>

            <div className="flex flex-col items-center rounded-[14px] border border-[#485F4D]/50 bg-[#1D293D80] p-3.5 text-center transition-all hover:border-[#8FA985]">
              <Clock className="size-4 text-[#8FA985] mb-1" />
              <p className="text-lg font-bold text-white">Zero Wait</p>
              <p className="text-[11px] font-medium text-[#90A1B9]">
                Priority Pass
              </p>
            </div>

            <div className="flex flex-col items-center rounded-[14px] border border-[#485F4D]/50 bg-[#1D293D80] p-3.5 text-center transition-all hover:border-[#8FA985]">
              <Award className="size-4 text-[#8FA985] mb-1" />
              <p className="text-lg font-bold text-white">100%</p>
              <p className="text-[11px] font-medium text-[#90A1B9]">
                Satisfaction
              </p>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="hidden space-y-2.5 sm:block">
            <div className="flex items-center gap-3 rounded-[14px] border border-[#485F4D]/40 bg-[#1D293D80] p-3 text-xs font-semibold text-[#CAD5E2]">
              <ShieldCheck className="size-4 text-[#8FA985]" />
              <span>Safe Booking & Protected Personal Information</span>
            </div>
          </div>
        </section>

        {/* Right Side: NJP Form Card */}
        <section className="w-full lg:w-1/2">
          <div className="auth-card overflow-hidden rounded-[24px] border border-[#485F4D] bg-[#1F2C3C] shadow-2xl backdrop-blur-xl">
            {/* Top Ribbon Banner */}
            <div className="auth-ribbon flex h-16 w-full items-center justify-between bg-gradient-to-r from-[#4A6741] via-[#6B8C5E] to-[#8FA985] px-6">
              <div>
                <h2 className="text-base font-bold text-white sm:text-lg">
                  Create Account
                </h2>
                <p className="text-xs text-white/80">Register as a customer</p>
              </div>
              <Scissors className="size-5 text-white/90" />
            </div>

            <div className="p-6 sm:p-7">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                  <div className="flex items-start gap-2.5 rounded-[14px] border border-rose-500/50 bg-rose-950/30 p-3 text-xs font-medium text-rose-300 animate-in fade-in duration-200">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2.5 rounded-[14px] border border-emerald-500/50 bg-emerald-950/30 p-3 text-xs font-medium text-emerald-300 animate-in fade-in duration-200">
                    <CheckCircle2 className="size-4 shrink-0 text-[#4bad46]" />
                    <span>{success}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <Label
                    htmlFor="name"
                    className="text-xs font-semibold text-[#CAD5E2]"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Taylor"
                      className="auth-input h-10 rounded-[14px] border-[#485F4D] bg-[#172132] pl-10 text-xs text-white placeholder:text-gray-500 focus:border-[#4bad46] focus:ring-2 focus:ring-[#4bad46]/20 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label
                      htmlFor="email"
                      className="text-xs font-semibold text-[#CAD5E2]"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@example.com"
                        className="auth-input h-10 rounded-[14px] border-[#485F4D] bg-[#172132] pl-10 text-xs text-white placeholder:text-gray-500 focus:border-[#4bad46] focus:ring-2 focus:ring-[#4bad46]/20 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-semibold text-[#CAD5E2]"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="03001234567"
                        className="auth-input h-10 rounded-[14px] border-[#485F4D] bg-[#172132] pl-10 text-xs text-white placeholder:text-gray-500 focus:border-[#4bad46] focus:ring-2 focus:ring-[#4bad46]/20 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label
                      htmlFor="password"
                      className="text-xs font-semibold text-[#CAD5E2]"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="auth-input h-10 rounded-[14px] border-[#485F4D] bg-[#172132] pl-10 text-xs text-white placeholder:text-gray-500 focus:border-[#4bad46] focus:ring-2 focus:ring-[#4bad46]/20 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs font-semibold text-[#CAD5E2]"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#90A1B9]" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="h-10 rounded-[14px] border-[#485F4D] bg-[#172132] pl-10 text-xs text-white placeholder:text-gray-500 focus:border-[#4bad46] focus:ring-2 focus:ring-[#4bad46]/20 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="auth-primary mt-3 h-11 w-full rounded-[14px] bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-xs font-bold text-white shadow-lg shadow-[#4A6741]/30 transition-all hover:opacity-95 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 sm:text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating Account...
                    </span>
                  ) : (
                    "Create Customer Account"
                  )}
                </Button>
              </form>

              <div className="mt-5 border-t border-[#485F4D]/40 pt-4 text-center">
                <p className="text-xs text-[#90A1B9]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-white hover:text-[#8FA985] hover:underline"
                  >
                    Sign In →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;
