import { Armchair } from "lucide-react";

function ChairStatus({ chairs }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Armchair className="size-4 text-[#89ae6e]" />

        <h3 className="font-semibold text-white">
          Chair Status
        </h3>
      </div>

      <div className="space-y-2">
        {chairs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#304255] bg-[#172536]/60 p-4 text-center text-sm text-slate-500">
            No chair data available.
          </div>
        ) : (
          chairs.map((chair) => (
            <div
              key={chair.chairId}
              className="flex items-center justify-between rounded-xl border border-[#304255] bg-[#172536] p-3.5 transition hover:border-[#405669]"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-[#3a5061] bg-[#223447]">
                  <Armchair className="size-4 text-[#8cad72]" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-100">
                    {chair.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {chair.type} · {chair.appointments} appointments
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${
                    chair.isOperational
                      ? "bg-[#78ad58]"
                      : "bg-[#c86b72]"
                  }`}
                />

                <span
                  className={`text-xs font-semibold capitalize ${
                    chair.isOperational
                      ? "text-[#91bd73]"
                      : "text-[#d17b82]"
                  }`}
                >
                  {chair.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChairStatus;