"use client";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  SwipeableDrawer as MuiSwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export interface SwipeableDrawerProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  children: React.ReactNode;
}

export function SwipeableDrawer(props: SwipeableDrawerProps) {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <MuiSwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      PaperProps={{
        style: {
          borderRadius: "20px",
          boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.3)",
        },
      }}
      ModalProps={{
        sx: {
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          },
        },
      }}
      anchor="bottom"
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
    >
      <Box
        sx={{
          /**
           * 100vh issue in Safari (Fix for Viewport Height on Mobile devices)
           * https://www.youtube.com/watch?v=Wet2WECg0oM
           */
          height: "98svh",
        }}
      >
        <AppBar>
          <Toolbar
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={props.onClose}
              color="inherit"
              sx={{
                textTransform: "none",
              }}
            >
              Cancel
            </Button>

            <Typography
              variant="h6"
              sx={{ fontSize: "1rem", fontWeight: "600" }}
            >
              {props.title}
            </Typography>
            <IconButton aria-label="info">
              <InfoIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            padding: "0px 10px",
          }}
        >
          {props.children}
        </Box>
      </Box>
    </MuiSwipeableDrawer>
  );
}
