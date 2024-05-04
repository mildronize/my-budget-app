import { monthlyBudgetSummaryTable, monthlyBudgetTable } from "@/bootstrap";
import { MonthlyBudgetSummaryCacheEntity } from "@/entites/monthly-budget.entity";
import { globalHandler } from "@/global/globalHandler";
import { dateTimezone } from "@/libs/dayjs";
import { NextResponse } from "next/server";

export const GET = globalHandler(async (req) => {
  /**
   * List last 7 days transactions
   */
  const rowKey = dateTimezone().format("YYYY-MM");

  const rows: MonthlyBudgetSummaryCacheEntity[] = [];
  for await (const row of monthlyBudgetSummaryTable.list({
    filter: `RowKey eq '${rowKey}'`,
  })) {
    rows.push(row);
  }

  if (rows.length > 1) {
    throw new Error("Multiple rows found");
  }

  return NextResponse.json({
    message: rows.length === 0 ? "No data found" : "Success",
    count: rows.length,
    data: rows,
  });
});
