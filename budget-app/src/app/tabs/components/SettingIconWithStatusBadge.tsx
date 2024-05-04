"use client";

import { useQuery } from "@tanstack/react-query";
import type * as TransactionQueue from "@/app/api/transaction/queue/route";
import { InferRouteResponse } from "@/types";
import {
  Badge,
  Box,
  CircularProgress,
  circularProgressClasses,
  CircularProgressProps,
} from "@mui/material";
import axios from "axios";
import { catchResponseMessage } from "@/global/catchResponse";
import { useEventEmitter } from "@/hooks/useEventEmitter";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useState } from "react";
import { useSignalR } from "@/hooks/useSignalR";
import { useHealthCheck } from "@/hooks/useHealthCheck";

export type TransactionQueueGetResponse = InferRouteResponse<
  typeof TransactionQueue.GET
>;

function parseQueueCount(count: number | undefined): number {
  return count && count > 0 ? count : 0;
}

export interface CountQueueBadgeProps {
  children?: React.ReactNode;
}

export interface SimpleCircularProgressProps extends CircularProgressProps {
  options?: {
    spinnerColor?: "blue" | "red" | "orange";
  };
}

/**
 * Inspired by the former Facebook spinners.
 * Ref: https://mui.com/material-ui/react-progress/#customization
 * @param props
 * @returns
 */
function SimpleCircularProgress(props: SimpleCircularProgressProps) {
  const size = 18;
  const thickness = 5;
  const spinnerColor = props.options?.spinnerColor ?? "blue";

  if (!props.options) delete props.options;

  const spinnerColorMap = {
    blue: {
      light: "#1a90ff",
      dark: "#308fe8",
    },
    red: {
      light: "#f5222d",
      dark: "#ff4d4f",
    },
    orange: {
      light: "#fa8c16",
      dark: "#faad14",
    },
  };

  return (
    <Box sx={{ position: "relative", marginTop: "4px" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={size}
        thickness={thickness}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) =>
            theme.palette.mode === "light"
              ? spinnerColorMap[spinnerColor].light
              : spinnerColorMap[spinnerColor].dark,
          animationDuration: "700ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={size}
        thickness={thickness}
        {...props}
      />
    </Box>
  );
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface TargetIconProps {
  isLoading?: boolean;
  simpleCircularProgressProps?: SimpleCircularProgressProps;
}

export function TargetIcon(props: TargetIconProps) {
  return props.isLoading ?? false ? (
    <SimpleCircularProgress {...props.simpleCircularProgressProps} />
  ) : (
    <SettingsIcon />
  );
}

/**
 * Check whether the queue count is greater than 0.
 *
 * The icon will be displayed with a badge if the queue count is greater than 0.
 *
 * The icon will switch to a loading spinner is connecting to the server and Azure SignalR server
 * @param props
 * @returns
 */

export function SettingIconWithStatusBadge(props: CountQueueBadgeProps) {
  const [isConnectingSignalR, setIsConnectingSignalR] = useState(true);
  const [isHealthy, setIsHealthy] = useState(true);

  const getSpinnerColor = (
    isConnectingRealtime: boolean,
    isHealthy: boolean
  ) => {
    if (isConnectingRealtime) {
      return "blue";
    }
    if (!isHealthy) {
      return "red";
    }
    return "blue";
  };

  const simpleCircularProgressProps = (
    isConnectingRealtime: boolean,
    isHealthy: boolean
  ): SimpleCircularProgressProps => {
    return {
      options: {
        spinnerColor: getSpinnerColor(isConnectingRealtime, isHealthy),
      },
    };
  };

  useHealthCheck({
    interval: 5000,
    timeout: 1500,
    onSuccess: () => setIsHealthy(true),
    onError: () => setIsHealthy(false),
  });

  const signalR = useSignalR();

  useEffect(() => {
    console.log("signalR state:", signalR.state);
    setIsConnectingSignalR(signalR.isLoading);
  }, [signalR.state, signalR.isLoading]);

  const queueCount = useQuery<TransactionQueueGetResponse>({
    queryKey: ["queueCount"],
    queryFn: () =>
      axios
        .get("/api/transaction/queue")
        .then((res) => res.data)
        .catch(catchResponseMessage),
  });

  useEventEmitter({
    eventName: "queueCount",
    onReceive: async () => {
      console.log("queueCount event received");
      console.log("refetching queueCount");
      await delay(500);
      queueCount.refetch();
    },
  });

  useSignalR({
    onMessages: {
      monthlyBudgetUpdated: async () => {
        console.log("refetching queueCount, because monthlyBudgetUpdated");
        queueCount.refetch();
      },
      transactionUpdated: async () => {
        console.log("refetching queueCount, because transactionUpdated");
        queueCount.refetch();
      },
    },
  });

  if (queueCount.error) {
    return <TargetIcon isLoading={isConnectingSignalR || !isHealthy} />;
  }

  if (queueCount.isLoading) {
    return <TargetIcon isLoading={isConnectingSignalR || !isHealthy} />;
  }

  if (
    parseQueueCount(queueCount.data?.data?.transactionMain) +
      parseQueueCount(queueCount.data?.data?.longMain) ===
    0
  ) {
    return (
      <TargetIcon
        isLoading={isConnectingSignalR || !isHealthy}
        simpleCircularProgressProps={simpleCircularProgressProps(
          isConnectingSignalR,
          isHealthy
        )}
      />
    );
  }

  return (
    <Badge
      badgeContent={
        parseQueueCount(queueCount.data?.data?.transactionMain) +
        parseQueueCount(queueCount.data?.data?.longMain)
      }
      color="warning"
    >
      <TargetIcon
        isLoading={isConnectingSignalR || !isHealthy}
        simpleCircularProgressProps={simpleCircularProgressProps(
          isConnectingSignalR,
          isHealthy
        )}
      />
    </Badge>
  );
}
