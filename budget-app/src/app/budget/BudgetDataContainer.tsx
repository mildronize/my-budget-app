"use client";
import { useQuery } from "@tanstack/react-query";
import { BudgetTab } from "./components/BudgetTab";
import { InferRouteResponse } from "@/types";
import * as Budget from "@/app/api/budget/route";
import * as BudgetSummary from "@/app/api/budget/summary/route";
import axios from "axios";
import { catchResponseMessage } from "@/global/catchResponse";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { Alert } from "@mui/material";
import { useQueryCache } from "@/hooks/useQueryCache";
import { useClient } from "@/hooks/useClient";
import { useSignalR } from "@/hooks/useSignalR";

export type BudgetGetResponse = InferRouteResponse<typeof Budget.GET>;
export type BudgetSummaryGetResponse = InferRouteResponse<
  typeof BudgetSummary.GET
>;

export interface BudgetDataContainerProps {}

export function BudgetDataContainer(props: BudgetDataContainerProps) {
  const budgetGroup = useQuery<BudgetGetResponse>({
    queryKey: ["budgetGroupGet"],
    queryFn: () =>
      axios
        .get("/api/budget")
        .then((res) => res.data)
        .catch(catchResponseMessage),
  });

  const budgetSummary = useQuery<BudgetSummaryGetResponse>({
    queryKey: ["budgetSummaryGet"],
    queryFn: () =>
      axios
        .get("/api/budget/summary")
        .then((res) => res.data)
        .catch(catchResponseMessage),
  });

  useGlobalLoading(budgetGroup.isPending || budgetSummary.isPending);
  const isClient = useClient();
  const cachedBudgetGroup = useQueryCache(budgetGroup, "budgetGroupGet", {
    count: 0,
    data: [
      {
        id: "",
        name: "",
        order: 0,
        totalAssigned: 0,
        totalAvailable: 0,
        countOverspent: 0,
        budgetItems: [],
      },
    ],
    message: "",
  });

  const cachedBudgetSummary = useQueryCache(budgetSummary, "budgetSummaryGet", {
    count: 0,
    data: [
      {
        latestUpdate: new Date(),
        startBudgetDate: new Date(),
        filterMonth: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        readyToAssign: 0,
        totalIncome: 0,
        totalAssigned: 0,
        totalActivity: 0,
        totalAvailable: 0,
        partitionKey: "",
        rowKey: "",
      },
    ],
    message: "",
  });

  useSignalR({
    onMessages: {
      monthlyBudgetUpdated: (message) => {
        console.log(`monthlyBudget updated with arguments: ${message}`);
        console.log("Refetching budget data");
        budgetGroup.refetch();
        console.log("Refetching budget summary data");
        budgetSummary.refetch();
      },
    },
  });

  if (budgetSummary.isError) {
    <Alert severity="error">Error: {budgetSummary.error?.message}</Alert>;
  }

  if (budgetGroup.isError) {
    <Alert severity="error">Error: {budgetGroup.error?.message}</Alert>;
  }

  if (!budgetGroup.data?.data || !budgetSummary.data?.data) {
    return isClient ? (
      <BudgetTab
        budgetGroup={cachedBudgetGroup.data}
        summary={cachedBudgetSummary.data[0]}
      />
    ) : null;
  }

  if (!budgetSummary.data?.data[0]) {
    return <Alert severity="info">No summary data found</Alert>;
  }

  return (
    <BudgetTab
      budgetGroup={budgetGroup.data?.data}
      summary={budgetSummary.data?.data[0]}
    />
  );
}
