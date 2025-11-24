import { Card, Button } from "@mui/material";
import { BoxColumn, BoxRow } from "@/components";
import { useFormContext, useWatch } from "react-hook-form";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Stadistics from "../../components/Stadistics";
import { router } from "@inertiajs/react";
import AuditItemsTable from "../../components/AuditItemsTable";
import AuditBaseData from "../../components/AuditBaseData";
import { IAudit } from "@/types/audit.interface";
import { EditOutlined } from "@mui/icons-material";

export default function Fields({
  audit,
  editMode,
  toggleEditMode,
  onCancelClick,
}: {
  audit: IAudit;
  editMode: boolean;
  toggleEditMode: () => void;
  onCancelClick: () => void;
}) {
  const {
    handleSubmit,
    formState: { isValid, isDirty },
  } = useFormContext();

  const items = useWatch({ name: "items" });

  const onSubmit = (data: any) => {
    updateAuditMutation.mutate(data);
  };

  const updateAuditMutation = useMutation({
    mutationFn: (data: any) => {
      return axios.put(`/audits/${audit.id}`, data);
    },
    onSuccess: data => {
      toast.success("Auditoría actualizada exitosamente");
      toggleEditMode();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error al actualizar la auditoría"
      );
    },
  });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BoxColumn gap={3}>
          <AuditBaseData staticData={audit} editMode={editMode} />

          {items.length > 0 && (
            <AuditItemsTable
              items={items}
              editMode={editMode}
              showExpiryAdvice
            />
          )}

          {items.length > 0 && <Stadistics items={items} />}

          {/* Botones de guardar y cancelar */}
          <BoxRow justifyContent="flex-end" gap={2}>
            {editMode && (
              <Button
                variant="text"
                sx={{ width: "fit-content" }}
                onClick={onCancelClick}
              >
                Cancelar
              </Button>
            )}
            {!editMode && (
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "fit-content" }}
                onClick={toggleEditMode}
                startIcon={<EditOutlined />}
              >
                Modificar
              </Button>
            )}
            {editMode && (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleSubmit(onSubmit)}
                sx={{ width: "fit-content" }}
                disabled={!isValid || !isDirty}
              >
                Guardar cambios
              </Button>
            )}
          </BoxRow>
        </BoxColumn>
      </form>
    </Card>
  );
}
