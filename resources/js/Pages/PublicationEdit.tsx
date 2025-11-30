import React, { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  IconButton,
  Menu,
  MenuItem as MenuItemComponent,
} from "@mui/material";
import {
  AccountCircle,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { IPublication, ICategory } from "@/types/publication.interface";
import { IUser } from "@/types/user.interface";

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
  const { auth } = usePage().props as any;
  const user = auth?.user as IUser | null;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    publication.image ? `/storage/${publication.image}` : null
  );

  const { data, setData, post, processing, errors } = useForm({
    category_id: publication.category_id,
    title: publication.title,
    description: publication.description,
    image: null as File | null,
    _method: "PUT",
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
    post(`/publication/${publication.id}`, {
      forceFormData: true,
    });
  };

  const availableCategories = categories.filter(
    (cat) => !usedCategories.includes(cat.id) || cat.id === publication.category_id
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.get(`/publication/${publication.id}`)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Editar Clasificado
          </Typography>
          {user && (
            <>
              <IconButton size="large" onClick={handleMenuOpen} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItemComponent disabled>
                  <Typography variant="body2">{user.email}</Typography>
                </MenuItemComponent>
                <MenuItemComponent onClick={handleLogout}>
                  Cerrar Sesión
                </MenuItemComponent>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }} maxWidth="md">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Editar Clasificado
            </Typography>

            {errors.message && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.category_id}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={data.category_id}
                      label="Categoría"
                      onChange={(e) =>
                        setData("category_id", e.target.value as number)
                      }
                      required
                    >
                      {availableCategories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
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
                    onChange={(e) => setData("title", e.target.value)}
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
                    onChange={(e) => setData("description", e.target.value)}
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
                      Guardar Cambios
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => router.get(`/publication/${publication.id}`)}
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
    </Box>
  );
}

