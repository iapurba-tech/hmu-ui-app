import type { SxProps, Theme } from "@mui/material";


export const DRAWER_WIDTH = 280;

export const layoutContainerStyles: SxProps<Theme> = {
  display: 'flex',
};

export const mainContentStyles = (isSidebarOpen: boolean): SxProps<Theme> => ({
  flexGrow: 1,
  p: { xs: 3, md: 3, lg: 3 },
  width: { lg: isSidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
  ml: { lg: isSidebarOpen ? 0 : `-${DRAWER_WIDTH}px` },
  minHeight: '100vh',
  transition: (theme) =>
    theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
});

export const toolbarStyles: SxProps<Theme> = {
  height: 72,
};
