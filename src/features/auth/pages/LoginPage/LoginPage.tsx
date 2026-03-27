import React from "react";
import { Grid, Paper } from "@mui/material";
import { BrandingPanel, LoginForm } from "../../components";
import { useDocumentTitle } from "../../../../shared/hooks/useDocumentTitle";

const LoginPage: React.FC = () => {
  useDocumentTitle();

  return (
    <Grid container component="main" sx={{ minHeight: "100vh" }}>
      <Grid
        size={{ xs: 0, sm: 6 }}
        sx={{
          display: { xs: "none", sm: "flex" },
        }}
      >
        <BrandingPanel />
      </Grid>
      <Grid
        size={{ xs: 12, sm: 6 }}
        component={Paper}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <LoginForm />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
