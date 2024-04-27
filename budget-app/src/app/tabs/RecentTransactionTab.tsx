"use client";
import { catchResponseMessage } from "@/global/catchResponse";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TransactionList } from "../components/TransactionList";
import { InferRouteResponse } from "@/types";
import * as Transaction from "@/app/api/transaction/route";
import { Alert, Box, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { SwipeableDrawer } from "./components/SwipeableDrawer";
import { TransactionDataContainer } from "./TransactionDataContainer";

export type TransactionGetResponse = InferRouteResponse<typeof Transaction.GET>;

export function RecentTransactionTab() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editTransactionId, setEditTransactionId] = useState<
    string | undefined
  >(undefined);
  const transactionList = useQuery<TransactionGetResponse>({
    queryKey: ["transactionList"],
    queryFn: () =>
      axios
        .get("/api/transaction")
        .then((res) => res.data)
        .catch(catchResponseMessage),
  });

  useGlobalLoading(transactionList.isPending);

  if (transactionList.isError) {
    return (
      <Alert severity="error">Error: {transactionList.error?.message}</Alert>
    );
  }

  return (
    <div>
      <SwipeableDrawer
        title="Edit Transaction"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
      >
        <TransactionDataContainer
          action="edit"
          id={editTransactionId}
          onSaveSuccess={() => {
            setIsDrawerOpen(false);
            // Refetch the transaction list, use this until we have a better solution
            // Consider to refetch in realtime
            transactionList.refetch();
          }}
        />
      </SwipeableDrawer>
      <TransactionList
        data={transactionList.data?.data ?? []}
        onClickAction={(id) => {
          setEditTransactionId(id);
          setIsDrawerOpen(true);
        }}
      />
    </div>
  );
}
