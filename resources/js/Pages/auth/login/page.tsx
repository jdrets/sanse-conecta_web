import { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  Alert,
  Card,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoadingButton } from "@mui/lab";
import Logo from "@/assets/logo.png";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { router } from "@inertiajs/react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const formData = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => {
      setError(null);
      return axios.post("/auth/login", data);
    },
    onSuccess: () => {
      router.visit("/");
    },
    onError: (errors: any) => {
      if (errors.response?.data?.errors?.email) {
        setError(errors.response.data.errors.email[0]);
      } else {
        setError("Error al iniciar sesión. Verifica tus credenciales.");
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme =>
          `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.background.default} 100%)`,
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            padding: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{
                height: 80,
                width: "auto",
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                textAlign: "center",
              }}
            >
              Consultora Industrial
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                mt: 1,
              }}
            >
              Inicia sesión para acceder al sistema
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <FormProvider {...formData}>
            <form onSubmit={formData.handleSubmit(onSubmit)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  {...formData.register("email")}
                  error={!!formData.formState.errors.email}
                  helperText={formData.formState.errors.email?.message}
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  {...formData.register("password")}
                  error={!!formData.formState.errors.password}
                  helperText={formData.formState.errors.password?.message}
                  fullWidth
                  variant="outlined"
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  loading={loginMutation.isPending}
                  disabled={!formData.formState.isValid}
                >
                  Iniciar Sesión
                </LoadingButton>
              </Box>
            </form>
          </FormProvider>

          {/* <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ¿Problemas para acceder?{" "}
              <Button
                variant="text"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Contacta soporte
              </Button>
            </Typography>
          </Box> */}
        </Card>
      </Container>
    </Box>
  );
}
