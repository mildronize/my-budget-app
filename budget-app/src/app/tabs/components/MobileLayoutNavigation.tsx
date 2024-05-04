"use client";
import type * as React from "react";
import { useRouter } from "next/navigation";
import MuiBottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {
  AppBar,
  Badge,
  Box,
  Container,
  LinearProgress,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AddTransactionTab } from "../AddTransactionTab";
import { SwipeableDrawer } from "./SwipeableDrawer";
import { useGlobalLoadingStore } from "@/store";
import { SettingIconWithStatusBadge } from "./SettingIconWithStatusBadge";
import { LocalStorage } from "@/libs/local-storage";
import { SettingTab } from "../SettingTab";
import { RecentTransactionTab } from "../RecentTransactionTab";
import { BudgetDataContainer } from "@/app/budget/BudgetDataContainer";
import dayjs from "dayjs";

const routerMap: {
  label: string;
  icon: React.ReactNode;
  path: string;
  content?: React.ReactNode;
  title: string;
}[] = [
  {
    label: "Budget",
    icon: <PaymentsIcon />,
    path: "/",
    title: dayjs().format("MMM YYYY"),
    content: <BudgetDataContainer />,
  },
  {
    label: "Accounts",
    icon: <AccountBalanceIcon />,
    path: "/accounts",
    title: "Accounts",
    content: <>TBA</>,
  },
  {
    label: "Transaction",
    icon: <AddCircleRoundedIcon />,
    path: "/transaction/add",
    title: "Add Transaction",
  },
  {
    label: "Recent",
    icon: <RestoreIcon />,
    path: "/transaction",
    title: "Recent Transactions",
    content: <RecentTransactionTab />,
  },
  {
    label: "System",
    icon: <SettingIconWithStatusBadge />,
    title: "System",
    path: "/settings",
    content: <SettingTab />,
  },
];

export interface MobileLayoutNavigationProps {
  /**
   * Override the title of the BottomNavigation
   */
  title?: React.ReactNode;
  // children?: React.ReactNode;
  // currentRouterKey: number;
  disableOverflow?: boolean;
}
export function MobileLayoutNavigation(props: MobileLayoutNavigationProps) {
  const theme = useTheme();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const tabStorage = new LocalStorage("currentTab", "0");

  useEffect(() => {
    setCurrentTab(Number(tabStorage.get()) || 0);
    console.log(tabStorage.get());
  }, []);

  const isLoading = useGlobalLoadingStore((state) => state.isLoading);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function handleBottomNavigation(value: number) {
    setCurrentTab(value);
    tabStorage.set(value + "");
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        /**
         * 100vh issue in Safari (Fix for Viewport Height on Mobile devices)
         * https://www.youtube.com/watch?v=Wet2WECg0oM
         */
        height: "100svh" /* Full height to the container */,
        overflow: "hidden",
      }}
    >
      {isLoading ? (
        <Box
          sx={{ position: "fixed", top: 0, right: 0, left: 0, zIndex: 3000 }}
        >
          <LinearProgress />
        </Box>
      ) : null}
      <AppBar
        sx={{
          backgroundColor: "white",
          overflow: "hidden",
          marginBottom: 0,
          height: `${theme.global.appBar.height}px`,
          zIndex: 900,
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          {typeof props.title === "string" || props.title === undefined ? (
            <Typography
              variant="h6"
              sx={{ fontSize: "0.9rem", fontWeight: "600" }}
            >
              {props.title ?? routerMap[currentTab].title}
            </Typography>
          ) : (
            props.title
          )}
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{
          /**
           * Allow overflow for the content
           */
          ...(props.disableOverflow ? { overflow: "hidden" } : {}),
          // Margin due to the fixed AppBar
          // marginTop: "80px",
          flex: 1 /* Takes up remaining space */,
          overflowX: "hidden",
          paddingLeft: "0px",
          paddingRight: "0px",
        }}
      >
        {routerMap[currentTab].content}
        <SwipeableDrawer
          title="Add Transaction"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onOpen={() => setIsDrawerOpen(true)}
        >
          <AddTransactionTab
            action="add"
            onSaveSuccess={() => setIsDrawerOpen(false)}
          />
        </SwipeableDrawer>
      </Container>
      <Paper
        // sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 80 }}
        elevation={3}
      >
        <MuiBottomNavigation
          showLabels
          /**
           * Fix Height for PWA on iOS
           */
          sx={{
            height: `${theme.global.bottomNavigation.height}px`,
            paddingBottom: `${theme.global.bottomNavigation.paddingBottom}px`,
          }}
          value={currentTab}
          onChange={(event, newValue: number) => {
            if (newValue === 2) {
              setIsDrawerOpen(true);
            } else {
              handleBottomNavigation(newValue);
              // router.push(routerMap[newValue].path);
            }
          }}
        >
          {routerMap.map((item, index) => (
            <BottomNavigationAction
              key={index}
              label={item.label}
              icon={item.icon}
              sx={{
                "&.Mui-selected": {
                  // Set font size for selected tab
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: "0.75rem",
                  },
                },
                "& .MuiBottomNavigationAction-label": {
                  fontSize: "0.65rem",
                  marginTop: "1px",
                },
              }}
            />
          ))}
        </MuiBottomNavigation>
      </Paper>
    </Box>
  );
}
