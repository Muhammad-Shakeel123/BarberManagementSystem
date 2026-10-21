import { CircleAlert, RefreshCw } from "lucide-react";

function QueueError({ selectedBranchId, onRetry }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#5A3940] bg-[#211D28]">
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl border border-[#67434A] bg-[#30222B]">
          <CircleAlert className="size-5 text-[#D59AA3]" />
        </div>

        <p className="mt-4 font-bold text-white">
          Unable to load queue data
        </p>

        <p className="mt-1 max-w-md text-sm text-[#9C8B94]">
          Something went wrong while loading the queue.
          Please try again.
        </p>

        {selectedBranchId && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4A6741] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#4A6741]/20 transition hover:bg-[#5A7950] active:scale-95"
          >
            <RefreshCw className="size-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default QueueError;