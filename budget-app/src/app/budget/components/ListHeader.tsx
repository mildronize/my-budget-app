import { Box, Typography, useTheme } from "@mui/material";
import {
  HeaderColumn,
  ListTableColumn,
  ListTableRow,
  MoneyColumn,
} from "./layouts";

export type ColumnType = string | number;

export interface ListHeaderProps {
  height?: number;
  columns: [ColumnType, ColumnType, ColumnType];
}

function RenderColumn(props: { column: ColumnType }) {
  if (typeof props.column === "number") {
    return <MoneyColumn value={props.column} />;
  } else {
    return <HeaderColumn>{props.column}</HeaderColumn>;
  }
}

export function ListHeader(props: ListHeaderProps) {
  return (
    <ListTableRow
      sx={{
        ...(props.height ? { height: `${props.height}px` } : {}),
        padding: "8px 10px",
        bgcolor: "#ebebeb",
      }}
    >
      <ListTableColumn ratio={60}>{props.columns[0]}</ListTableColumn>
      <ListTableColumn
        ratio={20}
        sx={{
          textAlign: "right",
        }}
      >
        <RenderColumn column={props.columns[1]} />
      </ListTableColumn>
      <ListTableColumn
        ratio={20}
        sx={{
          textAlign: "right",
        }}
      >
        <RenderColumn column={props.columns[2]} />
      </ListTableColumn>
    </ListTableRow>
  );
}
