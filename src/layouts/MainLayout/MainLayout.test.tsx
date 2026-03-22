import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import MainLayout from './MainLayout'
import { useLayoutStore } from '../../shared/store/useLayoutStore'

describe('RootLayout', () => {
  beforeEach(() => {
    // Reset store state before each test
    useLayoutStore.getState().setSidebarOpen(true)
  })

  it('should render the Top Navigation and Sidebar', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    // Changed to match current TopNav text
    expect(screen.getByText(/Unit Management Portal/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search data, units or users/i)).toBeInTheDocument()
    expect(screen.getByText(/System Health/i)).toBeInTheDocument()
  })

  it('should toggle the sidebar when the menu button is clicked', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    )

    const menuButton = screen.getByLabelText(/open drawer/i)
    
    // Initial state: Sidebar open
    expect(useLayoutStore.getState().isSidebarOpen).toBe(true)
    
    // Click to toggle (Close)
    await user.click(menuButton)
    expect(useLayoutStore.getState().isSidebarOpen).toBe(false)

    // Click to toggle (Open)
    await user.click(menuButton)
    expect(useLayoutStore.getState().isSidebarOpen).toBe(true)
  })
})
