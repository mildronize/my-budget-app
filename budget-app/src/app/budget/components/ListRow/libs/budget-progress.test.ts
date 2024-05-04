import { BudgetProgressProps } from "../BudgetProgress";
import { calculateBudgetProgress } from "./budget-progress";
import { describe, expect, test } from "vitest";
// test calculation of progress

describe(
  "When Spending Progress bar appear, when assigned and activity (inverted) equally",
  {},
  () => {
    test("Giving activity is active (Less than 0)", () => {
      const items = {
        assigned: 100,
        activity: -100,
        available: 100,
      } as BudgetProgressProps["items"];
      const value = 50;
      const result = calculateBudgetProgress({ items, value });
      expect(result).toEqual({
        progress: 50,
        message: "Spent 100 of 200",
        type: "spending",
      });
    });

    test("Giving activity is active (Less than 0) and fully spent", () => {
      const items = {
        assigned: 100,
        activity: -100,
        available: 0,
      } as BudgetProgressProps["items"];
      const value = 100;
      const result = calculateBudgetProgress({ items, value });
      expect(result).toEqual({
        progress: 100,
        message: "Fully Spent",
        type: "spending",
      });
    });

    test("Giving activity is active  (Less than 0) and fully spent when the activity and available diff is less than 1", () => {
      const items = {
        assigned: 199.5,
        activity: -199.5,
        available: 0,
      } as BudgetProgressProps["items"];
      const value = 100;
      const result = calculateBudgetProgress({ items, value });
      expect(result).toEqual({
        progress: 100,
        message: "Fully Spent",
        type: "spending",
      });
    });
  }
);
