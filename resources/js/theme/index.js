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

// Set de sombras modernas para diseño limpio y profesional
const shadows = [
  "none", // 0
  "0px 1px 2px 0px rgba(0, 0, 0, 0.05)", // 1 - sombra muy sutil
  "0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)", // 2 - sombra ligera
  "0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)", // 3 - sombra suave
  "0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)", // 4 - sombra media
  "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)", // 5
  "0px 12px 20px -5px rgba(0, 0, 0, 0.12), 0px 5px 8px -3px rgba(0, 0, 0, 0.08)", // 6
  "0px 14px 25px -5px rgba(0, 0, 0, 0.1), 0px 6px 10px -3px rgba(0, 0, 0, 0.06)", // 7
  "0px 16px 30px -6px rgba(0, 0, 0, 0.12), 0px 8px 15px -5px rgba(0, 0, 0, 0.08)", // 8 - sombra pronunciada
  "0px 18px 35px -8px rgba(0, 0, 0, 0.14), 0px 10px 20px -5px rgba(0, 0, 0, 0.1)", // 9
  "0px 20px 40px -8px rgba(0, 0, 0, 0.15), 0px 12px 25px -6px rgba(0, 0, 0, 0.1)", // 10
  "0px 22px 45px -10px rgba(0, 0, 0, 0.16), 0px 14px 30px -7px rgba(0, 0, 0, 0.12)", // 11
  "0px 24px 50px -12px rgba(0, 0, 0, 0.18), 0px 16px 35px -8px rgba(0, 0, 0, 0.14)", // 12 - sombra fuerte
  "0px 26px 55px -12px rgba(0, 0, 0, 0.2), 0px 18px 40px -9px rgba(0, 0, 0, 0.15)", // 13
  "0px 28px 60px -14px rgba(0, 0, 0, 0.22), 0px 20px 45px -10px rgba(0, 0, 0, 0.16)", // 14
  "0px 30px 65px -14px rgba(0, 0, 0, 0.24), 0px 22px 50px -11px rgba(0, 0, 0, 0.18)", // 15
  "0px 32px 70px -16px rgba(0, 0, 0, 0.26), 0px 24px 55px -12px rgba(0, 0, 0, 0.2)", // 16 - sombra muy pronunciada
  "0px 34px 75px -16px rgba(0, 0, 0, 0.28), 0px 26px 60px -13px rgba(0, 0, 0, 0.22)", // 17
  "0px 36px 80px -18px rgba(0, 0, 0, 0.3), 0px 28px 65px -14px rgba(0, 0, 0, 0.24)", // 18
  "0px 38px 85px -18px rgba(0, 0, 0, 0.32), 0px 30px 70px -15px rgba(0, 0, 0, 0.26)", // 19
  "0px 40px 90px -20px rgba(0, 0, 0, 0.34), 0px 32px 75px -16px rgba(0, 0, 0, 0.28)", // 20
  "0px 42px 95px -20px rgba(0, 0, 0, 0.36), 0px 34px 80px -17px rgba(0, 0, 0, 0.3)", // 21
  "0px 44px 100px -22px rgba(0, 0, 0, 0.38), 0px 36px 85px -18px rgba(0, 0, 0, 0.32)", // 22
  "0px 46px 105px -22px rgba(0, 0, 0, 0.4), 0px 38px 90px -19px rgba(0, 0, 0, 0.34)", // 23
  "0px 48px 110px -24px rgba(0, 0, 0, 0.42), 0px 40px 95px -20px rgba(0, 0, 0, 0.36)", // 24 - sombra máxima
];

// Tema personalizado para página de clasificados
export const theme = createTheme({
  shadows,
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
    fontFamily: ["Roboto", "sans-serif"].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600, fontSize: "32px" },
    h3: { fontWeight: 600, fontSize: "24px" },
    h4: { fontWeight: 400, fontSize: "18px" },
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
          padding: 16,
          // Usando shadow[3] del sistema para un efecto suave y moderno
          boxShadow: shadows[8],
          transition: "box-shadow 0.3s ease-in-out",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 16px",

          transition: "all 0.2s ease-in-out",
          "&:hover": {},
          "&:active": {},
        },
        contained: {
          boxShadow: shadows[4],
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          padding: "8px 12px",
          minHeight: "auto",
        },
      },
    },
  },
});
