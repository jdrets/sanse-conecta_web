import { Box, Card } from "@mui/material";

export default function CardTable({
  children,
  headComponent,
}: {
  children: React.ReactNode;
  headComponent: React.ReactNode;
}) {
  return (
    <Card sx={{ padding: 0 }}>
      <Box sx={{ padding: 3 }}>{headComponent}</Box>
      {children}
    </Card>
  );
}
