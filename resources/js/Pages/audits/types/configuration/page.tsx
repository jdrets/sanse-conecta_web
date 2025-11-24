import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  IconButton,
  Button,
} from "@mui/material";
import { IAuditsTypes, IAuditTypeItems } from "@/types/auditsTypes.interface";
import CardTable from "@/components/CardTable";
import { DashboardLayout } from "@/components/Layouts/DashboardLayout";
import { BoxColumn, BoxRow } from "@/components";
import {
  DragIndicator,
  EditOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDisclosure } from "@chakra-ui/hooks";
import { router } from "@inertiajs/react";
import CreateItem from "./components/CreateItem";
import EditItem from "./components/EditItem";
import DeleteItem from "./components/DeleteItem";

export default function AuditsTypes({
  type,
  items,
}: {
  type: IAuditsTypes;
  items: IAuditTypeItems[];
}) {
  const [itemsList, setItemsList] = useState<IAuditTypeItems[]>(items);
  const newItemDisclosure = useDisclosure();
  const editItemDisclosure = useDisclosure();
  const deleteItemDisclosure = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<IAuditTypeItems | null>(
    null
  );

  // Sincronizar el estado local con los props cuando cambien
  useEffect(() => {
    setItemsList(items);
  }, [items]);

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
      href: "/audits/types",
    },
    {
      label: type.name,
    },
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(itemsList);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    // Actualizar el orden en el estado local
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setItemsList(updatedItems);

    // Enviar la actualización al servidor usando la mutation
    orderItemsMutation.mutate({
      items: updatedItems.map(item => ({
        id: item.id,
        order: item.order,
      })),
    });
  };

  const orderItemsMutation = useMutation({
    mutationFn: (data: any) => {
      return axios.post(`/audits/types/${type.id}/reorder`, data);
    },
    onSuccess: () => {},
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error al ordenar los items"
      );
    },
  });

  const handleItemCreated = () => {
    // Recargar los datos desde el servidor
    router.reload({ only: ["items"] });
  };

  const handleEditItem = (item: IAuditTypeItems) => {
    setSelectedItem(item);
    editItemDisclosure.onOpen();
  };

  const handleDeleteItem = (item: IAuditTypeItems) => {
    setSelectedItem(item);
    deleteItemDisclosure.onOpen();
  };

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <Container maxWidth="xl">
        <BoxColumn gap={3}>
          <Typography variant="h2" component="h1">
            {type.name}
          </Typography>

          <CardTable
            headComponent={
              <BoxRow justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => newItemDisclosure.onOpen()}
                >
                  Nuevo item
                </Button>
              </BoxRow>
            }
          >
            <TableContainer component={Paper}>
              <Table aria-label="tabla de auditorias">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "70px" }}></TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell sx={{ width: "100px" }}></TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="items">
                  {provided => (
                    <TableBody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {itemsList.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              sx={{
                                backgroundColor: snapshot.isDragging
                                  ? "rgba(0, 0, 0, 0.04)"
                                  : "inherit",
                              }}
                            >
                              <TableCell sx={{ width: "70px" }}>
                                <IconButton
                                  {...provided.dragHandleProps}
                                  sx={{ cursor: "grab" }}
                                >
                                  <DragIndicator />
                                </IconButton>
                              </TableCell>
                              <TableCell sx={{ width: "100%" }}>
                                {item.name}
                              </TableCell>
                              <TableCell sx={{ width: "100px" }}>
                                <BoxRow gap={1}>
                                  <IconButton
                                    onClick={() => {
                                      handleEditItem(item);
                                    }}
                                  >
                                    <EditOutlined />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteItem(item);
                                    }}
                                  >
                                    <DeleteOutlined />
                                  </IconButton>
                                </BoxRow>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </DragDropContext>
            </TableContainer>
          </CardTable>
        </BoxColumn>
      </Container>

      <CreateItem
        type={type}
        open={newItemDisclosure.isOpen}
        defaultOrder={itemsList.length + 1}
        onClose={() => newItemDisclosure.onClose()}
        onItemCreated={handleItemCreated}
      />

      <EditItem
        type={type}
        open={editItemDisclosure.isOpen}
        onClose={() => editItemDisclosure.onClose()}
        onItemCreated={handleItemCreated}
        item={selectedItem!}
      />

      <DeleteItem
        type={type}
        open={deleteItemDisclosure.isOpen}
        onClose={() => deleteItemDisclosure.onClose()}
        item={selectedItem!}
      />
    </DashboardLayout>
  );
}
