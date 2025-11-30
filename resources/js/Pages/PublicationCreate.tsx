import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import {
  Box,
  Button,
  Typography,
  Card,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  NotInterestedOutlined,
  Close as CloseIcon,
} from "@mui/icons-material";
import { ICategory } from "@/types/publication.interface";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "../components/Layouts/Layout";
import { useDisclosure } from "@chakra-ui/hooks";
import Modal from "@/components/Modal";
import ContentLayout from "@/components/Layouts/ContentLayout";

interface PublicationCreateProps {
  categories: ICategory[];
  usedCategories: number[];
  remainingPublications: number;
  canPublishMore: boolean;
}

export default function PublicationCreate({
  categories,
  usedCategories,
  remainingPublications,
  canPublishMore,
}: PublicationCreateProps) {
  const user = useAuth();
  console.log("🚀 ~ PublicationCreate ~ user:", user);
  const cantPublishMoreDisclosure = useDisclosure({
    defaultIsOpen: !canPublishMore,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedParent, setSelectedParent] = useState<number | "">("");

  const { data, setData, post, processing, errors } = useForm({
    category_id: "",
    title: "",
    description: "",
    image: null as File | null,
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
      <ContentLayout
        headContent={
          <Typography variant="h4" color="white" textAlign="center">
            Crear Nuevo Clasificado
          </Typography>
        }
      >
        <Card>
          <Alert severity="info" sx={{ mb: 3 }}>
            Publicaciones restantes: {remainingPublications} de{" "}
            {user?.publication_max || 3}
          </Alert>

          {errors?.message && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors?.message}
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

              {!imagePreview && (
                <>
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
                </>
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

              <Divider />

              <Stack spacing={1} direction={{ xs: "column", md: "row" }}>
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
                  variant="text"
                  size="large"
                  onClick={() => router.get("/")}
                  disabled={processing}
                >
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </ContentLayout>

      <Modal open={cantPublishMoreDisclosure.isOpen}>
        <Stack spacing={2}>
          <Box
            sx={{
              backgroundColor: "error.main",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              color: "white",
              alignSelf: "center",
            }}
          >
            <NotInterestedOutlined sx={{ fontSize: 40 }} />
          </Box>

          <Stack spacing={0.5} textAlign="center">
            <Typography variant="body1" fontWeight={600}>
              Alcanzaste el límite de publicaciones permitidas.
            </Typography>
            <Typography variant="body2">
              Para poder publicar más clasificados, debes actualizar tu plan o
              contactar a soporte.
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Button variant="contained" fullWidth href="/">
              Volver a la página principal
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </MainLayout>
  );
}
