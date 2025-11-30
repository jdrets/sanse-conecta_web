import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  Chip,
  IconButton,
  Menu,
  MenuItem as MenuItemComponent,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AccountCircle,
  Add as AddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { IPublication } from "@/types/publication.interface";
import { IUser } from "@/types/user.interface";

interface PublicationDetailsProps {
  publication: IPublication;
  isLiked: boolean;
}

export default function PublicationDetails({
  publication,
  isLiked,
}: PublicationDetailsProps) {
  const { auth } = usePage().props as any;
  const user = auth?.user as IUser | null;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState(isLiked);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.post("/auth/logout");
  };

  const handleLike = () => {
    if (!user) {
      router.get("/auth/login");
      return;
    }
    router.post(`/publication/${publication.id}/like`, {}, {
      onSuccess: () => {
        setLiked(!liked);
      },
    });
  };

  const handleEdit = () => {
    router.get(`/publication/${publication.id}/edit`);
  };

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar este clasificado?")) {
      router.delete(`/publication/${publication.id}`);
    }
  };

  const isOwner = user && publication.user_id === user.id;

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
        <Grid container spacing={3}>
          {/* Publication Image and Details */}
          <Grid item xs={12} md={8}>
            <Card>
              {publication.image && (
                <CardMedia
                  component="img"
                  height="400"
                  image={`/storage/${publication.image}`}
                  alt={publication.title}
                />
              )}
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                    {publication.title}
                  </Typography>
                  {isOwner && (
                    <Box>
                      <IconButton onClick={handleEdit} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={handleDelete} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {publication.category && (
                  <Chip
                    label={publication.category.name}
                    icon={<span>{publication.category.icon}</span>}
                    sx={{ mb: 2 }}
                  />
                )}

                <Typography variant="body1" paragraph>
                  {publication.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Like Button */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant={liked ? "contained" : "outlined"}
                    color="error"
                    startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    onClick={handleLike}
                  >
                    {liked ? "Te gusta" : "Me gusta"}
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {publication.likes_count}{" "}
                    {publication.likes_count === 1 ? "persona" : "personas"} le gusta
                    esto
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información de Contacto
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {publication.user && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>{publication.user.name}</strong>
                  </Typography>

                  {publication.user.email && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">{publication.user.email}</Typography>
                    </Box>
                  )}

                  {publication.user.phone && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">{publication.user.phone}</Typography>
                    </Box>
                  )}

                  {publication.user.address && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocationIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">{publication.user.address}</Typography>
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    href={`mailto:${publication.user.email}`}
                    startIcon={<EmailIcon />}
                  >
                    Contactar
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

