import { useEffect, useState } from "react";

import {
  createBarberProfile,
  updateBarberProfile,
} from "@/services/barber.service";
import { getAllUsers } from "@/services/user.service";
import { getAllBranches } from "@/services/branch.service";
import { getAllServices } from "@/services/service.service";

const initialFormData = {
  userId: "",
  branchId: "",
  specialties: [],
  workingHours: {
    start: "09:00",
    end: "18:00",
  },
  qualification: "",
  experienceYears: "",
  bio: "",
  isActive: true,
};

export function useBarberForm(barber, onSuccess) {
  const isEditMode = Boolean(barber);

  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState(initialFormData);

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [usersResponse, branchesResponse, servicesResponse] =
          await Promise.all([
            getAllUsers(),
            getAllBranches(),
            getAllServices(),
          ]);

        const allUsers = usersResponse?.data || [];

        setUsers(
          allUsers.filter(
            (user) => user.role?.toLowerCase() === "customer",
          ),
        );

        setBranches(branchesResponse?.data || []);
        setServices(servicesResponse?.data || []);

        if (barber) {
          setFormData({
            userId: barber?.userId?._id || barber?.userId || "",
            branchId: barber?.branchId?._id || barber?.branchId || "",
            specialties:
              barber?.specialties?.map((service) =>
                service?._id ? service._id : service,
              ) || [],
            workingHours: {
              start: barber?.workingHours?.start || "09:00",
              end: barber?.workingHours?.end || "18:00",
            },
            qualification: barber?.qualification || "",
            experienceYears:
              barber?.experienceYears !== undefined
                ? barber.experienceYears
                : "",
            bio: barber?.bio || "",
            isActive: barber?.isActive ?? true,
          });
        }
      } catch (err) {
        console.error("Barber form data error:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load users, branches or services.",
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadFormData();
  }, [barber]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkingHoursChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [name]: value,
      },
    }));
  };

  const handleSpecialtiesChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    setFormData((prev) => ({
      ...prev,
      specialties: selectedOptions,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.value === "active",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (isEditMode) {
        const payload = {
          branchId: formData.branchId,
          specialties: formData.specialties,
          workingHours: formData.workingHours,
          isActive: formData.isActive,
          qualification: formData.qualification,
          experienceYears:
            formData.experienceYears === ""
              ? undefined
              : Number(formData.experienceYears),
          bio: formData.bio,
        };

        const response = await updateBarberProfile(
          barber._id,
          payload,
        );

        onSuccess?.(response?.data);
      } else {
        const payload = {
          userId: formData.userId,
          branchId: formData.branchId,
          specialties: formData.specialties,
          workingHours: formData.workingHours,
          qualification: formData.qualification,
          experienceYears:
            formData.experienceYears === ""
              ? undefined
              : Number(formData.experienceYears),
          bio: formData.bio,
        };

        const response = await createBarberProfile(payload);

        onSuccess?.(response?.data);

        setFormData({
          userId: "",
          branchId: "",
          specialties: [],
          workingHours: {
            start: "09:00",
            end: "18:00",
          },
          qualification: "",
          experienceYears: "",
          bio: "",
          isActive: true,
        });
      }
    } catch (err) {
      console.error(
        isEditMode ? "Update barber error:" : "Create barber error:",
        err,
      );

      setError(
        err?.response?.data?.message ||
          `Unable to ${
            isEditMode ? "update" : "create"
          } barber profile. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    isEditMode,

    users,
    branches,
    services,

    formData,
    loadingData,
    loading,
    error,

    handleChange,
    handleWorkingHoursChange,
    handleSpecialtiesChange,
    handleStatusChange,
    handleSubmit,
  };
}