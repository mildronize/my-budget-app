"use client";
import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { Box, Divider } from "@mui/material";
import useLongPress from "@/hooks/useLongPress";
import { BudgetItem } from "../types";
import { AvailableChip } from "../AvailableChip";
import { AutoSelectTextField } from "../AutoSelectNumberTextField";
import { ListTableColumn, ListTableRow } from "../layouts";
import numbro from "numbro";
import { BudgetProgress } from "./BudgetProgress";
import { formatNumberThousand } from "@/global/formatNumberThousand";

const ListContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));

export interface ListRowProps {
  items: BudgetItem;
  isEditAssigned: boolean;
  isShowAssigned: boolean;
  onEditAssigned: () => void;
  onEditAssignedSave: () => void;
}

export function ListRow(props: ListRowProps) {
  const { items } = props;

  const longPress = useLongPress(() => console.log("Long Press Happened"), 500);

  const theme = useTheme();

  let progress = 0;
  if (items.available > 0) {
    // progress =
    //   items.assigned > items.available
    //     ? 1
    //     : (items.assigned / items.available) * 100;
    progress =
      ((items.activity * -1) / (items.available + items.activity * -1)) * 100;
  }

  return (
    <>
      <ListItemButton onClick={props.onEditAssigned} {...longPress}>
        <ListContainer>
          <ListTableRow>
            <ListTableColumn ratio={60}>
              <ListItemText
                primary={items.name}
                primaryTypographyProps={{
                  sx: {
                    fontSize: "0.9rem",
                    fontFamily: theme.typography.fontFamily,
                  },
                }}
              />
            </ListTableColumn>

            <ListTableColumn
              sx={{
                textAlign: "right",
              }}
            >
              {props.isEditAssigned ? (
                <AutoSelectTextField
                  /**
                   * When unfocused, save the value
                   */
                  onBlur={props.onEditAssignedSave}
                  type="number"
                  defaultValue={items.assigned}
                />
              ) : props.isShowAssigned ? (
                <Box
                  sx={{
                    marginTop: "3px",
                    fontFamily: theme.budget.amount.fontFamily,
                    fontSize: theme.budget.amount.fontSize,
                  }}
                >
                  {formatNumberThousand(items.assigned)}
                </Box>
              ) : null}
            </ListTableColumn>

            <ListTableColumn
              sx={{
                textAlign: "right",
              }}
            >
              <AvailableChip available={items.available} />
            </ListTableColumn>
          </ListTableRow>
          <BudgetProgress value={progress} items={items} />
        </ListContainer>
      </ListItemButton>
      <Divider />
    </>
  );
}
