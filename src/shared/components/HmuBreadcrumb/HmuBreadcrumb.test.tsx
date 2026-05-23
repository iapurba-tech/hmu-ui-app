import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HmuBreadcrumb from "./HmuBreadcrumb";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../shared/theme";

const renderWithThemeAndRouter = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>
  );
};

describe("HmuBreadcrumb", () => {
  const items = [
    { label: "Home", path: "/" },
    { label: "Admin", path: "/admin" },
    { label: "Units" },
  ];

  it("renders all breadcrumb items", () => {
    renderWithThemeAndRouter(<HmuBreadcrumb items={items} />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Admin")).toBeDefined();
    expect(screen.getByText("Units")).toBeDefined();
  });

  it("renders links for items with paths (except the last one)", () => {
    renderWithThemeAndRouter(<HmuBreadcrumb items={items} />);
    const homeLink = screen.getByRole("link", { name: /home/i });
    const adminLink = screen.getByRole("link", { name: /admin/i });
    
    expect(homeLink.getAttribute("href")).toBe("/");
    expect(adminLink.getAttribute("href")).toBe("/admin");
  });

  it("renders the last item as text, not a link", () => {
    renderWithThemeAndRouter(<HmuBreadcrumb items={items} />);
    const unitsItem = screen.getByText("Units");
    expect(unitsItem.tagName).toBe("P"); // Typography defaults to <p>
    expect(screen.queryByRole("link", { name: /units/i })).toBeNull();
  });

  it("renders correct number of separators", () => {
    renderWithThemeAndRouter(<HmuBreadcrumb items={items} />);
    // In MUI Breadcrumbs, separators have aria-hidden="true" or are specific elements
    // We can check for the NavigateNextIcon indirectly or just trust MUI if we trust our mapping
    const separators = screen.getAllByTestId(/NavigateNext.*Icon/);
    expect(separators.length).toBe(items.length - 1);
  });
});
