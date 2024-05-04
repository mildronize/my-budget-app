import numbro from "numbro";
import { BudgetProgressProps } from "../BudgetProgress";
import { formatNumberThousand } from "@/global/formatNumberThousand";

export interface BudgetProgressInfo {
  progress: number;
  message: string;
  type: "spending" | "budget";
}

/**
 * Calculate the progress of the budget, for generate the progress bar.
 *
 * Budget is calculated by the monthly budget assigned.
 * The total available of current month is the sum of the previous month available and the activity.
 *
 * When spending out (expense) the activity will be negative ( < 0)
 *
 * @returns
 */
export function calculateBudgetProgress({
  items,
  value,
}: BudgetProgressProps): BudgetProgressInfo {
  const activity = items.activity * -1;
  const previousMonthAvailable = items.available + activity;

  if (activity > 0 && activity <= previousMonthAvailable) {
    return {
      progress: value,
      message:
        Math.abs(activity - previousMonthAvailable) < 1
          ? "Fully Spent"
          : `Spent ${formatNumberThousand(activity)} of ${formatNumberThousand(
              previousMonthAvailable
            )}`,
      type: "spending",
    };
  }
  return {
    progress: value,
    message: "",
    type: "budget",
  };
}
