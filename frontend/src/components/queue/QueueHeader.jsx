import { ArrowLeft, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function QueueHeader() {
  const navigate = useNavigate();

  return (
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

      <div className="flex items-center gap-3.5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] text-white shadow-lg shadow-[#4A6741]/20">
          <Users className="size-7" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Live Queue Desk
            </h1>

            <span className="hidden items-center gap-1 rounded-full border border-[#485F4D] bg-[#223328] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#9AB88E] sm:inline-flex">
              <Sparkles className="size-3 text-[#8FB579]" />
              Real-time
            </span>
          </div>

          <p className="mt-1 text-xs font-medium text-[#90A1B9] sm:text-sm">
            Monitor waiting guests, barber assignments, and live service
            activity.
          </p>
        </div>
      </div>
    </div>
  );
}

export default QueueHeader;
