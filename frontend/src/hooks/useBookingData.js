import { useEffect, useMemo, useState } from "react";

import { getAllUsers } from "@/services/user.service";
import { getAllBranches, getNearbyBranches } from "@/services/branch.service";
import { getAllBarbers } from "@/services/barber.service";
import { getAllServices } from "@/services/service.service";

function useBookingData({ isAdmin }) {
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [error, setError] = useState("");

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (locationError) => {
          reject(locationError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000,
        },
      );
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setError("");

        let branchResponse;

        if (isAdmin) {
          branchResponse = await getAllBranches({
            isActive: true,
          });
        } else {
          try {
            const location = await getCurrentLocation();

            branchResponse = await getNearbyBranches({
              lat: location.lat,
              lng: location.lng,
            });
          } catch {
            // Location is an enhancement; customers can still browse all branches.
            branchResponse = await getAllBranches({
              isActive: true,
            });
            setShowAllBranches(true);
          }
        }

        const promises = [
          getAllBarbers({
            isActive: true,
          }),
          getAllServices({
            isActive: true,
          }),
        ];

        if (isAdmin) {
          promises.unshift(
            getAllUsers({
              role: "customer",
              isActive: true,
            }),
          );
        }

        const responses = await Promise.all(promises);

        if (isAdmin) {
          setCustomers(responses[0]?.data || []);
          setBarbers(responses[1]?.data || []);
          setServices(responses[2]?.data || []);
        } else {
          setBarbers(responses[0]?.data || []);
          setServices(responses[1]?.data || []);
        }

        setBranches(branchResponse?.data || []);
      } catch (err) {
        console.error("Booking data error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load appointment data.",
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [isAdmin]);

  const getBranchBarbers = useMemo(() => {
    return (branchId) => {
      if (!branchId) {
        return [];
      }

      return barbers.filter((barber) => {
        if (!barber?.isActive) {
          return false;
        }

        const primaryBranch = barber?.branchId?._id || barber?.branchId;

        const additionalBranches = barber?.branches || [];

        return (
          primaryBranch?.toString() === branchId?.toString() ||
          additionalBranches.some(
            (branch) =>
              (branch?._id || branch)?.toString() === branchId?.toString(),
          )
        );
      });
    };
  }, [barbers]);

  const getBarberServices = useMemo(() => {
    return (barberId) => {
      if (!barberId) {
        return services;
      }

      const selectedBarber = barbers.find(
        (barber) => barber?._id?.toString() === barberId?.toString(),
      );

      if (!selectedBarber) {
        return services;
      }

      const specialties = selectedBarber?.specialties || [];

      if (specialties.length === 0) {
        return services;
      }

      return services.filter((service) =>
        specialties.some(
          (specialty) =>
            (specialty?._id || specialty)?.toString() ===
            service?._id?.toString(),
        ),
      );
    };
  }, [barbers, services]);

  const handleShowAllBranches = async () => {
    try {
      setLoadingData(true);
      setError("");

      const response = await getAllBranches({
        isActive: true,
      });

      setBranches(response?.data || []);
      setShowAllBranches(true);
    } catch (err) {
      console.error("Load all branches error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load all branches.",
      );
    } finally {
      setLoadingData(false);
    }
  };

  const handleShowNearbyBranches = async () => {
    try {
      setLoadingData(true);
      setError("");

      const location = await getCurrentLocation();

      const response = await getNearbyBranches({
        lat: location.lat,
        lng: location.lng,
        radius: 10000,
      });

      setBranches(response?.data || []);
      setShowAllBranches(false);
    } catch (err) {
      console.error("Load nearby branches error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load nearby branches.",
      );
    } finally {
      setLoadingData(false);
    }
  };

  return {
    customers,
    setCustomers,

    branches,
    setBranches,

    showAllBranches,
    barbers,
    services,

    loadingData,
    loadingSlots,
    setLoadingSlots,
    getBranchBarbers,
    getBarberServices,

    handleShowAllBranches,
    handleShowNearbyBranches,

    getCurrentLocation,

    error,
    setError,
  };
}

export default useBookingData;
