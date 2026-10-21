import CreateServiceForm from "./create-service/CreateServiceForm";

function CreateServiceModal({
  open,
  onClose,
  onSuccess,
  branches = [],
  services = [],
}) {
  if (!open) {
    return null;
  }

  return (
    <CreateServiceForm
      onClose={onClose}
      onSuccess={onSuccess}
      branches={branches}
      services={services}
    />
  );
}

export default CreateServiceModal;