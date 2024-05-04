import { BudgetGroupItem } from "@/app/budget/components/types";
import { monthlyBudgetTable } from "@/bootstrap";
import { MonthlyBudgetCacheEntity } from "@/entites/monthly-budget.entity";
import { globalHandler } from "@/global/globalHandler";
import { dateTimezone } from "@/libs/dayjs";
import { TableEntityResult } from "@azure/data-tables";
// https://github.com/vercel/next.js/issues/58242
import "core-js/features/array/to-sorted";
import { NextResponse } from "next/server";

function isExistBudgetGroup(
  budgetGroups: BudgetGroupItem[],
  categoryGroupID: string
): boolean {
  return budgetGroups.some((group) => group.id === categoryGroupID);
}

function parseBudgetItem(row: TableEntityResult<MonthlyBudgetCacheEntity>) {
  return {
    id: row.id,
    name: row.title,
    assigned: row.assigned,
    activity: row.activity,
    available: row.available,
    order: row.order,
    isHidden: row.hide,
  };
}

function appendBudgetItem(
  budgetGroups: BudgetGroupItem[],
  categoryGroupID: string,
  row: TableEntityResult<MonthlyBudgetCacheEntity>
) {
  const budgetGroup = budgetGroups.find(
    (group) => group.id === categoryGroupID
  );
  if (!budgetGroup) {
    console.log("budgetGroup not found", budgetGroups, row);
    return;
  }
  budgetGroup.budgetItems.push(parseBudgetItem(row));
  budgetGroup.totalAssigned += row.assigned;
  budgetGroup.totalAvailable += row.available;
  if (row.available < 0) {
    budgetGroup.countOverspent++;
  }
}

function initBudgetGroup(row: TableEntityResult<MonthlyBudgetCacheEntity>) {
  return {
    id: row.categoryGroupID,
    name: row.categoryGroup,
    totalAssigned: 0,
    totalAvailable: 0,
    countOverspent: 0,
    order: row.baseOrder,
    budgetItems: [],
  };
}

export const GET = globalHandler(async (req) => {
  const budgetGroups: BudgetGroupItem[] = [];
  const partitionKey = dateTimezone().format("YYYY-MM");

  for await (const row of monthlyBudgetTable.list({
    filter: `PartitionKey eq '${partitionKey}'`,
  })) {
    if (isExistBudgetGroup(budgetGroups, row.categoryGroupID)) {
      appendBudgetItem(budgetGroups, row.categoryGroupID, row);
    } else {
      budgetGroups.push(initBudgetGroup(row));
      appendBudgetItem(budgetGroups, row.categoryGroupID, row);
    }
  }

  const sortedBudgetGroups = budgetGroups
    /**
     * Sorted by baseOrder field
     */
    .toSorted((a, b) => {
      return a.order - b.order;
    });

  /**
   * Sorted by order field
   */
  for (const group of sortedBudgetGroups) {
    group.budgetItems = group.budgetItems.toSorted((a, b) => {
      return a.order - b.order;
    });
  }

  return NextResponse.json({
    message: "OK",
    count: sortedBudgetGroups.length,
    data: sortedBudgetGroups,
  });
});
