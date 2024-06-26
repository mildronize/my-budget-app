"use client";
import { Figtree, Roboto, Heebo } from "next/font/google";

import { createTheme } from "@mui/material/styles";

// Figtree

const figtree = Figtree({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const heebo = Heebo({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: heebo.style.fontFamily,
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          fontFamily: heebo.style.fontFamily,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: heebo.style.fontFamily,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#60a5fa",
          }),
        }),
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: "transparent",
        position: "static",
      },
      styleOverrides: {
        root: {
          marginBottom: "30px",
          boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.3)",
          padding: "5px 0px", // Expand size of AppBar
        },
      },
    },
  },
});

export default theme;
