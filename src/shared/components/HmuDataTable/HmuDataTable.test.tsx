import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HmuDataTable, { Column } from "./HmuDataTable";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../shared/theme/theme";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

interface TestData {
  id: number;
  name: string;
  age: number;
}

describe("HmuDataTable", () => {
  const columns: Column<TestData>[] = [
    { id: "name", label: "Name", sortable: true },
    { id: "age", label: "Age" },
  ];

  const data: TestData[] = [
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 },
  ];

  it("renders table headers correctly", () => {
    renderWithTheme(
      <HmuDataTable
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
      />
    );
    expect(screen.getByText("Name")).toBeDefined();
    expect(screen.getByText("Age")).toBeDefined();
  });

  it("renders table data correctly", () => {
    renderWithTheme(
      <HmuDataTable
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
      />
    );
    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("30")).toBeDefined();
    expect(screen.getByText("Jane Smith")).toBeDefined();
    expect(screen.getByText("25")).toBeDefined();
  });

  it("shows loader when loading is true", () => {
    renderWithTheme(
      <HmuDataTable
        columns={columns}
        data={[]}
        keyExtractor={(row) => row.id}
        loading={true}
      />
    );
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

  it("shows empty message when no data", () => {
    renderWithTheme(
      <HmuDataTable
        columns={columns}
        data={[]}
        keyExtractor={(row) => row.id}
        emptyMessage="No results found"
      />
    );
    expect(screen.getByText("No results found")).toBeDefined();
  });

  it("calls onSort when a sortable header is clicked", () => {
    const onSort = vi.fn();
    renderWithTheme(
      <HmuDataTable
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
        sorting={{ orderBy: "name", order: "asc", onSort }}
      />
    );

    const nameHeader = screen.getByText("Name");
    fireEvent.click(nameHeader);
    expect(onSort).toHaveBeenCalledWith("name");
  });

  it("renders pagination and handles page change", () => {
    const onPageChange = vi.fn();
    renderWithTheme(
      <HmuDataTable
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
        pagination={{
          page: 0,
          rowsPerPage: 5,
          totalRows: 10,
          onPageChange,
          onRowsPerPageChange: vi.fn(),
        }}
      />
    );

    // Using partial match because text is split by spans
    expect(screen.getByText(/Showing/)).toBeDefined();
    expect(screen.getByText(/1-5/)).toBeDefined();
    // Using getAllByText because '10' might be in the select options too
    expect(screen.getAllByText(/10/).length).toBeGreaterThan(0);
    
    // Test for the page 2 button
    const page2Button = screen.getByText("2");
    fireEvent.click(page2Button);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
