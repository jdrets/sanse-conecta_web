import { BoxColumn, BoxRow } from "@/components";
import { Button, Dialog, Typography } from "@mui/material";

export default function CancelModal({
  cancelDisclosure,
  handleCancel,
}: {
  cancelDisclosure: { isOpen: boolean; onClose: () => void };
  handleCancel: () => void;
}) {
  return (
    <Dialog open={cancelDisclosure.isOpen} onClose={cancelDisclosure.onClose}>
      <BoxColumn gap={3}>
        <Typography variant="subtitle1" component="p">
          Se perderán todos los datos ingresados hasta el momento.
        </Typography>
        <BoxRow justifyContent="flex-end" gap={2}>
          <Button
            variant="text"
            sx={{ width: "fit-content" }}
            onClick={cancelDisclosure.onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "fit-content" }}
            onClick={handleCancel}
          >
            Confirmar
          </Button>
        </BoxRow>
      </BoxColumn>
    </Dialog>
  );
}
