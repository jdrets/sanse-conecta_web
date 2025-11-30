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
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  AccountCircleOutlined as AccountCircle,
  LogoutOutlined as LogoutIcon,
  BookmarksOutlined as BookmarksIcon,
  SettingsOutlined as SettingsIcon,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { router } from "@inertiajs/react";
import logo from "../../../assets/logo.png";

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
        <AppBar position="sticky" sx={{ boxShadow: "none" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Box
                component="img"
                src={logo}
                alt="Sanse Conecta"
                sx={{ height: 40 }}
                onClick={() => router.get("/")}
              />
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
                  sx={{}}
                >
                  <MenuItem>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <AccountCircle />

                      <Typography variant="body2" sx={{ fontSize: "14px" }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>

                  <Divider />

                  <MenuItemCustom
                    icon={<BookmarksIcon />}
                    label="Mis publicaciones"
                    onClick={() => router.get("/me/publications")}
                  />
                  <MenuItemCustom
                    icon={<SettingsIcon />}
                    label="Mi cuenta"
                    onClick={() => router.get("/me/account")}
                  />
                  <MenuItemCustom
                    icon={<LogoutIcon />}
                    label="Cerrar Sesión"
                    onClick={handleLogout}
                  />
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

const MenuItemCustom = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <MenuItem onClick={onClick}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon}
        <Typography variant="body2" sx={{ fontSize: "14px" }}>
          {label}
        </Typography>
      </Box>
    </MenuItem>
  );
};
