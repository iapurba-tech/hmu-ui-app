import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useLayoutStore } from '../../shared/store/useLayoutStore';
import { Sidebar, TopNav } from '../components';
import { layoutContainerStyles, mainContentStyles, toolbarStyles } from './MainLayout.styles';

const MainLayout: React.FC = () => {
  const { isSidebarOpen } = useLayoutStore();

  return (
    <Box sx={layoutContainerStyles}>
      <TopNav />
      <Sidebar />
      <Box
        component="main"
        role="main"
        sx={mainContentStyles(isSidebarOpen)}
      >
        <Toolbar sx={toolbarStyles} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
