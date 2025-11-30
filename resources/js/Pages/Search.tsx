import React, { useState } from "react";
import { router } from "@inertiajs/react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  ButtonBase,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  PersonOutline,
} from "@mui/icons-material";
import { IPublication, ICategory } from "@/types/publication.interface";
import { MainLayout } from "../components/Layouts/Layout";
import ContentLayout from "../components/Layouts/ContentLayout";
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
  selectedCategory?: ICategory;
}

export default function Search({
  publications,
  categories,
  filters,
  selectedCategory,
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [categoryId, setCategoryId] = useState(selectedCategory?.id || "");
  const [selectedParent, setSelectedParent] = useState<number | "">(
    selectedCategory?.parent_id || selectedCategory?.id || ""
  );
  console.log("🚀 ~ Search ~ selectedParent:", selectedParent);

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
    setSelectedParent(parentId || selectedCategory?.id || "");
    setCategoryId(parentId || selectedCategory?.id || ""); // Resetear subcategoría
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
  const totalResults = publications.data.length;

  return (
    <MainLayout>
      <ContentLayout
        headContent={
          <Card>
            <Box component="form" onSubmit={handleSearch}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por nombre"
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
                  {selectedParent && (
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
                  )}
                </Stack>

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="text"
                    onClick={handleClearFilters}
                    disabled={!searchQuery && !categoryId}
                  >
                    Limpiar filtros
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    color="secondary"
                    startIcon={<SearchIcon />}
                  >
                    Buscar
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Card>
        }
      >
        {publications.data.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron resultados
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            <Typography variant="body1" gutterBottom>
              {totalResults} resultado encontrado
              {totalResults > 1 ? "s" : ""}
            </Typography>
            {publications.data.map(publication => (
              <ButtonBase
                onClick={() => router.get(`/publication/${publication.id}`)}
                key={publication.id}
                sx={{
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {publication.category && (
                        <Chip
                          label={publication.category.name}
                          icon={<span>{publication.category.icon}</span>}
                          size="small"
                          color="primary"
                          sx={{ width: "fit-content", fontWeight: 600 }}
                        />
                      )}

                      <Box
                        sx={{
                          ml: "auto",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FavoriteIcon fontSize="small" color="error" />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {publication.likes_count}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography gutterBottom variant="h4" component="h2">
                      {publication.title}
                    </Typography>

                    <Divider />

                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {publication.user && (
                        <Typography variant="body2">
                          <PersonOutline /> {publication.user.name}
                        </Typography>
                      )}

                      <Button
                        size="small"
                        sx={{ width: "fit-content", alignSelf: "flex-end" }}
                        onClick={() =>
                          router.get(`/publication/${publication.id}`)
                        }
                      >
                        Ver Detalles
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </ButtonBase>
            ))}
          </Stack>
        )}
      </ContentLayout>
    </MainLayout>
  );
}
