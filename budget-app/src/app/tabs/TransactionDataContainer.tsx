"use client";
import {
  AddTransactionTab,
  AddTransactionTabProps,
  TransactionInputs,
} from "@/app/tabs/AddTransactionTab";
import { InferRouteResponse } from "@/types";
import * as TransactionId from "@/app/api/transaction/[id]/route";
import axios from "axios";
import { catchResponseMessage } from "@/global/catchResponse";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@mui/material";
import dayjs from "dayjs";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

export type TransactionGetResponse = InferRouteResponse<
  typeof TransactionId.GET
>;
export interface TransactionDataContainerProps extends AddTransactionTabProps {
  action: string;
  id: string | undefined;
}

function parseTransactionInputs(
  data: TransactionGetResponse["data"] | undefined
): TransactionInputs {
  const firstData = data ? data[0] : {};
  return {
    /**
     * If the amount is negative, it will be converted to positive
     * This will also convert before saving into google sheet as positive
     */
    amount: String((firstData.amount ?? 0) * -1) ?? "-0",
    payee: firstData.payee ?? "",
    category: firstData.category ?? "",
    account: firstData.account ?? "",
    date: dayjs(firstData.date) ?? null,
    memo: firstData.memo ?? "",
  };
}

export function TransactionDataContainer(props: TransactionDataContainerProps) {
  const transaction = useQuery<TransactionGetResponse>({
    queryKey: ["transactionSingleGet", { id: props.id }],
    queryFn: () =>
      axios
        .get("/api/transaction/" + props.id)
        .then((res) => res.data)
        .catch(catchResponseMessage),
  });

  useGlobalLoading(transaction.isPending);

  if (props.id === undefined) {
    return <AddTransactionTab action="add" />;
  }

  if (transaction.isPending) {
    return null;
  }

  if (transaction.isError) {
    return (
      <Alert severity="error">
        Cannot get transaction from id {props.id}: {transaction.error?.message}
      </Alert>
    );
  }

  if (transaction.isSuccess && transaction.data?.data) {
    return (
      <AddTransactionTab
        {...props}
        action={props.action}
        id={props.id}
        defaultValue={parseTransactionInputs(transaction.data?.data)}
      />
    );
  }
}
