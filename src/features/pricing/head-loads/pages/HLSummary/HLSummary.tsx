import React from "react";
import { Box, Typography } from "@mui/material";
import { useGetHeadLoadCategories } from "../../../../../shared/api/pricing/head-load/head-load-category.hooks";
import { useGetHeadLoadPrices } from "../../../../../shared/api/pricing/head-load/head-load-price.hooks";
import {
  HeadLoadCategoriesTable,
  HeadLoadActivePricesTable,
} from "../../components";
import {
  pageContainerStyles,
  headerStyles,
  titleGroupStyles,
  titleStyles,
  subtitleStyles,
  dashboardGridStyles,
} from "./HLSummary.styles";

const HeadLoadSummaryPage: React.FC = () => {
  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetHeadLoadCategories();
  const { data: prices = [], isLoading: isLoadingPrices } =
    useGetHeadLoadPrices();

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={headerStyles}>
        <Box sx={titleGroupStyles}>
          <Typography variant="h5" sx={titleStyles}>
            Head Load Management
          </Typography>
          <Typography variant="body2" sx={subtitleStyles}>
            Manage categories and view active range-based pricing.
          </Typography>
        </Box>
      </Box>

      <Box sx={dashboardGridStyles}>
        <HeadLoadCategoriesTable
          categories={categories}
          isLoading={isLoadingCategories}
        />

        <HeadLoadActivePricesTable
          prices={prices}
          categories={categories}
          isLoading={isLoadingPrices}
        />
      </Box>
    </Box>
  );
};

export default HeadLoadSummaryPage;
