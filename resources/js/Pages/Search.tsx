import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  Box,
  Button,
  Container,
  Grid,
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
} from "@mui/material";
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  AccountCircle,
  Add as AddIcon,
} from "@mui/icons-material";
import { IPublication, ICategory } from "@/types/publication.interface";
import { IUser } from "@/types/user.interface";

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

export default function Search({ publications, categories, filters }: SearchProps) {
  const { auth } = usePage().props as any;
  const user = auth?.user as IUser | null;
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [categoryId, setCategoryId] = useState(filters.category_id || "");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get("/search", {
      search: searchQuery,
      category_id: categoryId || undefined,
    });
  };

  const handleCategoryChange = (value: any) => {
    setCategoryId(value);
    router.get("/search", {
      search: searchQuery,
      category_id: value || undefined,
    });
  };

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
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Buscar clasificados..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton type="submit" color="primary">
                          <SearchIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={categoryId}
                      label="Categoría"
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      <MenuItem value="">Todas las categorías</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
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
          <Grid container spacing={3}>
            {publications.data.map((publication) => (
              <Grid item xs={12} sm={6} md={4} key={publication.id}>
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
                      onClick={() => router.get(`/publication/${publication.id}`)}
                    >
                      Ver Detalles
                    </Button>
                    <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                      <FavoriteIcon fontSize="small" color="error" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {publication.likes_count}
                      </Typography>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
