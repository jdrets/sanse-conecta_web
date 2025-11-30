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
  Alert,
} from "@mui/material";

interface LoginResponse {
  success: boolean;
  message: string;
  redirect?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  errors?: {
    email?: string[];
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await axios.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    },
    onSuccess: data => {
      if (data.success) {
        toast.success(data.message);
        // Redirect después de un breve delay para que se vea el toast
        setTimeout(() => {
          router.visit(data.redirect || "/");
        }, 500);
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        setErrors({
          email: errorData.errors?.email?.[0] || errorData.message,
        });
        toast.error(errorData.message || "Error al iniciar sesión");
      } else {
        toast.error("Error al iniciar sesión. Por favor intenta de nuevo.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    loginMutation.mutate({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Iniciar Sesión
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Accede a Sanse Conecta
            </Typography>

            {errors.email && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.email}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                margin="normal"
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loginMutation.isPending}
                sx={{ mt: 3, mb: 2 }}
              >
                {loginMutation.isPending
                  ? "Iniciando sesión..."
                  : "Iniciar Sesión"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">
                  ¿No tienes cuenta?{" "}
                  <Link href="/auth/register">
                    <MuiLink component="span" sx={{ cursor: "pointer" }}>
                      Regístrate aquí
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
