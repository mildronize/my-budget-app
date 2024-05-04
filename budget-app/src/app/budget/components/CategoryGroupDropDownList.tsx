"use client";
import {
  Badge,
  Box,
  Chip,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import { ListTableColumn, ListTableRow } from "./layouts";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { BudgetGroupItem } from "./types";
import numbro from "numbro";
import { formatNumberThousand } from "@/global/formatNumberThousand";

export interface CategoryGroupDropDownListProps {
  onClick?: () => void;
  header: BudgetGroupItem;
  isExpanded: boolean;
}

export function CategoryGroupDropDownList(
  props: CategoryGroupDropDownListProps
) {
  const theme = useTheme();
  return (
    <ListItemButton
      onClick={props.onClick}
      sx={{
        bgcolor: "#f0f0f0",
        "&:hover": {
          bgcolor: "#e0e0e0", // Background color on hover
        },
      }}
    >
      <ListTableRow>
        <ListTableColumn
          ratio={60}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {props.isExpanded ? <ExpandLess /> : <ExpandMore />}
          <Box
            sx={{
              fontFamily: theme.budget.amount.fontFamily,
              fontWeight: theme.budget.amount.fontWeight,
              fontSize: theme.budget.amount.fontSize,
              padding: 0,
            }}
          >
            {props.header.name}
          </Box>
        </ListTableColumn>
        <ListTableColumn
          ratio={20}
          sx={{
            textAlign: "right",
            fontFamily: theme.budget.amount.fontFamily,
            fontWeight: theme.budget.amount.fontWeight,
            fontSize: theme.budget.amount.fontSize,
            padding: 0,
          }}
        >
          {formatNumberThousand(props.header.totalAssigned)}
        </ListTableColumn>
        <ListTableColumn
          ratio={20}
          sx={{
            textAlign: "right",
            fontFamily: theme.budget.amount.fontFamily,
            fontWeight: theme.budget.amount.fontWeight,
            fontSize: theme.budget.amount.fontSize,
            padding: 0,
          }}
        >
          {props.header.countOverspent > 0 ? (
            <Chip
              label={formatNumberThousand(props.header.totalAvailable)}
              size="small"
              sx={{
                "&.MuiChip-root": {
                  backgroundColor: "#ffc6be",
                  fontSize: theme.budget.amount.fontSize,
                },
                "&.MuiChip-label": {
                  fontWeight: "500",
                },
              }}
            />
          ) : (
            formatNumberThousand(props.header.totalAvailable)
          )}
        </ListTableColumn>
      </ListTableRow>
    </ListItemButton>
  );
}
