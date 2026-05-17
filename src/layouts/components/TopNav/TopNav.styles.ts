import { styled, alpha, type SxProps, type Theme } from "@mui/material/styles";
import { InputBase } from "@mui/material";
import { DRAWER_WIDTH } from "../../MainLayout/MainLayout.styles";

export const appBarStyles = (isSidebarOpen: boolean): SxProps<Theme> => ({
  width: { lg: isSidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%" },
  ml: { lg: isSidebarOpen ? `${DRAWER_WIDTH}px` : 0 },
  bgcolor: "background.paper",
  color: "text.primary",
  boxShadow: "none",
  borderBottom: "1px solid",
  borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
  backdropFilter: "blur(8px)",
  transition: (theme: Theme) =>
    theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
});

export const SearchBox = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
    minWidth: "300px",
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    fontSize: "0.875rem",
  },
}));
