import React, { useMemo, Fragment } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { HeadLoadPrice } from "../../types/head-load-price.types";
import type { HeadLoadCategory } from "../../types/head-load-category.types";
import { HmuLoader } from "../../../../../shared/components";
import {
  tableCardStyles,
  sectionHeaderStyles,
  sectionTitleStyles,
  loaderContainerStyles,
  tableHeaderRowStyles,
  tableHeaderCellStyles,
  emptyCellStyles,
  categoryRowStyles,
  categoryCellStyles,
  categoryTitleStyles,
  priceRowStyles,
  rangeCellStyles,
  monoTextStyles,
  rateTextStyles,
} from "./HLActivePricingTable.styles";

interface HeadLoadActivePricesTableProps {
  prices: HeadLoadPrice[];
  categories: HeadLoadCategory[];
  isLoading: boolean;
}

const HeadLoadActivePricesTable: React.FC<HeadLoadActivePricesTableProps> = ({
  prices,
  categories,
  isLoading,
}) => {
  const groupedPrices = useMemo(() => {
    const activePrices = prices.filter((p) => p.status === "ACTIVE");
    const groups: Record<number, HeadLoadPrice[]> = {};

    activePrices.forEach((p) => {
      if (!groups[p.headLoadCategoryId]) groups[p.headLoadCategoryId] = [];
      groups[p.headLoadCategoryId].push(p);
    });

    Object.keys(groups).forEach((key) => {
      groups[Number(key)].sort((a, b) => a.quantityFrom - b.quantityFrom);
    });

    return groups;
  }, [prices]);

  const categoryIds = useMemo(
    () =>
      Object.keys(groupedPrices)
        .map(Number)
        .sort((a, b) => {
          const catA = categories.find((c) => c.id === a);
          const catB = categories.find((c) => c.id === b);
          return (catA?.description || "").localeCompare(
            catB?.description || "",
          );
        }),
    [groupedPrices, categories],
  );

  if (isLoading)
    return (
      <Box sx={loaderContainerStyles}>
        <HmuLoader />
      </Box>
    );

  return (
    <Box sx={tableCardStyles}>
      <Box sx={sectionHeaderStyles}>
        <Typography variant="subtitle2" sx={sectionTitleStyles}>
          Active HLC Pricing
        </Typography>
      </Box>

      <TableContainer sx={{ overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={tableHeaderRowStyles}>
              <TableCell sx={tableHeaderCellStyles}>Category / Range</TableCell>
              <TableCell sx={tableHeaderCellStyles}>Range Start (Kg)</TableCell>
              <TableCell sx={tableHeaderCellStyles}>Rate (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryIds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={emptyCellStyles}>
                  No active price ranges found.
                </TableCell>
              </TableRow>
            ) : (
              categoryIds.map((catId) => {
                const category = categories.find((c) => c.id === catId);
                const catPrices = groupedPrices[catId];

                return (
                  <Fragment key={catId}>
                    <TableRow sx={categoryRowStyles}>
                      <TableCell colSpan={3} sx={categoryCellStyles}>
                        <Typography variant="caption" sx={categoryTitleStyles}>
                          {category
                            ? `${category.description} (${category.code})`
                            : `Category ID: ${catId}`}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {catPrices.map((price, idx) => (
                      <TableRow key={price.id} sx={priceRowStyles}>
                        <TableCell sx={rangeCellStyles}>
                          Range {idx + 1}
                        </TableCell>
                        <TableCell>
                          <Typography sx={monoTextStyles}>
                            {price.quantityFrom.toFixed(3)} Kg
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={rateTextStyles}>
                            ₹{price.rate.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HeadLoadActivePricesTable;
