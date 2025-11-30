import React, { useState } from "react";
import { router } from "@inertiajs/react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  Select,
  FormControl,
  InputLabel,
  Stack,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Search as SearchIcon,
  Add as AddIcon,
  PersonOutlined as PersonOutlinedIcon,
} from "@mui/icons-material";
import { ICategory } from "@/types/publication.interface";
import { MainLayout } from "@/components/Layouts/Layout";
import logo from "../assets/logo.png";
import { useDisclosure } from "@chakra-ui/hooks";
import Modal from "../components/Modal";
import { useAuth } from "@/hooks/useAuth";

interface HomeProps {
  categories: ICategory[];
}

export default function Home({ categories }: HomeProps) {
  const user = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<ICategory | null>(null);
  const [loading, setLoading] = useState(false);
  const unauthenticatedDisclosure = useDisclosure();

  const handleSearch = (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    router.get("/search", {
      category_id: selectedSubcategory?.id ?? selectedCategory?.id,
    });
  };

  const handleCategoryChange = (event: any) => {
    const categoryId = event.target.value;
    setSelectedCategory(
      categories.find(category => category.id === categoryId) || null
    );
  };

  const handleSubcategoryChange = (event: any) => {
    const subcategoryId = event.target.value;
    setSelectedSubcategory(
      selectedCategory?.children?.find(
        category => category.id === subcategoryId
      ) || null
    );
  };

  const handleGoToCreatePublication = () => {
    if (user) {
      router.get("/publication/create");
    } else {
      unauthenticatedDisclosure.onOpen();
    }
  };

  return (
    <MainLayout withoutHeader>
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
          color: "white",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3} alignItems="center">
            <Stack spacing={2} alignItems="center">
              <Box
                component="img"
                src={logo}
                alt="Sanse Conecta"
                sx={{ height: 100 }}
              />
              <Typography variant="body1" align="center" sx={{ mb: 4 }}>
                Encuentra lo que necesitas en tu comunidad
              </Typography>
            </Stack>

            <Stack spacing={4}>
              {/* Search Bar */}
              <Box component="form" onSubmit={handleSearch}>
                <Card>
                  <Stack spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        label="Categoría"
                        fullWidth
                        onChange={handleCategoryChange}
                        value={selectedCategory?.id || ""}
                      >
                        {categories.map(category => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Subcategoría</InputLabel>
                      <Select
                        label="Subcategoría"
                        fullWidth
                        onChange={handleSubcategoryChange}
                        value={selectedSubcategory?.id || ""}
                        disabled={!selectedCategory}
                      >
                        <MenuItem value="">Todas</MenuItem>
                        {selectedCategory?.children?.map(category => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <LoadingButton
                      variant="contained"
                      color="primary"
                      onClick={handleSearch}
                      disabled={!selectedCategory}
                      loading={loading}
                      startIcon={<SearchIcon />}
                    >
                      Buscar
                    </LoadingButton>
                  </Stack>
                </Card>
              </Box>

              <Stack spacing={1.5} textAlign="center">
                <Typography variant="body1" fontWeight={600}>
                  Estas buscando publicitar tu servicio o producto?
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleGoToCreatePublication}
                  startIcon={<AddIcon />}
                >
                  Publicar clasificado gratis
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

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
              Para poder publicar un clasificado, debes registrarte o iniciar
              sesión.
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Button
              variant="contained"
              fullWidth
              href="/auth/register"
              onClick={() => router.get("/auth/login")}
            >
              Iniciar sesión
            </Button>
            <Button
              variant="text"
              fullWidth
              href="/auth/login"
              onClick={() => router.get("/auth/register")}
            >
              Registrarse
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </MainLayout>
  );
}
