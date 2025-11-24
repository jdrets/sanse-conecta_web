import {
  Container,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  Typography,
  TableBody,
  TableRow,
  Button,
} from "@mui/material";
import { Paper } from "@mui/material";
import { BoxColumn, DashboardLayout } from "@/components";
import CardTable from "@/components/CardTable";
import { IAuditsTypes } from "@/types/auditsTypes.interface";
import { Edit } from "@mui/icons-material";
import { router } from "@inertiajs/react";

export default function AuditsTypes({ types }: { types: IAuditsTypes[] }) {
  const handleGoToConfiguration = (type: IAuditsTypes) => {
    router.visit(`/audits/types/${type.id}/configuration`);
  };

  const breadcrumbs = [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Auditorias",
      href: "/audits",
    },
    {
      label: "Tipos de auditorias",
    },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <Container maxWidth="xl">
        <BoxColumn gap={3}>
          <Typography variant="h2" component="h1">
            Tipos de auditorias
          </Typography>

          <CardTable headComponent={<></>}>
            <TableContainer component={Paper}>
              <Table aria-label="tabla de auditorias">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {types.map(type => (
                    <TableRow key={type.id} hover>
                      <TableCell>{type.name}</TableCell>
                      <TableCell sx={{ width: "100px" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Edit />}
                          onClick={() => handleGoToConfiguration(type)}
                        >
                          Configuración
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardTable>
        </BoxColumn>
      </Container>
    </DashboardLayout>
  );
}
