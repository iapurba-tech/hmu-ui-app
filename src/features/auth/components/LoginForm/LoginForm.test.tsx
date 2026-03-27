import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from './LoginForm';
import { useLoginMutation } from '../../../../shared/api/auth/auth.hooks';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useLoginMutation
vi.mock('../../../../shared/api/auth/auth.hooks', () => ({
  useLoginMutation: vi.fn(),
}));

describe('LoginForm', () => {
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

  it('should render the login form with all fields', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username or Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  it('should toggle password visibility', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('should call login mutation on submission', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Enter your username or email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByRole('button', { name: /Log In/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith(
      { username: 'admin', password: 'password' },
      expect.any(Object)
    );
  });

  it('should navigate to dashboard on successful login', async () => {
    mockLogin.mockImplementation((_data, options) => {
      options?.onSuccess?.();
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Enter your username or email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByRole('button', { name: /Log In/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should show loading state when mutation is pending', () => {
    (useLoginMutation as any).mockReturnValue({
      mutate: mockLogin,
      isPending: true,
      isError: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeDisabled();
    expect(screen.getByPlaceholderText(/Enter your username or email/i)).toBeDisabled();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeDisabled();
  });

  it('should show error message when login fails', () => {
    (useLoginMutation as any).mockReturnValue({
      mutate: mockLogin,
      isPending: false,
      isError: true,
      error: new Error('Invalid credentials'),
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it('should not call login if fields are empty', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

    expect(mockLogin).not.toHaveBeenCalled();
  });
});
