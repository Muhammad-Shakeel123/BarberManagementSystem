import {
  Scissors,
  Users,
  ChevronRight,
} from "lucide-react";

function UserTypeCards({
  customers,
  barbers,
  activeType,
  onSelect,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Customers */}
      <button
        type="button"
        onClick={() => onSelect("customer")}
        className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
          activeType === "customer"
            ? "border-[#59764d] bg-[#1d3041] shadow-lg shadow-black/10"
            : "border-[#2d4053] bg-[#1b2a3a] hover:border-[#41566b] hover:bg-[#1d2d3f]"
        }`}
      >
        {activeType === "customer" && (
          <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#719d55]/10 blur-2xl" />
        )}

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex size-11 items-center justify-center rounded-xl border ${
                activeType === "customer"
                  ? "border-[#59764d] bg-[#304638]"
                  : "border-[#354a60] bg-[#22364a]"
              }`}
            >
              <Users
                className={`size-5 ${
                  activeType === "customer"
                    ? "text-[#9abd82]"
                    : "text-[#8da4b9]"
                }`}
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#849bb0]">
                User Type
              </p>

              <h3 className="mt-0.5 text-base font-bold text-white">
                Customers
              </h3>

              <p className="mt-1 text-xs text-[#657d93]">
                Registered customer accounts
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-extrabold text-white">
              {customers}
            </p>

            <div className="mt-1 flex items-center justify-end gap-1">
              <span
                className={`size-1.5 rounded-full ${
                  activeType === "customer"
                    ? "bg-[#73c34d]"
                    : "bg-[#60758a]"
                }`}
              />

              <span className="text-[10px] font-semibold text-[#8298ad]">
                Accounts
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-between border-t border-[#2d4256] pt-3">
          <span
            className={`text-xs font-semibold ${
              activeType === "customer"
                ? "text-[#91b777]"
                : "text-[#748ba0]"
            }`}
          >
            {activeType === "customer" ? "Currently selected" : "View customers"}
          </span>

          <ChevronRight
            className={`size-4 transition-transform ${
              activeType === "customer"
                ? "translate-x-0 text-[#91b777]"
                : "text-[#62798e] group-hover:translate-x-0.5"
            }`}
          />
        </div>
      </button>

      {/* Barbers */}
      <button
        type="button"
        onClick={() => onSelect("barber")}
        className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
          activeType === "barber"
            ? "border-[#59764d] bg-[#1d3041] shadow-lg shadow-black/10"
            : "border-[#2d4053] bg-[#1b2a3a] hover:border-[#41566b] hover:bg-[#1d2d3f]"
        }`}
      >
        {activeType === "barber" && (
          <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#719d55]/10 blur-2xl" />
        )}

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex size-11 items-center justify-center rounded-xl border ${
                activeType === "barber"
                  ? "border-[#59764d] bg-[#304638]"
                  : "border-[#354a60] bg-[#22364a]"
              }`}
            >
              <Scissors
                className={`size-5 ${
                  activeType === "barber"
                    ? "text-[#9abd82]"
                    : "text-[#8da4b9]"
                }`}
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#849bb0]">
                User Type
              </p>

              <h3 className="mt-0.5 text-base font-bold text-white">
                Barbers
              </h3>

              <p className="mt-1 text-xs text-[#657d93]">
                Professional barber accounts
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-extrabold text-white">
              {barbers}
            </p>

            <div className="mt-1 flex items-center justify-end gap-1">
              <span
                className={`size-1.5 rounded-full ${
                  activeType === "barber"
                    ? "bg-[#73c34d]"
                    : "bg-[#60758a]"
                }`}
              />

              <span className="text-[10px] font-semibold text-[#8298ad]">
                Accounts
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-between border-t border-[#2d4256] pt-3">
          <span
            className={`text-xs font-semibold ${
              activeType === "barber"
                ? "text-[#91b777]"
                : "text-[#748ba0]"
            }`}
          >
            {activeType === "barber" ? "Currently selected" : "View barbers"}
          </span>

          <ChevronRight
            className={`size-4 transition-transform ${
              activeType === "barber"
                ? "translate-x-0 text-[#91b777]"
                : "text-[#62798e] group-hover:translate-x-0.5"
            }`}
          />
        </div>
      </button>
    </div>
  );
}

export default UserTypeCards;