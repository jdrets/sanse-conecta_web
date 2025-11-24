import { BoxColumn, BoxRow } from "@/components";
import { Button, Dialog, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { IClient } from "@/types";
import { LoadingButton } from "@mui/lab";
import { router } from "@inertiajs/react";

export default function DeleteClientAccess({
  isOpen,
  onClose,
  client,
}: {
  isOpen: boolean;
  onClose: () => void;
  client?: IClient;
}) {
  if (!isOpen) return null;

  const deleteUserAccessMutation = useMutation({
    mutationFn: () => {
      return axios.delete("/clients/user-access", {
        data: { email: client?.user_access?.email },
      });
    },
    onSuccess: () => {
      toast.success("Acceso eliminado exitosamente");
      onClose();
      router.reload({ only: ["clients"] });
    },
    onError: () => {
      toast.error("Error al eliminar el acceso");
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <BoxColumn gap={3}>
        <Typography variant="h3" component="h3">
          Eliminar acceso
        </Typography>
        <Typography variant="body1" component="p">
          Estas seguro que deseas eliminar el acceso para el cliente{" "}
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              color: "primary.main",
              textTransform: "capitalize",
            }}
          >
            {client?.name}
          </Typography>
        </Typography>

        <BoxRow justifyContent="flex-end" gap={2}>
          <Button onClick={onClose}>Cancelar</Button>
          <LoadingButton
            loading={deleteUserAccessMutation.isPending}
            variant="contained"
            color="error"
            type="submit"
            onClick={() => deleteUserAccessMutation.mutate()}
          >
            Eliminar acceso
          </LoadingButton>
        </BoxRow>
      </BoxColumn>
    </Dialog>
  );
}
