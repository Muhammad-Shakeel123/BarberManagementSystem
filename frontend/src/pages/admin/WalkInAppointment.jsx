import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAppointmentBooking from "@/hooks/useAppointmentBooking";

import WalkInAppointmentForm from "@/components/walkin/WalkInAppointmentForm";
import SelectedAppointment from "@/components/walkin/SelectedAppointment";
import AvailableSlots from "@/components/walkin/AvailableSlots";
import RegisterCustomerModal from "@/components/walkin/RegisterCustomerModal";
import StripePaymentModal from "@/components/payment/StripePaymentModal";

function WalkInAppointment() {
  const navigate = useNavigate();

  const {
    customers,
    branches,
    branchBarbers,
    barberServices,

    customerId,
    setCustomerId,
    branchId,
    barberId,
    setBarberId,
    serviceId,
    setServiceId,
    date,

    setDate,
    handleBranchChange,

    slots,
    selectedSlot,
    setSelectedSlot,

    loadingData,
    loadingSlots,
    booking,
    creatingCustomer,

    showCustomerModal,
    setShowCustomerModal,

    paymentOpen,
    paymentClientSecret,
    paymentAmount,

    customerForm,
    setCustomerForm,

    error,
    success,

    selectedCustomer,
    selectedBranch,
    selectedBarber,
    selectedService,

    handleCreateCustomer,
    handleCheckAvailability,
    handleAddToQueue,
    handleBookAppointment,

    handlePaymentSuccess,
    handlePaymentClose,

    getTodayDate,
    getMaxBookingDate,
    formatTime,

    clearError,
  } = useAppointmentBooking({
    isAdmin: true,
  });

  if (loadingData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-sm rounded-[24px] border border-[#485F4D]/60 bg-[#1D293D] p-8 text-center shadow-2xl shadow-black/20">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#4A6741]/20 text-[#8FA985] ring-1 ring-[#485F4D]/50">
            <CalendarPlus className="size-6" />
          </div>

          <div className="mx-auto mt-5 size-7 animate-spin rounded-full border-2 border-[#485F4D] border-t-[#8FA985]" />

          <h2 className="mt-4 text-sm font-bold text-white">
            Preparing appointment desk
          </h2>

          <p className="mt-1 text-xs leading-5 text-[#90A1B9]">
            Loading customers, branches, barbers and services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 text-white">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-[24px] border border-[#485F4D]/70 bg-[#1E2B3B] shadow-2xl shadow-black/15">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#4A6741]/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-[#6B8C5E]/10 blur-3xl" />

        <div className="pointer-events-none absolute right-1/3 top-1/2 size-40 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative px-5 py-6 sm:px-7 sm:py-8">
          {/* Back */}
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

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            {/* Title */}
            <div className="flex items-start gap-4">
              <div className="flex size-13 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/20">
                <CalendarPlus className="size-6" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    New Appointment
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#485F4D]/70 bg-[#172132] px-2.5 py-1 text-[10px] font-bold text-[#8FA985]">
                    <Sparkles className="size-3" />
                    Admin Booking
                  </span>
                </div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#90A1B9]">
                  Create an appointment for a customer by selecting their
                  branch, barber, service and available time.
                </p>
              </div>
            </div>

            {/* Booking Status */}
            <div className="hidden rounded-[16px] border border-[#485F4D]/70 bg-[#172132] px-4 py-3.5 shadow-sm sm:block">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#4A6741]/20">
                  <ShieldCheck className="size-4 text-[#8FA985]" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#708197]">
                    Booking Desk
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-white">
                    Ready for new booking
                  </p>
                </div>

                <span className="ml-2 size-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-[18px] border border-rose-500/30 bg-rose-950/30 px-4 py-3.5 shadow-lg shadow-black/10">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/20">
              <span className="text-xs font-black">!</span>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-rose-200">
                Something needs your attention
              </p>

              <p className="mt-0.5 break-words text-xs leading-5 text-rose-300/80">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearError}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 rounded-[18px] border border-emerald-500/30 bg-emerald-950/25 px-4 py-3.5 shadow-lg shadow-black/10">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20">
            <CheckCircle2 className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-emerald-200">
              Appointment created successfully
            </p>

            <p className="mt-0.5 text-xs text-emerald-300/80">{success}</p>
          </div>
        </div>
      )}

      {/* Booking Form */}
      <WalkInAppointmentForm
        isAdmin
        customers={customers}
        branches={branches}
        branchBarbers={branchBarbers}
        services={barberServices}
        customerId={customerId}
        setCustomerId={setCustomerId}
        branchId={branchId}
        setBranchId={handleBranchChange}
        barberId={barberId}
        setBarberId={(value) => {
          setBarberId(value);
          setServiceId("");
          setSelectedSlot(null);
        }}
        serviceId={serviceId}
        setServiceId={(value) => {
          setServiceId(value);
          setSelectedSlot(null);
        }}
        date={date}
        minDate={getTodayDate()}
        maxDate={getMaxBookingDate()}
        setDate={(value) => {
          setDate(value);
          setSelectedSlot(null);
        }}
        onRegisterCustomer={() => setShowCustomerModal(true)}
        onCheckAvailability={handleCheckAvailability}
        loadingSlots={loadingSlots}
      />

      {/* Selected Appointment */}
      <SelectedAppointment
        customer={selectedCustomer}
        branch={selectedBranch}
        barber={selectedBarber}
        service={selectedService}
      />

      {/* Available Slots */}
      <AvailableSlots
        slots={slots}
        selectedSlot={selectedSlot}
        onSelectSlot={(slot) => {
          setSelectedSlot(slot);
          clearError();
        }}
        booking={booking}
        onBook={handleBookAppointment}
        onAddToQueue={handleAddToQueue}
        formatTime={formatTime}
        isAdmin
      />

      {/* Register Customer */}
      <RegisterCustomerModal
        open={showCustomerModal}
        onClose={() => {
          if (!creatingCustomer) {
            setShowCustomerModal(false);
            clearError();
          }
        }}
        form={customerForm}
        setForm={setCustomerForm}
        onSubmit={handleCreateCustomer}
        loading={creatingCustomer}
      />

      {/* Stripe Payment */}
      <StripePaymentModal
        open={paymentOpen}
        clientSecret={paymentClientSecret}
        amount={paymentAmount}
        onSuccess={handlePaymentSuccess}
        onClose={handlePaymentClose}
      />
    </div>
  );
}

export default WalkInAppointment;
