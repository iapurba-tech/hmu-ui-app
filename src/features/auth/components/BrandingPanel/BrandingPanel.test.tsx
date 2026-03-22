import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BrandingPanel from './BrandingPanel';
import { BRANDING_CONTENT } from '../../constants/auth-content';

describe('BrandingPanel', () => {
  it('should render the branding title, slogan, and description', () => {
    render(<BrandingPanel />);

    expect(screen.getByText(BRANDING_CONTENT.TITLE)).toBeInTheDocument();
    expect(screen.getByText(BRANDING_CONTENT.SLOGAN)).toBeInTheDocument();
    expect(screen.getByText(BRANDING_CONTENT.DESCRIPTION)).toBeInTheDocument();
  });

  it('should have a heading for the title', () => {
    render(<BrandingPanel />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(BRANDING_CONTENT.TITLE);
  });
});
