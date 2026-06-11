import React, { useState, useMemo, useCallback } from "react";
import { Box, Typography, Collapse } from "@mui/material";
import { HmuConfirmModal, HmuButton } from "../../../../shared/components";
import { palette } from "../../../../shared/theme";
import { AddIcon } from "../../../../shared/icons";
import {
  pageContainerStyles,
  pageHeaderStyles,
  pageTitleStyles,
  tableContainerStyles,
} from "../../collections/MilkCollectionsPage/MilkCollectionsPage.styles";
import {
  useGetProductSales,
  useCreateProductSale,
  useCreateProductSalesBulk,
  useUpdateProductSale,
  useDeleteProductSale,
} from "../../../../shared/api/unit/sales/product-sales.hooks";
import { useGetMpcsList } from "../../../../shared/api/unit/mpcs/mpcs.hooks";
import { useGetProducts } from "../../../../shared/api/admin/product/product.hooks";
import type {
  ProductSale,
  ProductSaleCreateRequest,
} from "../types/product-sale.types";
import ProductSaleForm from "../components/ProductSaleForm";
import ProductSaleTable from "../components/ProductSaleTable";

const ProductSalesPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [orderBy, setOrderBy] = useState("saleDate");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const sortParam = useMemo(() => `${orderBy},${order}`, [orderBy, order]);

  const { data: paginatedData, isLoading: isSalesLoading } = useGetProductSales(
    page,
    size,
    sortParam,
  );

  const sales = paginatedData?.content || [];

  const { data: mpcsList = [], isLoading: isMpcsLoading } = useGetMpcsList();
  const { data: products = [], isLoading: isProductsLoading } =
    useGetProducts();

  const createMutation = useCreateProductSale();
  const bulkCreateMutation = useCreateProductSalesBulk();
  const updateMutation = useUpdateProductSale();
  const deleteMutation = useDeleteProductSale();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<ProductSale | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = useCallback((sale: ProductSale) => {
    setSelectedSale(sale);
    setIsFormOpen(true);
  }, []);

  const handleSort = useCallback(
    (columnId: string) => {
      const isAsc = orderBy === columnId && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(columnId);
      setPage(0);
    },
    [orderBy, order],
  );

  const mpcsOptions = useMemo(
    () => mpcsList.map((m) => ({ label: m.name, value: m.id })),
    [mpcsList],
  );

  const mpcsMap = useMemo(() => {
    const map: Record<string, string> = {};
    mpcsList.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, [mpcsList]);

  const productMap = useMemo(() => {
    const map: Record<string, string> = {};
    products.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [products]);

  const handleSubmit = useCallback(
    (
      data: ProductSaleCreateRequest | ProductSaleCreateRequest[],
      onSuccess?: () => void,
    ) => {
      const mutationOptions = {
        onSuccess: () => {
          onSuccess?.();
          setIsFormOpen(false);
        },
      };

      if (Array.isArray(data)) {
        bulkCreateMutation.mutate(data, mutationOptions);
      } else {
        createMutation.mutate(data, mutationOptions);
      }
    },
    [bulkCreateMutation, createMutation],
  );

  const handleUpdate = useCallback(
    (id: string, data: ProductSaleCreateRequest, onSuccess?: () => void) => {
      updateMutation.mutate(
        { id, data },
        {
          onSuccess: () => {
            onSuccess?.();
            setSelectedSale(null);
            setIsFormOpen(false);
          },
        },
      );
    },
    [updateMutation],
  );

  const handleDelete = useCallback(() => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  }, [deleteId, deleteMutation]);

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageHeaderStyles}>
        <Box>
          <Typography variant="h5" sx={pageTitleStyles}>
            Product Sales
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: palette.text.secondary, mt: 0.5 }}
          >
            Record and manage sales of feed and other products to MPCS.
          </Typography>
        </Box>
        {!isFormOpen && (
          <HmuButton
            label="Record Sale"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
          />
        )}
      </Box>

      <Collapse in={isFormOpen} mountOnEnter unmountOnExit>
        <ProductSaleForm
          onSubmit={handleSubmit}
          onUpdate={handleUpdate}
          initialData={selectedSale}
          mpcsOptions={mpcsOptions}
          products={products}
          isSubmitting={
            createMutation.isPending ||
            bulkCreateMutation.isPending ||
            updateMutation.isPending
          }
          onCancel={() => {
            setSelectedSale(null);
            setIsFormOpen(false);
          }}
        />
      </Collapse>

      <Box sx={tableContainerStyles}>
        <ProductSaleTable
          sales={sales}
          isLoading={isSalesLoading || isMpcsLoading || isProductsLoading}
          onEdit={handleEdit}
          onDelete={setDeleteId}
          mpcsMap={mpcsMap}
          productMap={productMap}
          pagination={{
            page,
            size,
            totalElements: paginatedData?.totalElements || 0,
            onPageChange: setPage,
            onSizeChange: setSize,
          }}
          sorting={{
            orderBy,
            order,
            onSort: handleSort,
          }}
        />
      </Box>

      <HmuConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product Sale"
        message="Are you sure you want to delete this product sale record? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default ProductSalesPage;
