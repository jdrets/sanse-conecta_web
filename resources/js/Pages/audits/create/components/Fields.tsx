import { Card, Button, Dialog, Typography } from "@mui/material";
import { BoxColumn, BoxRow } from "@/components";
import { useFormContext, useWatch } from "react-hook-form";
import { IAuditsTypes, IClient } from "@/types";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Stadistics from "../../components/Stadistics";
import { useDisclosure } from "@chakra-ui/hooks";
import { router } from "@inertiajs/react";
import AuditItemsTable from "../../components/AuditItemsTable";
import AuditBaseData from "../../components/AuditBaseData";
import CancelModal from "@/components/CancelModal";

export default function Fields({
  clients,
  auditTypes,
}: {
  clients: IClient[];
  auditTypes: IAuditsTypes[];
}) {
  const {
    handleSubmit,
    formState: { isValid },
  } = useFormContext();
  const cancelDisclosure = useDisclosure();
  const items = useWatch({ name: "items" });

  const onSubmit = (data: any) => {
    createAuditMutation.mutate(data);
  };

  const createAuditMutation = useMutation({
    mutationFn: (data: any) => {
      return axios.post("/audits/create", data);
    },
    onSuccess: data => {
      toast.success("Auditoría creada exitosamente");
      router.visit("/audits");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error al crear la auditoría"
      );
    },
  });

  const handleCancel = () => {
    cancelDisclosure.onClose();
    router.visit("/audits");
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BoxColumn gap={3}>
          <AuditBaseData auditTypes={auditTypes} clients={clients} />

          {items.length > 0 && <AuditItemsTable items={items} />}

          {items.length > 0 && <Stadistics items={items} />}

          {/* Botones de guardar y cancelar */}
          <BoxRow justifyContent="flex-end" gap={2}>
            <Button
              variant="text"
              sx={{ width: "fit-content" }}
              onClick={cancelDisclosure.onOpen}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ width: "fit-content" }}
              disabled={!isValid}
            >
              Guardar auditoria
            </Button>
          </BoxRow>

          <CancelModal
            cancelDisclosure={cancelDisclosure}
            handleCancel={handleCancel}
          />
        </BoxColumn>
      </form>
    </Card>
  );
}
