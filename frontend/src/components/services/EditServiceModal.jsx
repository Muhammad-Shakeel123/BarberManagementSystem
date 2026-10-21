import EditServiceForm from "./edit-service/EditServiceForm";

function EditServiceModal({
  open,
  service,
  onClose,
  onSuccess,
  onDelete,
  branches = [],
  services = [],
}) {
  if (!open || !service) {
    return null;
  }

  return (
    <EditServiceForm
      key={service._id}
      service={service}
      onClose={onClose}
      onSuccess={onSuccess}
      onDelete={onDelete}
      branches={branches}
      services={services}
    />
  );
}

export default EditServiceModal;