import { useState } from "react";
import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  PersonOutlined as PersonOutlinedIcon,
  LocationOn as LocationIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  ShareOutlined as ShareIcon,
} from "@mui/icons-material";
import { IPublication } from "@/types/publication.interface";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { MainLayout } from "../components/Layouts/Layout";
import ContentLayout from "../components/Layouts/ContentLayout";
import Modal from "../components/Modal";
import { useDisclosure } from "@chakra-ui/hooks";

interface PublicationDetailsProps {
  publication: IPublication;
  isLiked: boolean;
}

interface LikeResponse {
  success: boolean;
  message: string;
  liked: boolean;
  likes_count: number;
}

export default function PublicationDetails({
  publication,
  isLiked,
}: PublicationDetailsProps) {
  const user = useAuth();
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(publication.likes_count);
  const unauthenticatedDisclosure = useDisclosure();

  const likeMutation = useMutation({
    mutationFn: async (publicationId: number) => {
      const response = await axios.post<LikeResponse>(
        `/publication/${publicationId}/like`
      );
      return response.data;
    },
    onSuccess: data => {
      setLiked(data.liked);
      setLikesCount(data.likes_count);
      toast.success(data.message);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al procesar la solicitud";
      toast.error(message);
    },
  });

  const handleLike = () => {
    if (!user) {
      unauthenticatedDisclosure.onOpen();
      return;
    }

    likeMutation.mutate(publication.id);
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
  console.log("🚀 ~ PublicationDetails ~ user:", user);

  const handleShare = () => {
    navigator.share({
      title: publication.title,
      text: publication.description,
      url: `${window.location.origin}/publication/${publication.id}`,
    });
  };

  return (
    <MainLayout>
      <ContentLayout
        headContent={
          <Card sx={{ p: 0 }}>
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
                {/* Share button */}
                <IconButton onClick={handleShare} color="primary">
                  <ShareIcon />
                </IconButton>
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

              <Stack direction="row" justifyContent="space-between">
                {/* Like Button */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <FavoriteIcon fontSize="small" color="error" /> {likesCount}{" "}
                    {likesCount === 1 ? "persona" : "personas"} le gusta esto
                  </Typography>
                </Box>
                {!isOwner && (
                  <Button
                    variant={liked ? "contained" : "outlined"}
                    color="error"
                    startIcon={
                      liked ? <FavoriteIcon /> : <FavoriteBorderIcon />
                    }
                    onClick={handleLike}
                    disabled={likeMutation.isPending}
                  >
                    {likeMutation.isPending
                      ? "Procesando..."
                      : liked
                        ? "Te gusta"
                        : "Me gusta"}
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        }
      >
        <Card>
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
                  <Typography variant="body2">
                    {publication.user.email}
                  </Typography>
                </Box>
              )}

              {publication.user.phone && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2">
                    {publication.user.phone}
                  </Typography>
                </Box>
              )}

              {publication.user.address && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2">
                    {publication.user.address}
                  </Typography>
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
        </Card>
      </ContentLayout>

      <Modal
        open={unauthenticatedDisclosure.isOpen}
        onClose={unauthenticatedDisclosure.onClose}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              backgroundColor: "primary.main",
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
            <PersonOutlinedIcon sx={{ fontSize: 40 }} />
          </Box>

          <Stack spacing={0.5} textAlign="center">
            <Typography variant="body1" fontWeight={600}>
              Iniciar sesión o registrarse
            </Typography>
            <Typography variant="body2">
              Para poder recomendar este clasificado, debes registrarte o
              iniciar sesión.
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Button variant="contained" fullWidth href="/auth/register">
              Iniciar sesión
            </Button>
            <Button variant="text" fullWidth href="/auth/login">
              Registrarse
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </MainLayout>
  );
}
