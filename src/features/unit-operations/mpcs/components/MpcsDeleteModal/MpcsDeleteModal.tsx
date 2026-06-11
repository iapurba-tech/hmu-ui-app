import React from "react";
import { HmuConfirmModal } from "../../../../../shared/components";
import type { Mpcs } from "../../types/mpcs.types";

interface MpcsDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  mpcs: Mpcs | null;
  loading: boolean;
}

const MpcsDeleteModal: React.FC<MpcsDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  mpcs,
  loading,
}) => {
  return (
    <HmuConfirmModal
      open={open}
      onCancel={onClose}
      onConfirm={() => mpcs && onConfirm(mpcs.id)}
      title="Delete MPCS"
      message={`Are you sure you want to delete MPCS "${mpcs?.name}"? This action cannot be undone.`}
      confirmLabel="Delete"
      confirmVariant="danger"
      loading={loading}
    />
  );
};

export default MpcsDeleteModal;
