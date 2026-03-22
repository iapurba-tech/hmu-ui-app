import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import TopNav from '../components/TopNav/TopNav';
import { useLayoutStore } from '../../shared/store/useLayoutStore';
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
