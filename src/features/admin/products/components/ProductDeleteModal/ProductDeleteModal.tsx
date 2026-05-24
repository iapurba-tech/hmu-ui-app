import React from "react";
import { HmuConfirmModal } from "../../../../../shared/components";
import type { Product } from "../../types/product.types";

interface ProductDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  product: Product | null;
  loading?: boolean;
}

const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  product,
  loading,
}) => {
  return (
    <HmuConfirmModal
      open={open}
      onCancel={onClose}
      onConfirm={() => product && onConfirm(product.id)}
      title="Delete Product"
      message={
        <>
          Are you sure you want to delete the product{" "}
          <strong>{product?.name}</strong>? This action cannot be undone.
        </>
      }
      confirmLabel="Delete Product"
      confirmVariant="danger"
      loading={loading}
    />
  );
};

export default ProductDeleteModal;
