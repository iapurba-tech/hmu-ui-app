import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PricingRuleCard from "./PricingRuleCard";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../../shared/theme";
import { BrowserRouter } from "react-router-dom";
import * as pricingHooks from "../../../../../shared/api/pricing/rule/pricing-rule.hooks";

// Mock hooks
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../../../shared/api/pricing/rule/pricing-rule.hooks", () => ({
  useGetPricingRules: vi.fn(),
  useCreatePricingRule: vi.fn(),
}));

vi.mock("../../../../../shared/store/useNotificationStore", () => ({
  useNotificationStore: vi.fn(() => ({ showNotification: vi.fn() })),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </BrowserRouter>,
  );
};

describe("PricingRuleCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(pricingHooks.useGetPricingRules).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);
    vi.mocked(pricingHooks.useCreatePricingRule).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any);
  });

  it("renders with title and default rate", () => {
    renderWithProviders(<PricingRuleCard type="FAT" title="FAT rate" />);

    expect(screen.getByText("FAT rate")).toBeDefined();
    expect(screen.getByText("₹")).toBeDefined();
    expect(screen.getByText("0.00")).toBeDefined();
  });

  it("navigates to details page on click when not editing", () => {
    renderWithProviders(<PricingRuleCard type="FAT" title="FAT rate" />);

    fireEvent.click(screen.getByText("FAT rate"));
    expect(mockNavigate).toHaveBeenCalledWith("fat");
  });

  it("shows current rate when rules are provided", () => {
    vi.mocked(pricingHooks.useGetPricingRules).mockReturnValue({
      data: [
        { id: "1", rate: 45.5, effectiveFrom: "2024-01-01", status: "ACTIVE" },
      ],
      isLoading: false,
    } as any);

    renderWithProviders(<PricingRuleCard type="FAT" title="FAT rate" />);
    expect(screen.getByText("45.50")).toBeDefined();
  });

  it("enters edit mode when add button is clicked", () => {
    renderWithProviders(<PricingRuleCard type="FAT" title="FAT rate" />);

    const addButton = screen.getByRole("button", { name: /set initial rate/i });
    fireEvent.click(addButton);

    expect(screen.getByText("Quick Update")).toBeDefined();
    expect(screen.getByLabelText(/rate/i)).toBeDefined();
    expect(screen.getByText("Save")).toBeDefined();
    expect(screen.getByText("Cancel")).toBeDefined();
  });

  it("cancels edit mode", () => {
    renderWithProviders(<PricingRuleCard type="FAT" title="FAT rate" />);

    fireEvent.click(screen.getByRole("button", { name: /set initial rate/i }));
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByText("Quick Update")).toBeNull();
  });
});
