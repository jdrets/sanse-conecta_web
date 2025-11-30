import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { router } from "@inertiajs/react";

export const MainLayout = ({
  children,
  withoutHeader,
}: {
  children: React.ReactNode;
  withoutHeader?: boolean;
}) => {
  const user = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    <Box>
      {!withoutHeader && (
        <AppBar position="sticky">
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
                <IconButton
                  size="large"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
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
                <Button
                  color="inherit"
                  onClick={() => router.get("/auth/login")}
                >
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
      )}

      <Box component="main">{children}</Box>
    </Box>
  );
};
