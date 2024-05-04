"use client";
import { formatNumberThousand } from "@/global/formatNumberThousand";
import { Chip } from "@mui/material";
import numbro from "numbro";

export interface AvailableChipProps {
  available: number;
}

export function AvailableChip(props: AvailableChipProps) {
  let chipColor = "";
  if (props.available < 0) {
    chipColor = "#ffc6be";
  } else if (props.available > 0) {
    chipColor = "#ccf2a5";
  } else {
    chipColor = "#e3e3e3";
  }
  return (
    <Chip
      label={formatNumberThousand(props.available)}
      size="small"
      sx={{
        "&.MuiChip-root": {
          backgroundColor: chipColor,
          fontSize: "0.8rem",
        },
        "&.MuiChip-label": {
          fontWeight: "500",
        },
      }}
    />
  );
}
