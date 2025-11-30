import React, { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import {
  Box,
  Button,
  Typography,
  Card,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { IPublication, ICategory } from "@/types/publication.interface";
import { useAuth } from "@/hooks/useAuth";
import ContentLayout from "../components/Layouts/ContentLayout";
import { MainLayout } from "../components/Layouts/Layout";
import { Close as CloseIcon } from "@mui/icons-material";

interface PublicationEditProps {
  publication: IPublication;
  categories: ICategory[];
  usedCategories: number[];
}

export default function PublicationEdit({
  publication,
  categories,
  usedCategories,
}: PublicationEditProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    publication.image ? `/storage/${publication.image}` : null
  );

  // Encontrar la categoría padre inicial si existe
  const currentCategory = categories.find(
    cat => cat.id === publication.category_id
  );
  const initialParent = currentCategory?.parent_id || "";

  const [selectedParent, setSelectedParent] = useState<number | "">(
    initialParent
  );

  const { data, setData, post, processing, errors } = useForm({
    category_id: publication.category_id,
    title: publication.title,
    description: publication.description,
    image: null as File | null,
    _method: "PUT",
  });

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
    post(`/publication/${publication.id}`, {
      forceFormData: true,
    });
  };

  // Filtrar categorías padre (sin parent_id)
  const parentCategories = categories.filter(cat => !cat.parent_id);

  // Filtrar subcategorías basadas en la categoría padre seleccionada
  const childCategories = selectedParent
    ? categories.filter(
        cat =>
          cat.parent_id === selectedParent &&
          (!usedCategories.includes(cat.id) ||
            cat.id === publication.category_id)
      )
    : [];

  const handleParentChange = (parentId: number | "") => {
    setSelectedParent(parentId);
    setData("category_id", ""); // Resetear la subcategoría seleccionada
  };

  return (
    <MainLayout>
      <ContentLayout
        headContent={
          <Typography variant="h4" color="white" textAlign="center">
            Editar clasificado
          </Typography>
        }
      >
        <Card>
          {errors.message && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Categoría Principal</InputLabel>
                <Select
                  value={selectedParent}
                  label="Categoría Principal"
                  onChange={e => handleParentChange(e.target.value as number)}
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

              <FormControl
                fullWidth
                error={!!errors.category_id}
                disabled={!selectedParent}
              >
                <InputLabel>Subcategoría</InputLabel>
                <Select
                  value={data.category_id}
                  label="Subcategoría"
                  onChange={e =>
                    setData("category_id", e.target.value as number)
                  }
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

              <TextField
                fullWidth
                label="Título"
                value={data.title}
                onChange={e => setData("title", e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                required
              />

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

              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Cambiar Imagen
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
                <Box
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    boxShadow: 5,
                    borderRadius: 1,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      maxHeight: "300px",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "white",
                      color: "black",
                    }}
                    onClick={() => setImagePreview(null)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}

              <Stack spacing={1} direction={{ xs: "column", md: "row" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={processing}
                  fullWidth
                >
                  Guardar Cambios
                </Button>
                <Button
                  variant="text"
                  size="large"
                  onClick={() => router.get(`/publication/${publication.id}`)}
                  disabled={processing}
                >
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </ContentLayout>
    </MainLayout>
  );
}
