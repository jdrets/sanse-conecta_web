import React, { useState } from "react";
import { router } from "@inertiajs/react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Menu,
  MenuItem as MenuItemComponent,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  AccountCircle,
  Add as AddIcon,
} from "@mui/icons-material";
import { IPublication, ICategory } from "@/types/publication.interface";
import { useAuth } from "@/hooks/useAuth";
interface SearchProps {
  publications: {
    data: IPublication[];
    current_page: number;
    last_page: number;
  };
  categories: ICategory[];
  filters: {
    search?: string;
    category_id?: number;
  };
}

export default function Search({
  publications,
  categories,
  filters,
}: SearchProps) {
  const user = useAuth();
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [categoryId, setCategoryId] = useState(filters.category_id || "");
  const [selectedParent, setSelectedParent] = useState<number | "">("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Encontrar la categoría padre si hay un filtro de categoría
  React.useEffect(() => {
    if (filters.category_id && categories.length > 0) {
      const allCategories = categories.flatMap(parent => [
        parent,
        ...(parent.children || []),
      ]);
      const currentCategory = allCategories.find(
        cat => cat.id === filters.category_id
      );
      if (currentCategory?.parent_id) {
        setSelectedParent(currentCategory.parent_id);
      }
    }
  }, [filters.category_id, categories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleApplyFilters();
  };

  const handleParentChange = (parentId: number | "") => {
    setSelectedParent(parentId);
    setCategoryId(""); // Resetear subcategoría
    // No hacer búsqueda aquí, solo cambiar el estado
  };

  const handleCategoryChange = (value: any) => {
    setCategoryId(value);
  };

  const handleApplyFilters = () => {
    router.get("/search", {
      search: searchQuery || undefined,
      category_id: categoryId ? Number(categoryId) : undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedParent("");
    setCategoryId("");
    router.get("/search");
  };

  // Filtrar subcategorías basadas en la categoría padre seleccionada
  const childCategories = selectedParent
    ? categories.find(cat => cat.id === selectedParent)?.children || []
    : [];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.post("/auth/logout");
  };

  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
    >
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => router.get("/")}
          >
            Sanse Conecta
          </Typography>
          {user ? (
            <>
              <Button
                color="inherit"
                onClick={() => router.get("/publication/create")}
              >
                <AddIcon sx={{ mr: 1 }} />
                Publicar Clasificado
              </Button>
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
          ) : (
            <>
              <Button color="inherit" onClick={() => router.get("/auth/login")}>
                Iniciar Sesión
              </Button>
              <Button
                color="inherit"
                onClick={() => router.get("/auth/register")}
              >
                Registrarse
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        {/* Search Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box component="form" onSubmit={handleSearch}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    placeholder="Buscar clasificados..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <FormControl sx={{ minWidth: { xs: "100%", md: 200 } }}>
                    <InputLabel>Categoría Principal</InputLabel>
                    <Select
                      value={selectedParent}
                      label="Categoría Principal"
                      onChange={e =>
                        handleParentChange(e.target.value as number)
                      }
                    >
                      <MenuItem value="">Todas las categorías</MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    sx={{ minWidth: { xs: "100%", md: 200 } }}
                    disabled={!selectedParent}
                  >
                    <InputLabel>Subcategoría</InputLabel>
                    <Select
                      value={categoryId}
                      label="Subcategoría"
                      onChange={e => handleCategoryChange(e.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      {childCategories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    disabled={!searchQuery && !categoryId}
                  >
                    Limpiar filtros
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    startIcon={<SearchIcon />}
                  >
                    Buscar
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Results */}
        <Typography variant="h5" gutterBottom>
          Resultados ({publications.data.length})
        </Typography>

        {publications.data.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron clasificados
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {publications.data.map(publication => (
              <Box key={publication.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {publication.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={`/storage/${publication.image}`}
                      alt={publication.title}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {publication.title}
                    </Typography>
                    {publication.category && (
                      <Chip
                        label={publication.category.name}
                        icon={<span>{publication.category.icon}</span>}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {publication.description}
                    </Typography>
                    {publication.user && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Por: <strong>{publication.user.name}</strong>
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() =>
                        router.get(`/publication/${publication.id}`)
                      }
                    >
                      Ver Detalles
                    </Button>
                    <Box
                      sx={{ ml: "auto", display: "flex", alignItems: "center" }}
                    >
                      <FavoriteIcon fontSize="small" color="error" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {publication.likes_count}
                      </Typography>
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
