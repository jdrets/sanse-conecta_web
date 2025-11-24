import { BoxColumn, BoxRow } from "@/components";
import { Button, Dialog, TextField, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { IClient } from "@/types";
import { LoadingButton } from "@mui/lab";

export default function ViewClientAccess({
  isOpen,
  onClose,
  client,
}: {
  isOpen: boolean;
  onClose: () => void;
  client?: IClient;
}) {
  if (!isOpen) return null;

  const formData = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
    defaultValues: {
      email: client?.user_access?.email ?? "",
      password: "",
    },
  });

  const modifyUserAccessPasswordMutation = useMutation({
    mutationFn: (data: ClientFormData & { client_id: number }) => {
      return axios.put("/clients/user-access", data);
    },
    onSuccess: () => {
      toast.success("Contraseña modificada exitosamente");
      onClose();
    },
    onError: () => {
      toast.error("Error al modificar la contraseña");
    },
  });

  const onSubmit = (data: ClientFormData) => {
    modifyUserAccessPasswordMutation.mutate({
      ...data,
      client_id: client!.id,
    });
  };

  return (
    <FormProvider {...formData}>
      <Dialog open={isOpen} onClose={onClose}>
        <form onSubmit={formData.handleSubmit(onSubmit)}>
          <BoxColumn gap={3}>
            <Typography variant="h3" component="h3">
              Acceso
            </Typography>
            <Typography variant="body1" component="p">
              Acceso configurado para el cliente{" "}
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

            <BoxColumn gap={2}>
              <TextField
                label="Usuario"
                placeholder="Ingrese el usuario"
                {...formData.register("email")}
                error={!!formData.formState.errors.email}
                helperText={formData.formState.errors.email?.message}
                disabled={true}
              />
              <TextField
                label="Nueva contraseña"
                placeholder="Nueva contraseña"
                {...formData.register("password")}
                error={!!formData.formState.errors.password}
                helperText={formData.formState.errors.password?.message}
              />
            </BoxColumn>

            <BoxRow justifyContent="flex-end" gap={2}>
              <Button onClick={onClose}>Cancelar</Button>
              <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                loading={modifyUserAccessPasswordMutation.isPending}
                disabled={!formData.formState.isValid}
              >
                Cambiar contraseña
              </LoadingButton>
            </BoxRow>
          </BoxColumn>
        </form>
      </Dialog>
    </FormProvider>
  );
}

const clientSchema = z.object({
  email: z
    .string()
    .regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Ingrese un email válido"
    ),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

type ClientFormData = z.infer<typeof clientSchema>;
