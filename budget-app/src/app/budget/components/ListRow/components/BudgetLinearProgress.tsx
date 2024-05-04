import { styled } from "@mui/material/styles";
import { LinearProgress, linearProgressClasses } from "@mui/material";

export const BudgetLinearProgress = styled(LinearProgress)(({ theme }) => ({
  marginTop: 5,
  borderRadius: 5,
  height: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#9ecd6f" : "#ccf2a5",
  },
}));
