import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

const currentPalette = {
  contrastBackground: "#131a21",
};

export const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#323b46",
  800: "#131d27",
  900: "#161C24",
};

// Tema personalizado para consultora industrial
export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      lighter: "#C8FACD",
      light: "#5BE584",
      main: "#00AB55",
      dark: "#007B55",
      darker: "#005249",
      contrastText: "#FFFFFF",
    },
    secondary: { main: "#1de9b6" },
    error: {
      lighter: "#FFE9D5",
      light: "#FFAC82",
      main: "rgba(229,73,35,0.97)",
      dark: "#B71D18",
      darker: "#7A0916",
      contrastText: "#fff",
    },
    warning: {
      lighter: "#FFF5CC",
      light: "#FFD666",
      main: "#FFAB00",
      dark: "#B76E00",
      darker: "#7A4100",
      contrastText: GREY[800],
    },
    success: {
      lighter: "#D8FBDE",
      light: "#86E8AB",
      main: "#36B37E",
      dark: "#1B806A",
      darker: "#0A5554",
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
      paper: GREY[800],
      default: GREY[900],
      neutral: GREY[800],
      surface: GREY[900],
    },
    text: {
      primary: "#ffffff",
      secondary: "#cbd5e1",
      disabled: "#7f8fa4",
    },
    divider: "rgba(145, 158, 171, 0.08)",
  },
  shape: {
    borderRadius: 12, // redondeo general de cards, botones y inputs
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
    h1: { fontWeight: 700, fontSize: "2rem" },
    h2: { fontWeight: 600, fontSize: "1.75rem" },
    h3: { fontWeight: 600, fontSize: "1.5rem" },
    h4: { fontWeight: 500, fontSize: "1.25rem" },
    h5: { fontWeight: 500, fontSize: "1rem" },
    h6: { fontWeight: 500, fontSize: "0.875rem" },
    body1: { fontSize: "0.9375rem" },
    body2: { fontSize: "0.8125rem" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          padding: 32,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          backdropFilter: "blur(40px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "6px 16px",
          textTransform: "none",
        },
        containedPrimary: {
          background: "primary.main",
          "&:hover": { background: "primary.main" },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#111827",
          boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0a0f1c",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          // backgroundColor: "#1e293b",
          fontSize: "0.8125rem",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: "#00c853" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          "&.Mui-selected": { color: "#00c853" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: 24,
        },
        backdrop: {
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: currentPalette.contrastBackground,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: GREY[700],
          "& .MuiTableCell-root": {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        slotProps: {
          inputLabel: ({ type }) =>
            type === "date"
              ? {
                  shrink: true,
                }
              : undefined,
          htmlInput: ({ type }) =>
            type === "date"
              ? {
                  sx: {
                    "&::-webkit-calendar-picker-indicator": {
                      filter: "invert(1)",
                      cursor: "pointer",
                    },
                  },
                }
              : undefined,
        },
      },
    },
  },
});
