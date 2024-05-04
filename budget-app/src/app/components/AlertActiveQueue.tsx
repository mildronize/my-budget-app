"use client";

import { useQuery } from "@tanstack/react-query";
import type * as TransactionQueue from "@/app/api/transaction/queue/route";
import { InferRouteResponse } from "@/types";
import { Alert, Container, Skeleton } from "@mui/material";
import axios from "axios";
import { catchResponseMessage } from "@/global/catchResponse";

export type TransactionQueueGetResponse = InferRouteResponse<
  typeof TransactionQueue.GET
>;

function isActiveQueue(queueCount: number | undefined): boolean {
  return queueCount !== undefined && queueCount > 0;
}

export function AlertActiveQueue() {
  const transactionQueue = useQuery<TransactionQueueGetResponse>({
    queryKey: ["transactionQueue"],
    queryFn: () =>
      axios
        .get("/api/transaction/queue")
        .then((res) => res.data)
        .catch(catchResponseMessage),
  });

  if (transactionQueue.error) {
    return (
      <Alert severity="error">Error: {transactionQueue.error?.message}</Alert>
    );
  }

  if (transactionQueue.isLoading) {
    return <Skeleton variant="text" sx={{ fontSize: "2rem" }} />;
  }

  return (
    <>
      {isActiveQueue(transactionQueue.data?.data.transactionPoison) ? (
        <Alert severity="error">
          Number of messages in poison queue:{" "}
          {String(transactionQueue.data?.data.transactionPoison)}
        </Alert>
      ) : null}
      {isActiveQueue(transactionQueue.data?.data.longPoison) ? (
        <Alert severity="error">
          Number of messages in long poison queue:{" "}
          {String(transactionQueue.data?.data.longPoison)}
        </Alert>
      ) : null}
    </>
  );
}
