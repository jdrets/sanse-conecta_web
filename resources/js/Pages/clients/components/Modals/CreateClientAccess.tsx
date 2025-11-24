import { BoxColumn, BoxRow } from "@/components";
import { Button, Dialog, TextField, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";
import { router } from "@inertiajs/react";

export default function CreateClientAccess({
  isOpen,
  onClose,
  selectedClient,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedClient?: { id: number; name: string };
}) {
  const formData = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const createUserAccessMutation = useMutation({
    mutationFn: (data: ClientFormData & { client_id: number }) => {
      return axios.post("/clients/user-access", data);
    },
    onSuccess: () => {
      toast.success("Usuario creado exitosamente");
      router.reload({ only: ["clients"] });
      onClose();
    },
    onError: () => {
      toast.error("Error al crear el usuario");
    },
  });

  const onSubmit = (data: ClientFormData) => {
    createUserAccessMutation.mutate({
      ...data,
      client_id: selectedClient!.id,
    });
  };

  return (
    <FormProvider {...formData}>
      <Dialog open={isOpen} onClose={onClose}>
        <form onSubmit={formData.handleSubmit(onSubmit)}>
          <BoxColumn gap={3}>
            <Typography variant="h3" component="h3">
              Crear Acceso
            </Typography>
            <Typography variant="body1" component="p">
              Ingrese los datos del usuario que desea crear para el cliente{" "}
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{
                  color: "primary.main",
                  textTransform: "capitalize",
                }}
              >
                {selectedClient?.name}
              </Typography>
            </Typography>

            <BoxColumn gap={2}>
              <TextField
                label="Usuario"
                placeholder="Ingrese el usuario"
                {...formData.register("email")}
                error={!!formData.formState.errors.email}
                helperText={formData.formState.errors.email?.message}
              />
              <TextField
                label="Contraseña"
                placeholder="Ingrese la contraseña"
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
                loading={createUserAccessMutation.isPending}
                disabled={!formData.formState.isValid}
              >
                Crear Acceso
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
