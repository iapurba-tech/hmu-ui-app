import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../../shared/theme";
import ErrorContent from "./ErrorContent";
import { LockRounded as Lock } from "@mui/icons-material";

describe("ErrorContent Component", () => {
  const defaultProps = {
    icon: <Lock data-testid="lock-icon" />,
    title: "Error Title",
    message: "Error Message",
    onButtonClick: vi.fn(),
  };

  const renderWithTheme = (props = defaultProps) => {
    return render(
      <ThemeProvider theme={theme}>
        <ErrorContent {...props} />
      </ThemeProvider>,
    );
  };

  it("renders correctly with default props", () => {
    renderWithTheme();
    expect(screen.getByText("Error Title")).toBeInTheDocument();
    expect(screen.getByText("Error Message")).toBeInTheDocument();
    expect(screen.getByTestId("lock-icon")).toBeInTheDocument();
    // HmuButton uses the label prop
    expect(
      screen.getByRole("button", { name: /return to dashboard/i }),
    ).toBeInTheDocument();
  });

  it("calls onButtonClick when the button is clicked", () => {
    renderWithTheme();
    const button = screen.getByRole("button", { name: /return to dashboard/i });
    fireEvent.click(button);
    expect(defaultProps.onButtonClick).toHaveBeenCalledTimes(1);
  });
});
