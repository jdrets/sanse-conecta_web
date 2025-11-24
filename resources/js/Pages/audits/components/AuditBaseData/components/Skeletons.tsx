import { BoxColumn } from "@/components";
import { Skeleton } from "@mui/material";

export default function Skeletons() {
  return (
    <BoxColumn gap={1}>
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
    </BoxColumn>
  );
}
