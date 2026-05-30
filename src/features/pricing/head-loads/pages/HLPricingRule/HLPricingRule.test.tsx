import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HLPricingRulePage from "./HLPricingRule";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as categoryHooks from "../../../../../shared/api/pricing/head-load/head-load-category.hooks";
import * as priceHooks from "../../../../../shared/api/pricing/head-load/head-load-price.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";

// Mock the hooks and store
vi.mock("../../../../../shared/api/pricing/head-load/head-load-category.hooks");
vi.mock("../../../../../shared/api/pricing/head-load/head-load-price.hooks");
vi.mock("../../../../../shared/store/useNotificationStore");

const renderWithProviders = (ui: React.ReactElement, categoryId = "1") => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/${categoryId}/pricing`]}>
        <Routes>
          <Route path="/:categoryId/pricing" element={ui} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe("HLPricingRulePage", () => {
  const mockShowNotification = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNotificationStore as any).mockReturnValue({
      showNotification: mockShowNotification,
    });
  });

  it("renders loader when loading prices", () => {
    (categoryHooks.useGetHeadLoadCategories as any).mockReturnValue({ data: [] });
    (priceHooks.useGetHeadLoadPrices as any).mockReturnValue({ data: [], isLoading: true });
    (priceHooks.useCreateHeadLoadPrice as any).mockReturnValue({ mutate: vi.fn(), isPending: false });

    renderWithProviders(<HLPricingRulePage />);
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

  it("renders the page with category info and forms", () => {
    const mockCategory = { id: 1, code: "C1", description: "Category 1", active: true };
    (categoryHooks.useGetHeadLoadCategories as any).mockReturnValue({ data: [mockCategory] });
    (priceHooks.useGetHeadLoadPrices as any).mockReturnValue({ data: [], isLoading: false });
    (priceHooks.useCreateHeadLoadPrice as any).mockReturnValue({ mutate: vi.fn(), isPending: false });

    renderWithProviders(<HLPricingRulePage />);

    expect(screen.getByText("Category 1 (C1)")).toBeDefined();
    // Use getAllByText as it appears in title and button
    expect(screen.getAllByText("Add Price Range")).toHaveLength(2);
    expect(screen.getByText("Pricing History")).toBeDefined();
  });

  it("handles form submission and shows confirmation modal", async () => {
    const mockCategory = { id: 1, code: "C1", description: "Category 1", active: true };
    const mockMutate = vi.fn();
    
    (categoryHooks.useGetHeadLoadCategories as any).mockReturnValue({ data: [mockCategory] });
    (priceHooks.useGetHeadLoadPrices as any).mockReturnValue({ data: [], isLoading: false });
    (priceHooks.useCreateHeadLoadPrice as any).mockReturnValue({ mutate: mockMutate, isPending: false });

    renderWithProviders(<HLPricingRulePage />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/Qty From \(Kg\)/i), { target: { value: "5.5" } });
    fireEvent.change(screen.getByLabelText(/Rate \(₹\)/i), { target: { value: "12.5" } });
    
    // Click Add
    fireEvent.click(screen.getByRole("button", { name: /Add Price Range/i }));

    // Check modal
    expect(screen.getByText(/Confirm Price Range/i)).toBeDefined();
    expect(screen.getByText(/5.500 Kg/i)).toBeDefined();
    expect(screen.getByText(/₹12.50/i)).toBeDefined();

    // Confirm
    fireEvent.click(screen.getByRole("button", { name: /^Confirm$/i }));

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        headLoadCategoryId: 1,
        quantityFrom: 5.5,
        rate: 12.5,
      }),
      expect.any(Object)
    );
  });
});
