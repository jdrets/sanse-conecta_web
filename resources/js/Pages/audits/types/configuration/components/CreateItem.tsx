import { IAuditsTypes } from "@/types/auditsTypes.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { BoxColumn, BoxRow } from "@/components";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";

export default function CreateItem({
  type,
  open,
  onClose,
  defaultOrder,
  onItemCreated,
}: {
  type: IAuditsTypes;
  open: boolean;
  onClose: () => void;
  defaultOrder: number;
  onItemCreated?: () => void;
}) {
  const formData = useForm<AuditTypeItemFormData>({
    resolver: zodResolver(auditTypeItemSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      term: "",
      laws: "",
      order: defaultOrder,
    },
  });

  const createAuditTypeItemMutation = useMutation({
    mutationFn: (
      data: AuditTypeItemFormData & { audit_type_id: number; order: number }
    ) => {
      return axios.post("/audits/types/items", data);
    },
    onSuccess: () => {
      toast.success("Item creado exitosamente");
      // Llamar al callback para actualizar la lista local
      onItemCreated?.();
      handleClose();
    },
    onError: () => {
      toast.error("Error al crear el item");
    },
  });

  const onSubmit = (data: AuditTypeItemFormData) => {
    createAuditTypeItemMutation.mutate({
      ...data,
      audit_type_id: type.id,
      order: data.order,
    });
  };

  const handleClose = () => {
    formData.reset();
    onClose();
  };

  return (
    <FormProvider {...formData}>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formData.handleSubmit(onSubmit)}>
          <BoxColumn gap={3}>
            <Typography variant="h3" component="h3">
              Crear Item
            </Typography>
            <Typography variant="body1" component="p">
              Ingrese los datos del item que desea crear para el tipo de
              auditoria{" "}
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{
                  color: "primary.main",
                  textTransform: "capitalize",
                }}
              >
                {type.name}
              </Typography>
            </Typography>

            <BoxColumn gap={2}>
              <TextField
                label="Nombre"
                placeholder="Ingrese el nombre del item"
                {...formData.register("name")}
                error={!!formData.formState.errors.name}
                helperText={formData.formState.errors.name?.message}
              />

              <FormControl fullWidth error={!!formData.formState.errors.term}>
                <InputLabel>Término</InputLabel>
                <Select
                  {...formData.register("term")}
                  label="Término"
                  value={formData.watch("term") || ""}
                  onChange={e => formData.setValue("term", e.target.value)}
                >
                  {TERM_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formData.formState.errors.term && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5 }}
                  >
                    {formData.formState.errors.term.message}
                  </Typography>
                )}
              </FormControl>

              <TextField
                label="Leyes"
                placeholder="Ley A, Ley B, Ley C"
                multiline
                rows={3}
                {...formData.register("laws")}
                error={!!formData.formState.errors.laws}
                helperText={
                  formData.formState.errors.laws?.message ||
                  "Separar las leyes por comas"
                }
              />
            </BoxColumn>

            <BoxRow justifyContent="flex-end" gap={2}>
              <Button onClick={handleClose}>Cancelar</Button>
              <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                loading={createAuditTypeItemMutation.isPending}
                disabled={!formData.formState.isValid}
              >
                Crear Item
              </LoadingButton>
            </BoxRow>
          </BoxColumn>
        </form>
      </Dialog>
    </FormProvider>
  );
}

const auditTypeItemSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  term: z.string().min(1, "El término es requerido"),
  laws: z.string().min(1, "Las leyes son requeridas"),
  order: z.number().min(1, "El orden es requerido"),
});

type AuditTypeItemFormData = z.infer<typeof auditTypeItemSchema>;

export enum TermEnum {
  UNIQUE = "único",
  MONTHLY = "mensual",
  BIANNUAL = "bianual",
  ANNUAL = "anual",
  QUADRIENNIAL = "cuatrianual",
  SEMESTERLY = "semestral",
  ACCORDING_TO_DISPOSAL = "según_disponga",
  CONSTANT = "constante",
  TRIANNUAL = "trianual",
  PERIODIC = "periodico",
  PERMANENT = "permanente",
}

export const TERM_OPTIONS = [
  { value: TermEnum.UNIQUE, label: "Único" },
  { value: TermEnum.MONTHLY, label: "Mensual" },
  { value: TermEnum.BIANNUAL, label: "Bianual" },
  { value: TermEnum.ANNUAL, label: "Anual" },
  { value: TermEnum.QUADRIENNIAL, label: "Cuatrianual" },
  { value: TermEnum.SEMESTERLY, label: "Semestral" },
  { value: TermEnum.ACCORDING_TO_DISPOSAL, label: "Según disponga" },
  { value: TermEnum.CONSTANT, label: "Const." },
  { value: TermEnum.TRIANNUAL, label: "Trianual" },
  { value: TermEnum.PERIODIC, label: "Periódico" },
  { value: TermEnum.PERMANENT, label: "Permanente" },
];
