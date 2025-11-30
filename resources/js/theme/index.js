import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

export const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
};

// Tema personalizado para página de clasificados
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      lighter: "#D1E9FF",
      light: "#74CAFF",
      main: "#1976D2",
      dark: "#0C53B7",
      darker: "#04297A",
      contrastText: "#FFFFFF",
    },
    secondary: {
      lighter: "#FFE7D9",
      light: "#FFA48D",
      main: "#FF5722",
      dark: "#B72136",
      darker: "#7A0C2E",
      contrastText: "#FFFFFF",
    },
    error: {
      lighter: "#FFE9D5",
      light: "#FFAC82",
      main: "#F44336",
      dark: "#D32F2F",
      darker: "#C62828",
      contrastText: "#fff",
    },
    warning: {
      lighter: "#FFF5CC",
      light: "#FFD666",
      main: "#FFC107",
      dark: "#FFA000",
      darker: "#FF6F00",
      contrastText: GREY[800],
    },
    success: {
      lighter: "#C8FAD6",
      light: "#5BE49B",
      main: "#00C853",
      dark: "#007B55",
      darker: "#005249",
      contrastText: "#fff",
    },
    info: {
      lighter: "#CAFDF5",
      light: "#61F3F3",
      main: "#00B8D9",
      dark: "#006C9C",
      darker: "#003768",
      contrastText: "#fff",
    },
    background: {
      paper: "#FFFFFF",
      default: "#F5F7FA",
      neutral: "#F9FAFB",
      surface: "#FFFFFF",
    },
    text: {
      primary: "#212B36",
      secondary: "#637381",
      disabled: "#919EAB",
    },
    divider: "rgba(145, 158, 171, 0.24)",
  },
  shape: {
    borderRadius: 12, // redondeo general de cards, botones y inputs
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600, fontSize: "32px" },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontSize: "16px" },
    body2: { fontSize: "14px" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: "white",
          color: "black",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: 12,
          boxShadow:
            "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          padding: "12px 6px",
        },
      },
    },
  },
});
