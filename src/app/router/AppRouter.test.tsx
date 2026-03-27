import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import AppRouter from './AppRouter';
import { useAuthStore } from '../../shared/store/useAuthStore';
import { UserRole } from '../../features/auth/constants/roles';

// 1. Mock the Zustand store
vi.mock('../../shared/store/useAuthStore');

// 2. Clean Component Mocks without CommonJS 'require'
vi.mock('../../features/auth/pages/LoginPage/LoginPage', () => ({
  default: () => <div>Login Page</div>
}));

vi.mock('../../features/error/pages/ForbiddenPage/ForbiddenPage', () => ({
  default: () => <div>Forbidden Page</div>
}));

vi.mock('../../layouts/MainLayout/MainLayout', () => ({
  default: () => (
    <div>
      Main Layout
      <Outlet /> {/* Used natively from the top-level import */}
    </div>
  )
}));

describe('AppRouter protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows SYSTEM_ADMIN to access admin routes', async () => {
    // 3. Use vi.mocked() for perfect TypeScript safety
    vi.mocked(useAuthStore).mockReturnValue({
      token: 'fake-token',
      user: { role: UserRole.SYSTEM_ADMIN },
      isInitializing: false,
    } as any); // We cast the return object to any to avoid having to mock the entire Zustand store's actions (like setToken, logout, etc.)

    render(
      <MemoryRouter initialEntries={['/admin/users']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText(/User Management \(IAM\)/i)).toBeInTheDocument();
  });

  it('redirects UNIT_ADMIN to forbidden page when accessing admin routes', async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      token: 'fake-token',
      user: { role: UserRole.UNIT_ADMIN },
      isInitializing: false,
    } as any);

    render(
      <MemoryRouter initialEntries={['/admin/users']}>
        <AppRouter />
      </MemoryRouter>
    );

    // Assert that the page blocked them and redirected to the Forbidden Page
    expect(screen.queryByText(/User Management \(IAM\)/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Forbidden Page/i)).toBeInTheDocument();
  });

  it('allows UNIT_ADMIN to access unit routes', async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      token: 'fake-token',
      user: { role: UserRole.UNIT_ADMIN },
      isInitializing: false,
    } as any);

    render(
      <MemoryRouter initialEntries={['/unit/mpcs']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText(/MPCS Master/i)).toBeInTheDocument();
  });
});