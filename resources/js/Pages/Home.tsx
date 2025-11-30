import React, { useState } from "react";
import { router } from "@inertiajs/react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  AccountCircle,
} from "@mui/icons-material";
import { ICategory } from "@/types/publication.interface";
import { IUser } from "@/types/user.interface";
import { useAuth } from "@/hooks/useAuth";

interface HomeProps {
  categories: ICategory[];
  user: IUser;
}

export default function Home({ categories }: HomeProps) {
  const user = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get("/search", { search: searchQuery });
  };

  const handleCategoryClick = (categoryId: number) => {
    router.get("/search", { category_id: categoryId });
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
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
                <MenuItem disabled>
                  <Typography variant="body2">{user.email}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
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

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Clasificados del Barrio
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            Encuentra servicios, productos y mucho más en tu comunidad
          </Typography>

          {/* Search Bar */}
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              fullWidth
              placeholder="¿Qué estás buscando?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
              InputProps={{
                endAdornment: (
                  <IconButton type="submit" color="primary">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          Categorías
        </Typography>
        <Grid container spacing={3}>
          {categories.map(category => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h2" sx={{ mb: 1 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          py: 3,
          mt: 6,
        }}
      >
        <Container>
          <Typography variant="body2" align="center">
            © 2025 Sanse Conecta. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
