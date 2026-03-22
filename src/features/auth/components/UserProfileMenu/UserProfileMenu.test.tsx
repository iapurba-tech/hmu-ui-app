import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfileMenu from './UserProfileMenu';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

const mockUser = {
  fullName: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  role: 'Administrator',
};

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('UserProfileMenu', () => {
  const defaultProps = {
    anchorEl: document.createElement('div'),
    open: true,
    onClose: vi.fn(),
    onSettingsClick: vi.fn(),
    onLogoutClick: vi.fn(),
    user: mockUser,
  };

  it('renders user information correctly', () => {
    renderWithTheme(<UserProfileMenu {...defaultProps} />);
    
    expect(screen.getByText(mockUser.fullName)).toBeInTheDocument();
    expect(screen.getByText(`@${mockUser.username}`)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(mockUser.role)).toBeInTheDocument();
  });

  it('calls onSettingsClick when settings icon is clicked', () => {
    renderWithTheme(<UserProfileMenu {...defaultProps} />);
    
    // There are multiple settings icons (header and menu item)
    const settingsButtons = screen.getAllByRole('button');
    // The first one is the icon button in the header
    fireEvent.click(settingsButtons[0]);
    
    expect(defaultProps.onSettingsClick).toHaveBeenCalled();
  });

  it('calls onSettingsClick when My Profile is clicked', () => {
    renderWithTheme(<UserProfileMenu {...defaultProps} />);
    
    fireEvent.click(screen.getByText('My Profile'));
    expect(defaultProps.onSettingsClick).toHaveBeenCalled();
  });

  it('calls onLogoutClick when Sign Out is clicked', () => {
    renderWithTheme(<UserProfileMenu {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Sign Out'));
    expect(defaultProps.onLogoutClick).toHaveBeenCalled();
  });
});
