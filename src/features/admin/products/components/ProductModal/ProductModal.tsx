import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  alpha,
} from "@mui/material";
import { CloseIcon } from "../../../../../shared/icons";
import ProductForm from "../ProductForm/ProductForm";
import { type ProductFormData } from "../../types/product.schema";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
  product?: Partial<ProductFormData> & { id: string; code?: string };
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  mode,
  onSubmit,
  isLoading,
  product,
}) => {
  const titles = {
    create: "Add New Product",
    edit: "Edit Product",
    view: "Product Details",
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            boxShadow: `0 20px 40px ${alpha("#000000", 0.15)}`,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: "-0.01em",
          }}
        >
          {titles[mode]}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: 1 }}>
        <ProductForm
          mode={mode}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          defaultValues={product}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
