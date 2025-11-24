import React, { useState } from "react";
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
  TableSortLabel,
} from "@mui/material";
import {
  MoreVert,
  Visibility,
  Edit,
  Add,
  PersonOutline,
  Delete,
} from "@mui/icons-material";
import { BoxColumn, BoxRow, DashboardLayout } from "@/components";
import { useDisclosure } from "@chakra-ui/hooks";
import { Link } from "@inertiajs/react";
import dayjs from "dayjs";
import { IClient } from "@/types";
import Filters from "./components/Filters";
import { Modals } from "./components/Modals";
import CardTable from "@/components/CardTable";

export default function Page({ clients }: { clients: IClient[] }) {
  const [search, setSearch] = useState("");
  const [cuit, setCuit] = useState("");
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [orderBy, setOrderBy] = useState<keyof (typeof clients)[0]>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [menuButton, setMenuButton] = useState<HTMLButtonElement | null>(null);

  const createAccessDisclosure = useDisclosure();
  const viewAccessDisclosure = useDisclosure();
  const deleteAccessDisclosure = useDisclosure();

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    client: IClient
  ) => {
    setSelectedClient(client);
    setMenuButton(event.currentTarget as HTMLButtonElement);
  };

  const handleView = () => {
    setMenuButton(null);
  };

  const handleEdit = () => {
    setMenuButton(null);
  };

  const handleOpenCreateAccess = (client: IClient) => {
    createAccessDisclosure.onOpen();
    setSelectedClient(client);
  };

  const handleOpenViewAccess = (client: IClient) => {
    viewAccessDisclosure.onOpen();
    setSelectedClient(client);
  };

  const handleDeleteUserAccess = () => {
    deleteAccessDisclosure.onOpen();
    setMenuButton(null);
    setSelectedClient(selectedClient!);
  };

  const handleSort = (property: keyof (typeof clients)[0]) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedClientes = clients
    .filter(
      client =>
        client.name.toLowerCase().includes(search.toLowerCase()) &&
        client.cuit.toLowerCase().includes(cuit.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[orderBy as keyof typeof a];
      const bValue = b[orderBy as keyof typeof b];

      if (order === "desc") {
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

  const breadcrumbs = [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Clientes",
    },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <Container maxWidth="xl">
        <BoxColumn gap={3}>
          <Typography variant="h2" component="h1">
            Clientes
          </Typography>

          <CardTable
            headComponent={
              <BoxRow gap={2} justifyContent="space-between">
                <Filters
                  search={search}
                  setSearch={setSearch}
                  cuit={cuit}
                  setCuit={setCuit}
                />

                <Link href="/clients/create">
                  <Button variant="contained" color="primary">
                    Nuevo cliente
                  </Button>
                </Link>
              </BoxRow>
            }
          >
            <TableContainer component={Paper}>
              <Table aria-label="tabla de clientes">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={() => handleSort("name")}
                      >
                        Nombre
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "cuit"}
                        direction={orderBy === "cuit" ? order : "asc"}
                        onClick={() => handleSort("cuit")}
                      >
                        CUIT
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "created_at"}
                        direction={orderBy === "created_at" ? order : "asc"}
                        onClick={() => handleSort("created_at")}
                      >
                        Fecha de Creación
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Accesos</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedClientes.map(client => (
                    <>
                      <TableRow key={client.id}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.cuit}</TableCell>
                        <TableCell>
                          {dayjs(client.created_at).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell>
                          {client.user_access ? (
                            <Button
                              startIcon={<PersonOutline />}
                              size="small"
                              onClick={() => handleOpenViewAccess(client)}
                            >
                              Ver acceso
                            </Button>
                          ) : (
                            <Button
                              startIcon={<Add />}
                              size="small"
                              onClick={() => handleOpenCreateAccess(client)}
                            >
                              Crear acceso
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={e => handleMenuOpen(e, client)}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardTable>

          <Menu
            anchorEl={menuButton}
            open={menuButton !== null}
            onClose={() => setMenuButton(null)}
          >
            <MenuItem onClick={handleView}>
              <ListItemIcon>
                <Visibility fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ver</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
            {selectedClient?.user_access && (
              <MenuItem onClick={handleDeleteUserAccess}>
                <ListItemIcon>
                  <Delete fontSize="small" />
                </ListItemIcon>
                <ListItemText>Eliminar acceso</ListItemText>
              </MenuItem>
            )}
          </Menu>

          <Modals
            createAccessDisclosure={createAccessDisclosure}
            viewAccessDisclosure={viewAccessDisclosure}
            deleteAccessDisclosure={deleteAccessDisclosure}
            selectedClient={selectedClient}
          />
        </BoxColumn>
      </Container>
    </DashboardLayout>
  );
}
