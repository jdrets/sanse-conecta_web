import { IAuditsTypes, IAuditTypeItems } from "@/types/auditsTypes.interface";
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
import { TERM_OPTIONS } from "./CreateItem";
import { useEffect } from "react";

export default function EditItem({
  type,
  open,
  onClose,
  onItemCreated,
  item,
}: {
  type: IAuditsTypes;
  open: boolean;
  onClose: () => void;
  onItemCreated?: () => void;
  item: IAuditTypeItems;
}) {
  if (!item) return null;

  const formData = useForm<AuditTypeItemFormData>({
    resolver: zodResolver(auditTypeItemSchema),
    mode: "onChange",
    defaultValues: {
      id: item.id,
      name: item.name,
      term: item.term,
      laws: item.laws,
      order: +item.order,
    },
  });

  const editAuditTypeItemMutation = useMutation({
    mutationFn: (
      data: AuditTypeItemFormData & { audit_type_id: number; order: number }
    ) => {
      return axios.put(`/audits/types/items/${item.id}`, data);
    },
    onSuccess: () => {
      toast.success("Item editado exitosamente");
      // Llamar al callback para actualizar la lista local
      onItemCreated?.();
      onClose();
    },
    onError: () => {
      toast.error("Error al editar el item");
    },
  });

  const onSubmit = (data: AuditTypeItemFormData) => {
    editAuditTypeItemMutation.mutate({
      id: data.id,
      name: data.name,
      term: data.term,
      laws: data.laws,
      audit_type_id: type.id,
      order: data.order,
    });
  };

  return (
    <FormProvider {...formData}>
      <Dialog open={open} onClose={onClose}>
        <form onSubmit={formData.handleSubmit(onSubmit)}>
          <BoxColumn gap={3}>
            <Typography variant="h3" component="h3">
              Editar Item
            </Typography>
            <Typography variant="body1" component="p">
              Ingrese los datos del item que desea editar para el tipo de
              auditoria .
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
                  value={formData.watch("term")}
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
              <Button onClick={onClose}>Cancelar</Button>
              <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                loading={editAuditTypeItemMutation.isPending}
                disabled={!formData.formState.isValid}
              >
                Editar Item
              </LoadingButton>
            </BoxRow>
          </BoxColumn>
        </form>
      </Dialog>
    </FormProvider>
  );
}

const auditTypeItemSchema = z.object({
  id: z.number().min(1, "El id es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  term: z.string().min(1, "El término es requerido"),
  laws: z.string().min(1, "Las leyes son requeridas"),
  order: z.number().min(1, "El orden es requerido"),
});

type AuditTypeItemFormData = z.infer<typeof auditTypeItemSchema>;
