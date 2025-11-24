import { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  MoreVert,
  DeleteOutline,
  PrintOutlined,
  VisibilityOutlined,
  SearchOffOutlined,
  AccessTimeOutlined,
  CheckCircleOutlined,
} from "@mui/icons-material";
import { BoxColumn, BoxRow, DashboardLayout } from "@/components";
import { useDisclosure } from "@chakra-ui/hooks";
import { Link, router } from "@inertiajs/react";

import Filters from "./components/Filters";
import CardTable from "@/components/CardTable";
import { IClient } from "@/types/client.interface";
import { IAuditsTypes } from "@/types/auditsTypes.interface";
import { format } from "date-fns";
import { IAudit } from "@/types/audit.interface";
import DeleteAuditModal from "./components/DeleteAuditModal";

export default function Page({
  audits,
  clients,
  auditTypes,
}: {
  audits: IAudit[];
  clients: IClient[];
  auditTypes: IAuditsTypes[];
}) {
  const menuDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const [menuButton, setMenuButton] = useState<HTMLButtonElement | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<IAudit | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    audit: IAudit
  ) => {
    event.stopPropagation();
    event.preventDefault();

    setSelectedAudit(audit);
    setMenuButton(event.currentTarget as HTMLButtonElement);
    menuDisclosure.onOpen();
  };

  const handleView = (auditId: number) => {
    menuDisclosure.onClose();
    router.visit(`/audits/${auditId}`);
  };

  const handlePrint = (auditId: number) => {
    menuDisclosure.onClose();
    router.visit(`/audits/${auditId}/print`);
  };

  const onDeleteClick = () => {
    menuDisclosure.onClose();
    deleteDisclosure.onOpen();
  };

  const breadcrumbs = [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Auditorias",
    },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <Container maxWidth="xl">
        <BoxColumn gap={3}>
          <Typography variant="h2" component="h1">
            Auditorias
          </Typography>

          <CardTable
            headComponent={
              <Filters clients={clients} auditTypes={auditTypes}>
                <Link href="/audits/create">
                  <Button variant="contained" color="primary">
                    Nueva auditoria
                  </Button>
                </Link>
              </Filters>
            }
          >
            <TableContainer component={Paper}>
              <Table aria-label="tabla de auditorias">
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Fecha de ejecución</TableCell>
                    <TableCell>Vencimientos</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {audits.map(audit => {
                    const numberOfExpirations = audit.items.filter(
                      item =>
                        item.expiry_date &&
                        Date.parse(item.expiry_date) < Date.now()
                    ).length;
                    return (
                      <TableRow
                        key={audit.id}
                        hover
                        onClick={() => router.visit(`/audits/${audit.id}`)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{audit.client.name}</TableCell>
                        <TableCell>{audit.audit_type.name}</TableCell>
                        <TableCell>
                          {format(audit.creation_date, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          {numberOfExpirations > 0 ? (
                            <BoxRow gap={1}>
                              <AccessTimeOutlined color="error" />
                              <Typography variant="body1" color="error">
                                <b>{numberOfExpirations}</b> vencimiento
                                {numberOfExpirations > 1 ? "s" : ""}
                              </Typography>
                            </BoxRow>
                          ) : (
                            <Tooltip title="Sin items vencidos" placement="top">
                              <CheckCircleOutlined color="success" />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell sx={{ width: "100px" }}>
                          <IconButton
                            size="small"
                            onClick={event => handleMenuOpen(event, audit)}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {audits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                        <SearchOffOutlined fontSize="large" sx={{ mb: 1 }} />
                        <Typography variant="h5">
                          No hay resultados para mostrar
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardTable>

          <Menu
            anchorEl={menuDisclosure.isOpen ? menuButton : null}
            open={menuDisclosure.isOpen}
            onClose={menuDisclosure.onClose}
          >
            <MenuItem onClick={() => handleView(selectedAudit!.id)}>
              <ListItemIcon>
                <VisibilityOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ver</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handlePrint(selectedAudit!.id)}>
              <ListItemIcon>
                <PrintOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Imprimir</ListItemText>
            </MenuItem>
            <MenuItem onClick={onDeleteClick}>
              <ListItemIcon>
                <DeleteOutline fontSize="small" />
              </ListItemIcon>
              <ListItemText>Borrar</ListItemText>
            </MenuItem>
          </Menu>
        </BoxColumn>

        <DeleteAuditModal
          open={deleteDisclosure.isOpen}
          onClose={deleteDisclosure.onClose}
          audit={selectedAudit!}
        />
      </Container>
    </DashboardLayout>
  );
}
