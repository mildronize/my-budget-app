"use client";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import numbro from "numbro";
import { formatNumberThousand } from "@/global/formatNumberThousand";

export interface StickyHeaderProps {
  summary: {
    readyToAssign: number;
    totalIncome: number;
    totalAssigned: number;
    totalActivity: number;
    totalAvailable: number;
  };
  height?: number;
}

export function StickyHeader({ summary, height }: StickyHeaderProps) {
  const theme = useTheme();
  const readyToAssign =
    Math.abs(summary.readyToAssign) < 1 ? 0 : summary.readyToAssign;
  let errorMessage = "";
  let backgroundColor = "";
  let fontColor = theme.palette.text.primary;
  if (summary.readyToAssign < 0) {
    errorMessage = "You assigned more than you have";
    backgroundColor = "#FAEEED";
  } else if (summary.readyToAssign > 1) {
    errorMessage = "Ready to assign";
    backgroundColor = "#ccf2a5";
  } else {
    errorMessage = "All money assigned";
    fontColor = theme.palette.text.secondary;
    backgroundColor = "#f0f0f0";
  }

  return (
    <Box
      sx={{
        ...(height ? { height: `${height}px` } : {}),
        display: "flex",
        flexDirection: "column",
        // margin: "0 10px",
      }}
    >
      <Box
        sx={{
          backgroundColor: backgroundColor,
          padding: "10px 20px",
          borderRadius: "5px",
          margin: "10px",
          color: fontColor,
          fontFamily: theme.budget.amount.fontFamily,
          // textAlign: "right",
        }}
      >
        {formatNumberThousand(readyToAssign)}
        <br />
        {errorMessage}
      </Box>
    </Box>
  );
}
