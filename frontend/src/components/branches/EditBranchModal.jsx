import EditBranchForm from "./EditBranchForm";
function EditBranchModal({ open, branch, onClose, onSubmit, loading }) {
  if (!open || !branch) {
    return null;
  }

  return (
    <EditBranchForm
      key={branch._id}
      branch={branch}
      onClose={onClose}
      onSubmit={onSubmit}
      loading={loading}
    />
  );
}

export default EditBranchModal;