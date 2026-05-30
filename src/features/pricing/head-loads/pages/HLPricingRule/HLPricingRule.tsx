import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import {
  useGetHeadLoadPrices,
  useCreateHeadLoadPrice,
} from "../../../../../shared/api/pricing/head-load/head-load-price.hooks";
import { useGetHeadLoadCategories } from "../../../../../shared/api/pricing/head-load/head-load-category.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import {
  HmuLoader,
  HmuConfirmModal,
  HmuBreadcrumb,
} from "../../../../../shared/components";
import {
  HeadLoadPricingHistoryTable,
  HeadLoadPriceForm,
} from "../../components";
import {
  pageContainerStyles,
  headerStyles,
  titleGroupStyles,
  contentGridStyles,
} from "./HLPricingRule.styles";

const HLPricingRulePage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const id = Number(categoryId);
  const { showNotification } = useNotificationStore();

  const { data: categories = [] } = useGetHeadLoadCategories();
  const category = categories.find((c) => c.id === id);
  const title = category
    ? `${category.description} (${category.code})`
    : "Head Load Pricing";

  const { data: prices = [], isLoading } = useGetHeadLoadPrices(id);
  const { mutate: createPrice, isPending: isCreating } =
    useCreateHeadLoadPrice();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingValues, setPendingValues] = useState<any>(null);

  const handleFormSubmit = (values: any) => {
    setPendingValues(values);
    setShowConfirmModal(true);
  };

  const handleSave = () => {
    if (!pendingValues) return;

    createPrice(
      {
        ruleType: "HEAD_LOAD",
        headLoadCategoryId: id,
        quantityFrom: Number(pendingValues.quantityFrom),
        rate: Number(pendingValues.rate),
        effectiveFrom: pendingValues.effectiveFrom,
      },
      {
        onSuccess: () => {
          showNotification("Price range added successfully", "success");
          setShowConfirmModal(false);
          setPendingValues(null);
        },
        onError: (error: any) => {
          showNotification(
            error?.response?.data?.message || "Failed to add price range",
            "error",
          );
          setShowConfirmModal(false);
        },
      },
    );
  };

  if (isLoading) return <HmuLoader />;

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={headerStyles}>
        <Box sx={titleGroupStyles}>
          <HmuBreadcrumb
            items={[
              {
                label: "Head Load Categories",
                path: "/admin/head-load-categories",
              },
              { label: title },
            ]}
          />
        </Box>
      </Box>

      <Box sx={contentGridStyles}>
        {/* Add New Range Card */}
        <HeadLoadPriceForm
          category={category}
          onSubmit={handleFormSubmit}
          loading={isCreating}
        />

        {/* Ranges Table Section */}
        <HeadLoadPricingHistoryTable prices={prices} />
      </Box>

      <HmuConfirmModal
        open={showConfirmModal}
        title="Confirm Price Range"
        message={
          pendingValues && (
            <span>
              Are you sure you want to add a rate of{" "}
              <strong>₹{pendingValues.rate.toFixed(2)}</strong> for quantity
              starting from{" "}
              <strong>{pendingValues.quantityFrom.toFixed(3)} Kg</strong>?
            </span>
          )
        }
        onConfirm={handleSave}
        onCancel={() => setShowConfirmModal(false)}
        loading={isCreating}
      />
    </Box>
  );
};

export default HLPricingRulePage;
