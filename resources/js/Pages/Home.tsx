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
import { Search as SearchIcon } from "@mui/icons-material";
import { ICategory } from "@/types/publication.interface";
import { MainLayout } from "@/components/Layouts/Layout";

interface HomeProps {
  categories: ICategory[];
}

export default function Home({ categories }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<ICategory | null>(null);

  const handleSearch = (e: React.FormEvent) => {
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
          <Typography variant="h2" component="h1" gutterBottom align="center">
            Hola!
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Encuentra servicios, productos y mucho más en tu comunidad
          </Typography>

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

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  disabled={!selectedCategory}
                >
                  <SearchIcon />
                  Buscar
                </Button>
              </Stack>
            </Card>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}
