function BarberFormFields({
  isEditMode,
  barber,
  users,
  branches,
  services,
  formData,
  handleChange,
  handleWorkingHoursChange,
  handleSpecialtiesChange,
  handleStatusChange,
}) {
  const fieldClass =
    "w-full rounded-[14px] border border-[#485F4D] bg-[#172132] px-3.5 py-3 text-sm font-medium text-white outline-none transition placeholder:text-[#62738A] focus:border-[#8FA985] focus:ring-2 focus:ring-[#4A6741]/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[#141E2D]";

  const labelClass =
    "mb-2 block text-xs font-bold text-[#CAD5E2]";

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* User */}
      <div>
        <label className={labelClass}>User</label>

        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          required={!isEditMode}
          disabled={isEditMode}
          className={fieldClass}
        >
          <option value="">
            {isEditMode ? "Current barber" : "Select customer"}
          </option>

          {isEditMode && barber?.userId?.name && (
            <option value={formData.userId}>
              {barber.userId.name} - {barber.userId.email}
            </option>
          )}

          {!isEditMode &&
            users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} - {user.email}
              </option>
            ))}
        </select>

        {isEditMode && (
          <p className="mt-1.5 text-[11px] font-medium text-[#708198]">
            User cannot be changed after profile creation.
          </p>
        )}
      </div>

      {/* Branch */}
      <div>
        <label className={labelClass}>Branch</label>

        <select
          name="branchId"
          value={formData.branchId}
          onChange={handleChange}
          required
          className={fieldClass}
        >
          <option value="">Select branch</option>

          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.name}
              {branch.code ? ` (${branch.code})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Specialties */}
      <div className="md:col-span-2">
        <label className={labelClass}>Specialties</label>

        <select
          multiple
          value={formData.specialties}
          onChange={handleSpecialtiesChange}
          className={`${fieldClass} min-h-32`}
        >
          {services.map((service) => (
            <option
              key={service._id}
              value={service._id}
              className="bg-[#172132] text-white"
            >
              {service.name}
            </option>
          ))}
        </select>

        <p className="mt-1.5 text-[11px] font-medium text-[#708198]">
          Hold Ctrl/Cmd to select multiple services.
        </p>
      </div>

      {/* Working Start */}
      <div>
        <label className={labelClass}>Working Start</label>

        <input
          type="time"
          name="start"
          value={formData.workingHours.start}
          onChange={handleWorkingHoursChange}
          required
          className={fieldClass}
        />
      </div>

      {/* Working End */}
      <div>
        <label className={labelClass}>Working End</label>

        <input
          type="time"
          name="end"
          value={formData.workingHours.end}
          onChange={handleWorkingHoursChange}
          required
          className={fieldClass}
        />
      </div>

      {/* Qualification */}
      <div>
        <label className={labelClass}>Qualification</label>

        <input
          type="text"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          maxLength={500}
          placeholder="Professional Barber"
          className={fieldClass}
        />
      </div>

      {/* Experience */}
      <div>
        <label className={labelClass}>Experience (Years)</label>

        <input
          type="number"
          name="experienceYears"
          value={formData.experienceYears}
          onChange={handleChange}
          min="0"
          max="50"
          placeholder="5"
          className={fieldClass}
        />
      </div>

      {/* Status */}
      {isEditMode && (
        <div>
          <label className={labelClass}>Status</label>

          <select
            value={formData.isActive ? "active" : "inactive"}
            onChange={handleStatusChange}
            className={fieldClass}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}

      {/* Bio */}
      <div className="md:col-span-2">
        <label className={labelClass}>Bio</label>

        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          maxLength={1000}
          rows={4}
          placeholder="Experienced barber..."
          className={`${fieldClass} resize-y`}
        />
      </div>
    </div>
  );
}

export default BarberFormFields;