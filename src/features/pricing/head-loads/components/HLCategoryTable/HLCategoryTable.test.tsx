import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HeadLoadCategoriesTable from "./HLCategoryTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { BrowserRouter } from "react-router-dom";

// Mock the hooks
vi.mock(
  "../../../../../../shared/api/pricing/head-load-category/head-load-category.hooks",
  () => ({
    useDeleteHeadLoadCategory: vi.fn(() => ({
      mutate: vi.fn(),
      isPending: false,
    })),
    useUpdateHeadLoadCategory: vi.fn(() => ({
      mutate: vi.fn(),
      isPending: false,
    })),
    useCreateHeadLoadCategory: vi.fn(() => ({
      mutate: vi.fn(),
      isPending: false,
    })),
  }),
);

vi.mock("../../../../../../shared/store/useNotificationStore", () => ({
  useNotificationStore: vi.fn(() => ({ showNotification: vi.fn() })),
}));

const mockCategories = [
  { id: 1, code: "CAT1", description: "Category 1", active: true },
  { id: 2, code: "CAT2", description: "Category 2", active: false },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </BrowserRouter>,
  );
};

describe("HeadLoadCategoriesTable", () => {
  it("renders the table with categories", () => {
    renderWithProviders(
      <HeadLoadCategoriesTable categories={mockCategories} isLoading={false} />,
    );

    expect(screen.getByText("CAT1")).toBeDefined();
    expect(screen.getByText("Category 1")).toBeDefined();
    expect(screen.getByText("CAT2")).toBeDefined();
    expect(screen.getByText("Category 2")).toBeDefined();
  });

  it("displays the status column and chips", () => {
    renderWithProviders(
      <HeadLoadCategoriesTable categories={mockCategories} isLoading={false} />,
    );

    // This should fail initially as we haven't added the Status column header
    expect(screen.getByText("Status")).toBeDefined();

    // Check for Active and Inactive chips
    expect(screen.getByText("Active")).toBeDefined();
    expect(screen.getByText("Inactive")).toBeDefined();
  });
});
