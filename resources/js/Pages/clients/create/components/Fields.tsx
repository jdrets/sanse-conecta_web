import {
  Card,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
import { BoxColumn, BoxRow, Dropzone } from "@/components";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { ClientCategory } from "@/types";
import { Link, router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";

export default function Fields({
  categories,
}: {
  categories: ClientCategory[];
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useFormContext();
  const [files, setFiles] = useState<File[]>([]);

  const createClientMutation = useMutation({
    mutationFn: (data: any) => {
      return axios.post("/clients", data);
    },
    onSuccess: data => {
      router.visit("/clients");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al crear el cliente");
    },
  });

  const onSubmit = (data: any) => {
    createClientMutation.mutate(data);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BoxColumn gap={3}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BoxColumn gap={3}>
                <Typography variant="h6" component="h2">
                  Información del Cliente
                </Typography>

                <TextField
                  {...register("name")}
                  label="Nombre"
                  placeholder="Nombre del cliente"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message as string}
                />

                <TextField
                  {...register("address")}
                  label="Domicilio"
                  placeholder="Domicilio del cliente"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message as string}
                />

                <TextField
                  {...register("cadastralNomenclature")}
                  label="Nomenclatura Catastral"
                  placeholder="Nomenclatura catastral"
                  fullWidth
                  error={!!errors.cadastralNomenclature}
                  helperText={errors.cadastralNomenclature?.message as string}
                />

                <TextField
                  {...register("phone")}
                  label="Teléfono"
                  placeholder="Teléfono del cliente"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message as string}
                />

                <TextField
                  {...register("cuit")}
                  label="CUIT"
                  placeholder="CUIT del cliente"
                  fullWidth
                  error={!!errors.cuit}
                  helperText={errors.cuit?.message as string}
                />
              </BoxColumn>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BoxColumn gap={3}>
                <Typography variant="h6" component="h2">
                  Información de Contacto y Auditorías
                </Typography>

                <TextField
                  {...register("contactName")}
                  label="Nombre contacto"
                  placeholder="Nombre del responsable"
                  fullWidth
                  error={!!errors.contactName}
                  helperText={errors.contactName?.message as string}
                />

                <TextField
                  {...register("responsibleEmail")}
                  label="Email Responsable"
                  placeholder="Email del responsable"
                  fullWidth
                  type="email"
                  error={!!errors.responsibleEmail}
                  helperText={errors.responsibleEmail?.message as string}
                />

                <TextField
                  {...register("environmentalAuditResponsible")}
                  label="Responsable de Auditorías de Gestión Ambiental"
                  placeholder="Email del responsable"
                  fullWidth
                  type="email"
                  error={!!errors.environmentalAuditResponsible}
                  helperText={
                    errors.environmentalAuditResponsible?.message as string
                  }
                />

                <TextField
                  {...register("safetyAuditResponsible")}
                  label="Responsable de Auditorías de Higiene y Seguridad"
                  placeholder="Email del responsable"
                  fullWidth
                  type="email"
                  error={!!errors.safetyAuditResponsible}
                  helperText={errors.safetyAuditResponsible?.message as string}
                />

                <TextField
                  {...register("category")}
                  label="Rubro General"
                  placeholder="Elige un rubro..."
                  fullWidth
                  select
                  error={!!errors.category}
                  helperText={errors.category?.message as string}
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </BoxColumn>
            </Grid>
          </Grid>

          <BoxColumn gap={2}>
            <Typography variant="h6" component="h3">
              Documentos del Cliente
            </Typography>
            <Dropzone
              acceptedFiles={["image/*", "application/pdf"]}
              dropzoneText="Arrastra y suelta archivos aquí o haz clic para seleccionar"
              onFilesChange={selectedFiles => setFiles(selectedFiles)}
              maxFiles={10}
              maxSize={20 * 1024 * 1024} // 20MB
            />
          </BoxColumn>

          <BoxRow justifyContent="flex-end" gap={2}>
            <Link href="/clients">
              <Button>Cancelar</Button>
            </Link>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={createClientMutation.isPending}
            >
              Guardar Cliente
            </LoadingButton>
          </BoxRow>
        </BoxColumn>
      </form>
    </Card>
  );
}
