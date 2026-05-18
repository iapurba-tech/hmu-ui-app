import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  breadcrumbStyles,
  breadcrumbItemStyles,
  activeBreadcrumbStyles,
} from "./HmuBreadcrumb.styles";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface HmuBreadcrumbProps {
  items: BreadcrumbItem[];
}

const HmuBreadcrumb: React.FC<HmuBreadcrumbProps> = ({ items }) => {
  return (
    <Box sx={breadcrumbStyles}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast || !item.path) {
            return (
              <Typography key={item.label} sx={activeBreadcrumbStyles}>
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={item.label}
              component={RouterLink}
              to={item.path}
              sx={breadcrumbItemStyles}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default HmuBreadcrumb;
