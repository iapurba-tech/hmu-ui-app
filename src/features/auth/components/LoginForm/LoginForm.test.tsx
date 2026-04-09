import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginForm from "./LoginForm";
import { useLoginMutation } from "../../../../shared/api/auth/auth.hooks";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useLoginMutation
vi.mock("../../../../shared/api/auth/auth.hooks", () => ({
  useLoginMutation: vi.fn(),
}));

describe("LoginForm", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoginMutation as any).mockReturnValue({
      mutate: mockLogin,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it("should render the login form with all fields", () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username or Email/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter your password/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  it("should toggle password visibility", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText(
      /Enter your password/i,
    ) as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    const toggleButton = screen.getByRole("button", {
      name: /toggle password visibility/i,
    });
    await user.click(toggleButton);
    expect(passwordInput.type).toBe("text");

    await user.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  it("should call login mutation on submission", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByPlaceholderText(
      /Enter your username or email/i,
    );
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByRole("button", { name: /Log In/i });

    await user.type(usernameInput, "admin");
    await user.type(passwordInput, "password");
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { usernameOrEmail: "admin", password: "password" },
        expect.any(Object),
      );
    });
  });

  it("should navigate to dashboard on successful login", async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation((_data, options) => {
      options?.onSuccess?.();
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByPlaceholderText(
      /Enter your username or email/i,
    );
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByRole("button", { name: /Log In/i });

    await user.type(usernameInput, "admin");
    await user.type(passwordInput, "password");
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should show loading state when mutation is pending", () => {
    (useLoginMutation as any).mockReturnValue({
      mutate: mockLogin,
      isPending: true,
      isError: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeDisabled();
    expect(
      screen.getByPlaceholderText(/Enter your username or email/i),
    ).toBeDisabled();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeDisabled();
  });

  it("should show error message when login fails", () => {
    (useLoginMutation as any).mockReturnValue({
      mutate: mockLogin,
      isPending: false,
      isError: true,
      error: new Error("Invalid credentials"),
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it("should not call login if fields are empty", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /Log In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Username or Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });
});
