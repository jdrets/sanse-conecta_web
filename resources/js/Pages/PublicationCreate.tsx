import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { ICategory } from "@/types/publication.interface";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "../components/Layouts/Layout";

interface PublicationCreateProps {
  categories: ICategory[];
  usedCategories: number[];
  remainingPublications: number;
}

export default function PublicationCreate({
  categories,
  usedCategories,
  remainingPublications,
}: PublicationCreateProps) {
  const user = useAuth();
  console.log("🚀 ~ PublicationCreate ~ auth:", user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedParent, setSelectedParent] = useState<number | "">("");

  const { data, setData, post, processing, errors } = useForm({
    category_id: "",
    title: "",
    description: "",
    image: null as File | null,
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.post("/auth/logout");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/publication", {
      forceFormData: true,
    });
  };

  // Filtrar categorías padre (sin parent_id)
  const parentCategories = categories.filter(cat => !cat.parent_id);

  // Filtrar subcategorías basadas en la categoría padre seleccionada
  const childCategories = selectedParent
    ? categories.filter(
        cat =>
          cat.parent_id === selectedParent && !usedCategories.includes(cat.id)
      )
    : [];

  const handleParentChange = (parentId: number | "") => {
    setSelectedParent(parentId);
    setData("category_id", ""); // Resetear la subcategoría seleccionada
  };

  return (
    <MainLayout>
      <Container sx={{ py: 4 }} maxWidth="md">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Crear Nuevo Clasificado
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Publicaciones restantes: {remainingPublications} de{" "}
              {user?.publication_max || 3}
            </Alert>

            {errors.message && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoría Principal</InputLabel>
                    <Select
                      value={selectedParent}
                      label="Categoría Principal"
                      onChange={e =>
                        handleParentChange(e.target.value as number)
                      }
                      required
                    >
                      <MenuItem value="">
                        <em>Selecciona una categoría</em>
                      </MenuItem>
                      {parentCategories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    error={!!errors.category_id}
                    disabled={!selectedParent}
                  >
                    <InputLabel>Subcategoría</InputLabel>
                    <Select
                      value={data.category_id}
                      label="Subcategoría"
                      onChange={e => setData("category_id", e.target.value)}
                      required
                    >
                      <MenuItem value="">
                        <em>Selecciona una subcategoría</em>
                      </MenuItem>
                      {childCategories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category_id && (
                      <Typography variant="caption" color="error">
                        {errors.category_id}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Título"
                    value={data.title}
                    onChange={e => setData("title", e.target.value)}
                    error={!!errors.title}
                    helperText={errors.title}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    multiline
                    rows={6}
                    value={data.description}
                    onChange={e => setData("description", e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    Subir Imagen
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {errors.image && (
                    <Typography variant="caption" color="error">
                      {errors.image}
                    </Typography>
                  )}
                  {imagePreview && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={processing}
                      fullWidth
                    >
                      Publicar
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => router.get("/")}
                      disabled={processing}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}
