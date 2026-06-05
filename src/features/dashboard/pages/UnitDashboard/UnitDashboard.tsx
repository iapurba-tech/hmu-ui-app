import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { useAuthStore } from "../../../../shared/store/useAuthStore";
import { useDocumentTitle } from "../../../../shared/hooks/useDocumentTitle";

const UnitDashboard: React.FC = () => {
  const { activeUnit } = useAuthStore();
  useDocumentTitle();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Unit Operations Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Currently managing: {activeUnit?.name || "No Unit Selected"} ({activeUnit?.code || "N/A"})
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Collection
              </Typography>
              <Typography variant="h5">1,250 L</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active MPCS
              </Typography>
              <Typography variant="h5">12</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Bills
              </Typography>
              <Typography variant="h5" color="warning.main">5</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Dispatch
              </Typography>
              <Typography variant="h5">850 L</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UnitDashboard;
