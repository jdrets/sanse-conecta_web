import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
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
import { Link } from "@inertiajs/react";

export default function LoginPage() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/auth/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                error={!!errors.email}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                error={!!errors.password}
                margin="normal"
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={processing}
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar Sesión
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

