import React, { useState } from "react";
import { router, Link } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Link as MuiLink,
  Grid,
} from "@mui/material";

interface RegisterResponse {
  success: boolean;
  message: string;
  redirect?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await axios.post<RegisterResponse>(
        "/auth/register",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          router.visit(data.redirect || "/");
        }, 500);
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const formattedErrors: Record<string, string> = {};
          Object.keys(errorData.errors).forEach((key) => {
            formattedErrors[key] = errorData.errors[key][0];
          });
          setErrors(formattedErrors);
        }
        toast.error(errorData.message || "Error al registrar usuario");
      } else {
        toast.error("Error al registrar. Por favor intenta de nuevo.");
      }
    },
  });

  const handleChange = (field: keyof RegisterData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    registerMutation.mutate(formData);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Registro
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Crea tu cuenta en Sanse Conecta
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre completo"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmar contraseña"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      handleChange("password_confirmation", e.target.value)
                    }
                    error={!!errors.password_confirmation}
                    helperText={errors.password_confirmation}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={registerMutation.isPending}
                sx={{ mt: 3, mb: 2 }}
              >
                {registerMutation.isPending ? "Registrando..." : "Registrarse"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/auth/login">
                    <MuiLink component="span" sx={{ cursor: "pointer" }}>
                      Inicia sesión aquí
                    </MuiLink>
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

