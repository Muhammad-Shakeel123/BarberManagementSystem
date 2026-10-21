import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAppointmentBooking from "@/hooks/useAppointmentBooking";

import WalkInHeader from "@/components/walkin/WalkInHeader";
import BranchSelection from "@/components/walkin/BranchSelection";
import WalkInAppointmentForm from "@/components/walkin/WalkInAppointmentForm";
import SelectedAppointment from "@/components/walkin/SelectedAppointment";
import AvailableSlots from "@/components/walkin/AvailableSlots";
import StripePaymentModal from "@/components/payment/StripePaymentModal";

function BookAppointment() {
  const isAdmin = false;
  const navigate = useNavigate();

  const {
    branches,
    showAllBranches,
    branchBarbers,
    barberServices,

    branchId,
    setBarberId,
    barberId,
    setServiceId,
    serviceId,
    date,
    setDate,

    slots,
    selectedSlot,
    setSelectedSlot,

    loadingData,
    loadingSlots,
    booking,
    joiningQueue,

    paymentOpen,
    paymentClientSecret,
    paymentAmount,
    pendingPayment,
    queueEntry,
    creatingPaymentIntent,

    error,
    success,

    selectedCustomer,
    selectedBranch,
    selectedBarber,
    selectedService,

    handleShowAllBranches,
    handleShowNearbyBranches,
    handleBranchSelect,
    handleBranchChange,
    handleCheckAvailability,
    handleBookAppointment,

    handlePaymentSuccess,
    handlePaymentClose,
    handlePayNow,
    handleJoinQueue,
    handleLeaveQueue,

    getTodayDate,
    getMaxBookingDate,
    formatTime,

    clearError,
  } = useAppointmentBooking({
    isAdmin: false,
  });

  if (loadingData) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#6f9f5b]/30 bg-[#1b2a39] shadow-lg shadow-black/10">
            <div className="size-7 animate-spin rounded-full border-[3px] border-[#6f9f5b]/20 border-t-[#7da866]" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-300">
            Loading appointment options...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Preparing available locations and services
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <WalkInHeader
        isAdmin={false}
        onBack={() => navigate("/customer/dashboard")}
      />

      {/* =========================================================
          PAGE INTRO
      ========================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-[#2d4050] bg-[#172536] px-5 py-5 shadow-sm sm:px-6">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-[#6f9f5b]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-48 rounded-full bg-[#6f9f5b]/5 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#6f9f5b]/30 bg-[#6f9f5b]/15 shadow-sm">
              <CalendarDays className="size-6 text-[#91b879]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Book an Appointment
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6f9f5b]/30 bg-[#6f9f5b]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#91b879]">
                  <Sparkles className="size-3" />
                  Easy Booking
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-xs font-medium leading-5 text-slate-400 sm:text-sm">
                Choose your preferred branch, barber, service, and available
                time slot to book your appointment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[#2d4050] bg-[#111d2b] px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#6f9f5b]/10">
              <MapPin className="size-4 text-[#8fb778]" />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                Booking Mode
              </p>

              <p className="text-xs font-bold text-slate-200">
                Online Appointment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ERROR
      ========================================================== */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-500/20 bg-[#2a1c22] p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
              <AlertCircle className="size-4 text-red-400" />
            </div>

            <div>
              <p className="text-xs font-bold text-red-300 sm:text-sm">
                Something went wrong
              </p>

              <p className="mt-0.5 text-xs leading-5 text-red-300/70 sm:text-sm">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearError}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* =========================================================
          SUCCESS
      ========================================================== */}
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#6f9f5b]/30 bg-[#1b2d26] p-4 shadow-sm">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#6f9f5b]/15">
            <CheckCircle2 className="size-4 text-[#82b66a]" />
          </div>

          <div>
            <p className="text-xs font-bold text-[#9bc685] sm:text-sm">
              Appointment created successfully
            </p>

            <p className="mt-0.5 text-xs leading-5 text-[#82a875]/80 sm:text-sm">
              {success}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================
          BRANCH SELECTION
      ========================================================== */}
      <section className="space-y-3">
        <SectionHeading
          icon={Building2}
          eyebrow="Step 01"
          title="Choose Your Location"
          description="Select the barber shop where you want your appointment."
        />

        <div className="rounded-3xl border border-[#2d4050] bg-[#172536] p-4 shadow-sm sm:p-5">
          <BranchSelection
            branches={branches}
            selectedBranchId={branchId}
            onSelectBranch={handleBranchSelect}
            showAllBranches={showAllBranches}
            onShowAllBranches={handleShowAllBranches}
            onShowNearbyBranches={handleShowNearbyBranches}
          />
        </div>
      </section>

      {queueEntry && (
        <section className="overflow-hidden rounded-3xl border border-amber-500/30 bg-[#28251d] shadow-sm">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-300">
                Waiting Queue
              </p>
              <h2 className="mt-1 text-lg font-bold text-white">
                No appointment slot is open right now
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Join the queue and we will keep your request with this branch
                and barber.
              </p>
              {queueEntry.position && (
                <p className="mt-2 text-sm font-bold text-amber-200">
                  Queue position: {queueEntry.position}
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {queueEntry._id ? (
                <button
                  type="button"
                  onClick={handleLeaveQueue}
                  disabled={joiningQueue}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-amber-500/30 bg-[#172132] px-5 text-sm font-bold text-amber-200 transition hover:bg-[#1d293d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {joiningQueue ? "Updating..." : "Leave Queue"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleJoinQueue}
                  disabled={joiningQueue}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-amber-500 px-5 text-sm font-bold text-[#211b0d] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {joiningQueue ? "Joining..." : "Join Queue"}
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          SELECTED BRANCH + APPOINTMENT FORM
      ========================================================== */}
      {branchId && (
        <>
          <section className="space-y-3">
            <div className="flex flex-col gap-3 rounded-3xl border border-[#6f9f5b]/25 bg-[#1a2a38] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#6f9f5b]/25 bg-[#6f9f5b]/10">
                  <Building2 className="size-5 text-[#8db777]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Selected Location
                    </p>

                    <span className="size-1.5 rounded-full bg-[#6f9f5b] shadow-[0_0_8px_rgba(111,159,91,0.7)]" />
                  </div>

                  <p className="mt-0.5 text-sm font-extrabold text-white sm:text-base">
                    {selectedBranch?.name || "Selected Branch"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleBranchChange("");
                }}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#34495a] bg-[#111d2b] px-4 text-xs font-bold text-slate-300 transition hover:border-[#6f9f5b]/40 hover:bg-[#1c2b39] hover:text-white active:scale-[0.98]"
              >
                Change Location
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <SectionHeading
              icon={CalendarDays}
              eyebrow="Step 02"
              title="Appointment Details"
              description="Choose your barber, service, and preferred date."
            />

            <div className="overflow-hidden rounded-3xl border border-[#2d4050] bg-[#172536] shadow-sm">
              <WalkInAppointmentForm
                isAdmin={false}
                customers={[]}
                branches={branches}
                branchBarbers={branchBarbers}
                services={barberServices}
                customerId=""
                setCustomerId={() => {}}
                branchId={branchId}
                setBranchId={handleBranchChange}
                barberId={barberId}
                setBarberId={(value) => {
                  setBarberId(value);
                  setServiceId("");
                  setSelectedSlot(null);
                  clearError();
                }}
                serviceId={serviceId}
                setServiceId={(value) => {
                  setServiceId(value);
                  setSelectedSlot(null);
                  clearError();
                }}
                date={date}
                minDate={getTodayDate()}
                maxDate={getMaxBookingDate()}
                setDate={(value) => {
                  setDate(value);
                  setSelectedSlot(null);
                  clearError();
                }}
                onRegisterCustomer={() => {}}
                onCheckAvailability={handleCheckAvailability}
                loadingSlots={loadingSlots}
              />
            </div>
          </section>
        </>
      )}

      {/* =========================================================
          SELECTED APPOINTMENT
      ========================================================== */}
      {(selectedBranch || selectedBarber || selectedService) && (
        <section className="space-y-3">
          <SectionHeading
            icon={CheckCircle2}
            eyebrow="Your Selection"
            title="Appointment Summary"
            description="Review your selected appointment details before choosing a slot."
          />

          <div className="overflow-hidden rounded-3xl border border-[#2d4050] bg-[#172536] shadow-sm">
            <SelectedAppointment
              customer={selectedCustomer}
              branch={selectedBranch}
              barber={selectedBarber}
              service={selectedService}
            />
          </div>
        </section>
      )}

      {/* =========================================================
          PAYMENT PENDING
      ========================================================== */}
      {!isAdmin && pendingPayment && (
        <section className="overflow-hidden rounded-3xl border border-[#8b7137]/40 bg-[#28251d] shadow-sm">
          <div className="relative p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-[#b9954f]/10 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#a78b52]/30 bg-[#a78b52]/10">
                  <CreditCard className="size-5 text-[#c5a967]" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#c7ab6b]">
                      Payment Required
                    </p>

                    <span className="rounded-full border border-[#a78b52]/25 bg-[#a78b52]/10 px-2 py-0.5 text-[9px] font-bold text-[#c7ab6b]">
                      Pending
                    </span>
                  </div>

                  <p className="max-w-xl text-xs leading-5 text-slate-400 sm:text-sm">
                    Your appointment slot has been reserved. Complete the
                    payment to confirm your booking.
                  </p>

                  <p className="pt-2 text-xl font-black text-white">
                    Rs. {Number(pendingPayment.amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayNow}
                disabled={creatingPaymentIntent}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6f9f5b] px-5 text-xs font-extrabold text-white shadow-lg shadow-black/10 transition hover:bg-[#7da866] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-sm"
              >
                <CreditCard className="size-4" />

                {creatingPaymentIntent
                  ? "Preparing Payment..."
                  : "Pay Now with Stripe"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          AVAILABLE SLOTS
      ========================================================== */}
      <section className="space-y-3">
        <SectionHeading
          icon={CalendarDays}
          eyebrow="Step 03"
          title="Choose an Available Time"
          description={
            branchId
              ? "Select a convenient time slot for your appointment."
              : "Select a branch and appointment details to see available slots."
          }
        />

        <div className="overflow-hidden rounded-3xl border border-[#2d4050] bg-[#172536] shadow-sm">
          <AvailableSlots
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={(slot) => {
              setSelectedSlot(slot);
              clearError();
            }}
            booking={booking}
            onBook={handleBookAppointment}
            formatTime={formatTime}
          />
        </div>
      </section>

      {/* =========================================================
          PAYMENT MODAL
      ========================================================== */}
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

/* ===============================================================
   SECTION HEADING
================================================================ */

function SectionHeading({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="flex items-start gap-3 px-1">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#6f9f5b]/20 bg-[#6f9f5b]/10">
        <Icon className="size-4 text-[#87ae70]" />
      </div>

      <div>
        <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#77986a]">
          {eyebrow}
        </p>

        <h2 className="mt-0.5 text-base font-extrabold text-white sm:text-lg">
          {title}
        </h2>

        <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

export default BookAppointment;
