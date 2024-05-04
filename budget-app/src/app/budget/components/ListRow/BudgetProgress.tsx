import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { BudgetItem } from "../types";
import numbro from "numbro";
import { BudgetLinearProgress, SpendingLinearProgress } from "./components";
import { calculateBudgetProgress } from "./libs/budget-progress";

export interface BudgetProgressProps {
  items: BudgetItem;
  value: number;
}

export function BudgetProgress({ items, value }: BudgetProgressProps) {
  const theme = useTheme();
  const budgetInfo = calculateBudgetProgress({ items, value });

  if (budgetInfo.type === "spending") {
    return (
      <Box>
        <SpendingLinearProgress variant="determinate" value={value} />
        <Box
          sx={{
            fontSize: "0.85rem",
            color: theme.palette.text.secondary,
            paddingTop: "10px",
          }}
        >
          {budgetInfo.message}
        </Box>
      </Box>
    );
  } else {
    return <BudgetLinearProgress variant="determinate" value={value} />;
  }
}
