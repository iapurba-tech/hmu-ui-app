import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HeadLoadSummaryPage from "./HLSummary";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { MemoryRouter } from "react-router-dom";
import * as categoryHooks from "../../../../../shared/api/pricing/head-load/head-load-category.hooks";
import * as priceHooks from "../../../../../shared/api/pricing/head-load/head-load-price.hooks";

// Mock the hooks
vi.mock("../../../../../shared/api/pricing/head-load/head-load-category.hooks");
vi.mock("../../../../../shared/api/pricing/head-load/head-load-price.hooks");

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>,
  );
};

describe("HeadLoadSummaryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (categoryHooks.useDeleteHeadLoadCategory as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (categoryHooks.useUpdateHeadLoadCategory as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    (categoryHooks.useCreateHeadLoadCategory as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("renders the page with title and components", () => {
    (categoryHooks.useGetHeadLoadCategories as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (priceHooks.useGetHeadLoadPrices as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderWithProviders(<HeadLoadSummaryPage />);

    expect(screen.getByText("Head Load Management")).toBeDefined();
    expect(
      screen.getByText(
        "Manage categories and view active range-based pricing.",
      ),
    ).toBeDefined();
    expect(screen.getByText("Head Load Categories")).toBeDefined();
    expect(screen.getByText("Active Price Ranges")).toBeDefined();
  });

  it("passes data to sub-components", () => {
    const mockCategories = [
      { id: 1, code: "C1", description: "Category 1", active: true },
    ];
    const mockPrices = [
      {
        id: "1",
        headLoadCategoryId: 1,
        quantityFrom: 0,
        rate: 10,
        status: "ACTIVE",
        effectiveFrom: "2024-01-01",
        effectiveTo: null,
      },
    ];

    (categoryHooks.useGetHeadLoadCategories as any).mockReturnValue({
      data: mockCategories,
      isLoading: false,
    });
    (priceHooks.useGetHeadLoadPrices as any).mockReturnValue({
      data: mockPrices,
      isLoading: false,
    });

    renderWithProviders(<HeadLoadSummaryPage />);

    expect(screen.getByText("Category 1")).toBeDefined();
    expect(screen.getByText("Category 1 (C1)")).toBeDefined();
    expect(screen.getByText("₹10.00")).toBeDefined();
  });
});
