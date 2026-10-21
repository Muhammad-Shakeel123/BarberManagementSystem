import { useEffect, useMemo, useState } from "react";

import { getAllServices } from "@/services/service.service";
import { addExtraService } from "@/services/appointment.service";

function AppointmentExtraService({ appointment, onUpdated }) {
  const [allServices, setAllServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);

  const services = appointment?.serviceIds || [];

  const existingServiceIds = useMemo(
    () => services.map((service) => (service?._id || service)?.toString()),
    [services],
  );

  const availableExtraServices = useMemo(
    () =>
      allServices.filter(
        (service) => !existingServiceIds.includes(service._id?.toString()),
      ),
    [allServices, existingServiceIds],
  );

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        setIsLoadingServices(true);

        const response = await getAllServices({
          isActive: true,
        });

        if (isMounted) {
          setAllServices(response?.data || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Load services error:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoadingServices(false);
        }
      }
    };

    void loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddService = async () => {
    if (!selectedServiceId) {
      alert("Please select a service.");
      return;
    }

    try {
      setIsAddingService(true);

      await addExtraService(appointment._id, selectedServiceId);

      setSelectedServiceId("");
      setShowAddService(false);

      onUpdated?.();

      alert("Service added successfully.");
    } catch (error) {
      console.error("Add extra service error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to add service. Please try again.",
      );
    } finally {
      setIsAddingService(false);
    }
  };

  if (!["booked", "confirmed"].includes(appointment?.status)) {
    return null;
  }

  return (
    <section className="border-t border-[#485F4D]/60 pt-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Add Extra Service
          </h3>

          <p className="mt-1 text-xs text-[#90A1B9]">
            Customer requested an additional service.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddService((prev) => !prev)}
          disabled={isAddingService}
          className="rounded-xl border border-[#485F4D] bg-[#172132] px-4 py-2 text-xs font-semibold text-[#CAD5E2] transition hover:border-[#8FA985] hover:bg-[#1D293D] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {showAddService ? "Close" : "Add Service"}
        </button>
      </div>

      {showAddService && (
        <div className="mt-4 space-y-4 rounded-2xl border border-[#485F4D]/70 bg-[#172132] p-4">
          {isLoadingServices ? (
            <p className="text-sm text-[#90A1B9]">Loading services...</p>
          ) : availableExtraServices.length === 0 ? (
            <p className="text-sm text-[#90A1B9]">
              No additional services are available.
            </p>
          ) : (
            <>
              <div>
                <label className="text-xs font-medium text-[#CAD5E2]">
                  Select Service
                </label>

                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  disabled={isAddingService}
                  className="mt-1 w-full rounded-xl border border-[#485F4D] bg-[#1E2B3B] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#8FA985]"
                >
                  <option value="" className="bg-[#172132] text-[#90A1B9]">
                    Select a service
                  </option>

                  {availableExtraServices.map((service) => (
                    <option
                      key={service._id}
                      value={service._id}
                      className="bg-[#172132] text-white"
                    >
                      {service.name} — Rs. {service.price} ({service.duration}{" "}
                      min)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddService}
                  disabled={!selectedServiceId || isAddingService}
                  className="rounded-xl bg-gradient-to-b from-[#4A6741] to-[#6B8C5E] border border-[#8FA985]/40 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#4A6741]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAddingService
                    ? "Adding Service..."
                    : "Confirm Add Service"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default AppointmentExtraService;
