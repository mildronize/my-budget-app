import { formatNumberThousand } from "@/global/formatNumberThousand";
import { Box, styled, Typography, useTheme } from "@mui/material";
import numbro from "numbro";

export const ListTableRow = styled(Box)(() => ({
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
}));

export function ListTableColumn(
  props: {
    ratio?: number;
    children?: React.ReactNode;
  } & React.ComponentProps<typeof Box>
) {
  return (
    <Box
      {...props}
      sx={{
        flex: `0 0 ${props.ratio ?? 20}%`,
        ...(props.sx ?? {}),
      }}
    >
      {props.children}
    </Box>
  );
}

export function MoneyColumn(
  props: { value: number } & React.ComponentProps<typeof Box>
) {
  const theme = useTheme();
  return (
    <Box
      {...props}
      sx={{
        fontFamily: theme.budget.amount.fontFamily,
        fontSize: theme.budget.amount.fontSize,
        ...(props.sx ?? {}),
      }}
    >
      {formatNumberThousand(props.value)}
    </Box>
  );
}

export function HeaderColumn(
  props: { children: React.ReactNode } & React.ComponentProps<typeof Typography>
) {
  const theme = useTheme();
  return (
    <Typography
      variant="subtitle2"
      align="right"
      sx={{
        textTransform: "uppercase",
        fontSize: "0.7rem",
        fontWeight: "bold",
        color: theme.palette.text.secondary,
        ...(props.sx ?? {}),
      }}
      {...props}
    >
      {props.children}
    </Typography>
  );
}
