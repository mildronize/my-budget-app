import { alpha, styled } from "@mui/material/styles";
import { LinearProgress, linearProgressClasses } from "@mui/material";

export const SpendingLinearProgress = styled(LinearProgress)(({ theme }) => ({
  marginTop: 5,
  borderRadius: 5,
  height: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.mode === "light" ? "#9ecd6f" : "#ccf2a5",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    background: `repeating-linear-gradient(
      45deg,
      ${alpha("#d3e4c5", 0.6)}, 
      ${alpha("#d3e4c5", 0.6)} 5px,
      ${alpha("#f0ffe4", 0.6)} 5px, 
      ${alpha("#f4ffeb", 0.6)} 10px, 
      ${alpha("#d3e4c5", 0.6)} 10px
    )`,
  },
}));