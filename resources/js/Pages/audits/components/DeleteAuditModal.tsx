import { BoxColumn, BoxRow } from "@/components";
import { IAudit } from "@/types/audit.interface";
import { Dialog, Typography, TextField, Button, Box } from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { LoadingButton } from "@mui/lab";

export default function DeleteAuditModal({
  open,
  onClose,
  audit,
}: {
  open: boolean;
  onClose: () => void;
  audit?: IAudit;
}) {
  const [confirmation, setConfirmation] = useState("");

  const deleteAuditMutation = useMutation({
    mutationFn: (auditId: number) => {
      return axios.delete(`/audits/${auditId}`);
    },
    onSuccess: () => {
      toast.success("Auditoría eliminada exitosamente");
      onClose();
      setConfirmation("");
      router.reload();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error al eliminar la auditoría"
      );
    },
  });

  if (!audit) return null;

  const handleDelete = () => {
    deleteAuditMutation.mutate(audit.id);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <BoxColumn gap={3}>
        <Typography variant="h3" component="h3">
          Borrar auditoría
        </Typography>

        <Typography variant="body1" component="p">
          Estas seguro que deseas borrar la auditoría de{" "}
          <Typography
            variant="body1"
            component="span"
            fontWeight={600}
            sx={{ color: "primary.main", textTransform: "capitalize" }}
          >
            {audit.client.name} - {audit.audit_type.name}
          </Typography>
          . Se eliminarán todos los datos de la auditoría.
        </Typography>

        <Typography variant="body1" component="p">
          {" "}
          Para borrar la auditoría, escribe{" "}
          <Box component="span" fontWeight={600} sx={{ color: "primary.main" }}>
            "{CONFIRMATION_TEXT}"
          </Box>{" "}
          en el siguiente campo.{" "}
        </Typography>

        <TextField
          label="Confirmación"
          placeholder={`Escribe '${CONFIRMATION_TEXT}'`}
          fullWidth
          value={confirmation}
          onChange={e => setConfirmation(e.target.value)}
        />

        <BoxRow justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} disabled={deleteAuditMutation.isPending}>
            Cancelar
          </Button>

          <LoadingButton
            loading={deleteAuditMutation.isPending}
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleDelete}
            disabled={confirmation !== CONFIRMATION_TEXT}
          >
            Borrar auditoría
          </LoadingButton>
        </BoxRow>
      </BoxColumn>
    </Dialog>
  );
}

const CONFIRMATION_TEXT = "quiero borrar la auditoria";
