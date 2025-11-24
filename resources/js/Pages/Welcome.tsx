import { Card, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../components/Layouts/DashboardLayout";

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={[]}>
      <Container maxWidth="xl">
        <Card
          sx={{
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">Inicio</Typography>
        </Card>
      </Container>
    </DashboardLayout>
  );
}
