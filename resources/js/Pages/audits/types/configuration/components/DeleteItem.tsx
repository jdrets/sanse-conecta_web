import { IAuditsTypes, IAuditTypeItems } from "@/types/auditsTypes.interface";
import { Dialog, Typography, Button, TextField } from "@mui/material";
import { BoxColumn, BoxRow } from "@/components";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";

export default function DeleteItem({
  type,
  open,
  onClose,
  item,
}: {
  type: IAuditsTypes;
  open: boolean;
  onClose: () => void;
  item: IAuditTypeItems;
}) {
  if (!item) return null;
  const [confirmation, setConfirmation] = useState("");
  const [confirmationError, setConfirmationError] = useState("");

  const deleteAuditTypeItemMutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/audits/types/items/${item.id}`);
    },
    onSuccess: () => {
      toast.success("Item borrado exitosamente");
      onClose();
      router.reload({ only: ["items"] });
    },
    onError: () => {
      toast.error("Error al borrar el item");
    },
  });

  const onSubmit = () => {
    if (confirmation.toLowerCase().trim() !== CONFIRMATION_TEXT) {
      setConfirmationError(
        "La confirmación es requerida y debe ser 'quiero eliminar'"
      );
      return;
    }
    deleteAuditTypeItemMutation.mutate();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <BoxColumn gap={3}>
        <Typography variant="h3" component="h3">
          Borrar Item
        </Typography>
        <Typography variant="body1" component="p">
          Estas seguro que deseas borrar{" "}
          <Typography
            variant="body1"
            component="span"
            fontWeight={600}
            sx={{
              color: "primary.main",
              textTransform: "capitalize",
            }}
          >
            {item.name}
          </Typography>
          . Se eliminarán todas las auditorias que tengan este item.
        </Typography>

        <Typography variant="body1" component="p">
          Para borrar el item, escribe "{CONFIRMATION_TEXT}" en el siguiente
          campo.
        </Typography>
        <TextField
          label="Confirmación"
          placeholder={`Escribe '${CONFIRMATION_TEXT}'`}
          value={confirmation}
          onChange={e => setConfirmation(e.target.value)}
          error={!!confirmationError}
          helperText={confirmationError}
        />

        <BoxRow justifyContent="flex-end" gap={2}>
          <Button onClick={onClose}>Cancelar</Button>
          <LoadingButton
            variant="contained"
            color="primary"
            type="submit"
            loading={deleteAuditTypeItemMutation.isPending}
            onClick={onSubmit}
            disabled={confirmation !== CONFIRMATION_TEXT && !confirmationError}
          >
            Borrar Item
          </LoadingButton>
        </BoxRow>
      </BoxColumn>
    </Dialog>
  );
}

const CONFIRMATION_TEXT = "eliminar item";
