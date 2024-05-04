import type * as React from "react";
import { MobileLayoutNavigation } from "../tabs/components/MobileLayoutNavigation";
import dayjs from "dayjs";
import { BudgetDataContainer } from "./BudgetDataContainer";
import { Typography } from "@mui/material";
import { CountQueueChip } from "../components/CountQueueChip";

// export function MonthlyBudgetTitle() {
//   return (
//     <Typography variant="h6" sx={{ fontSize: "0.9rem", fontWeight: "600" }}>
//       {dayjs().format("MMM YYYY")} <CountQueueChip />
//     </Typography>
//   );
// }

export function BudgetPage() {
  return (
    // <MobileLayoutNavigation
    //   currentRouterKey={0}
    //   title={dayjs().format("MMM YYYY")}
    //   disableOverflow
    // >
      <BudgetDataContainer />
    // </MobileLayoutNavigation>
  );
}
