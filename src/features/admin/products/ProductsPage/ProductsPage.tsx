import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { HmuButton } from "../../../../shared/components";
import { AddIcon } from "../../../../shared/icons";
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
} from "../../../../shared/api/admin/product/product.hooks";
import { useNotificationStore } from "../../../../shared/store/useNotificationStore";
import ProductsTable from "../components/ProductsTable/ProductsTable";
import ProductModal from "../components/ProductModal/ProductModal";
import type { Product } from "../types/product.types";
import type { ProductFormData } from "../types/product.schema";
import {
  pageContainerStyles,
  headerStyles,
  titleGroupStyles,
  titleStyles,
  subtitleStyles,
  addButtonStyles,
} from "./ProductsPage.styles";

const ProductsPage: React.FC = () => {
  const { showNotification } = useNotificationStore();

  const { data: products = [], isLoading } = useGetProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "view";
    product: Product | null;
  }>({
    isOpen: false,
    mode: "create",
    product: null,
  });

  const handleOpenCreate = () => {
    setModalState({ isOpen: true, mode: "create", product: null });
  };

  const handleOpenEdit = (product: Product) => {
    setModalState({ isOpen: true, mode: "edit", product });
  };

  const handleOpenView = (product: Product) => {
    setModalState({ isOpen: true, mode: "view", product });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleFormSubmit = (data: ProductFormData) => {
    if (modalState.mode === "create") {
      createProduct(data as any, {
        onSuccess: () => {
          showNotification("Product created successfully", "success");
          handleCloseModal();
        },
        onError: (error: any) => {
          showNotification(
            error?.response?.data?.message || "Failed to create product",
            "error",
          );
        },
      });
    } else if (modalState.mode === "edit" && modalState.product) {
      updateProduct({ id: modalState.product.id, ...data } as any, {
        onSuccess: () => {
          showNotification("Product updated successfully", "success");
          handleCloseModal();
        },
        onError: (error: any) => {
          showNotification(
            error?.response?.data?.message || "Failed to update product",
            "error",
          );
        },
      });
    }
  };

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={headerStyles}>
        <Box sx={titleGroupStyles}>
          <Typography variant="h5" sx={titleStyles}>
            Product Management
          </Typography>
          <Typography variant="body2" sx={subtitleStyles}>
            Manage and monitor global product catalog, pricing and availability.
          </Typography>
        </Box>
        <HmuButton
          label="Add Product"
          variant="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={addButtonStyles}
        />
      </Box>

      <ProductsTable
        products={products}
        isLoading={isLoading}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
      />

      <ProductModal
        open={modalState.isOpen}
        onClose={handleCloseModal}
        mode={modalState.mode}
        product={modalState.product || undefined}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />
    </Box>
  );
};

export default ProductsPage;
