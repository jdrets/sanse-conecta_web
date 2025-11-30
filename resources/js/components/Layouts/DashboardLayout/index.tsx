import React, { useState } from "react";
import {
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Breadcrumbs,
  Collapse,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ExpandLess, ExpandMore, Logout } from "@mui/icons-material";

import Logo from "@/assets/logo.png";
import { menu } from "./menu";
import { Link, router } from "@inertiajs/react";
import { useAuth } from "@/hooks/useAuth";

const drawerWidth = 248;

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useAuth();

  // Auto-abrir el menú si algún child está activo
  React.useEffect(() => {
    menu.forEach(item => {
      if (item.children && item.children.length > 0) {
        const hasActiveChild = item.children.some(
          child => window.location.pathname === child.path
        );
        if (hasActiveChild) {
          setOpenItems(prev => ({
            ...prev,
            [item.label]: true,
          }));
        }
      }
    });
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    router.post("/auth/logout");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", gap: 1 }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: theme => alpha(theme.palette.primary.main, 0.12),
            backgroundColor: theme =>
              alpha(theme.palette.background.default, 0.5),
            backgroundImage: theme =>
              `linear-gradient(145deg,   rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0.5) 45%,
      rgba(0, 0, 0, 0.5) 100%) radial-gradient(circle at 20% 20%, ${alpha(
        theme.palette.primary.main,
        0.25
      )}, transparent 55%)`,
            backgroundBlendMode: "screen",
            backdropFilter: "blur(6px)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Logo */}
          <Link href="/">
            <Stack direction="row" gap={1.5} sx={{ mb: 3 }}>
              <Box component="img" src={Logo} alt="logo" sx={{ height: 40 }} />
              <Typography variant="body1" fontWeight={600}>
                Consultora industrial
              </Typography>
            </Stack>
          </Link>
          {/* OVERVIEW Section */}
          <Typography
            variant="overline"
            sx={{
              color: "#888",
              fontSize: "0.75rem",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              mb: 1,
            }}
          >
            Menu
          </Typography>
          <List>
            {menu.map(item => {
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openItems[item.label];

              // Verificar si algún child está activo
              const childActive =
                hasChildren &&
                item.children?.some(child =>
                  window.location.pathname.includes(child.path)
                );

              // El item padre está activo si no tiene children y la ruta coincide,
              // o si tiene children y algún child está activo
              const active = hasChildren
                ? childActive
                : window.location.pathname.includes(item.path);

              const handleToggle = () => {
                if (hasChildren) {
                  setOpenItems(prev => ({
                    ...prev,
                    [item.label]: !prev[item.label],
                  }));
                }
              };

              if (!item.allowedRoles?.includes(user.role)) {
                return null;
              }

              return (
                <React.Fragment key={item.label}>
                  <ListItem disablePadding>
                    {hasChildren ? (
                      <ListItemButton
                        onClick={handleToggle}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          bgcolor: theme =>
                            active
                              ? alpha(theme.palette.primary.main, 0.1)
                              : "transparent",
                          "&:hover": {
                            bgcolor: theme =>
                              active
                                ? alpha(theme.palette.primary.main, 0.2)
                                : alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: active ? "primary.main" : "text.primary",
                            minWidth: 40,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          sx={{
                            "& .MuiTypography-root": {
                              color: active ? "primary.main" : "text.primary",
                              fontWeight: active ? "bold" : "normal",
                            },
                          }}
                        />
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    ) : (
                      <Link
                        href={item.path}
                        key={item.label}
                        style={{ width: "100%" }}
                      >
                        <ListItemButton
                          sx={{
                            borderRadius: 1,
                            mb: 0.5,
                            bgcolor: theme =>
                              active
                                ? alpha(theme.palette.primary.main, 0.1)
                                : "transparent",
                            "&:hover": {
                              bgcolor: theme =>
                                active
                                  ? alpha(theme.palette.primary.main, 0.2)
                                  : alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: active ? "primary.main" : "text.primary",
                              minWidth: 40,
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            sx={{
                              "& .MuiTypography-root": {
                                color: active ? "primary.main" : "text.primary",
                                fontWeight: active ? "bold" : "normal",
                              },
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    )}
                  </ListItem>

                  {hasChildren && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children?.map(child => {
                          const childActive =
                            window.location.pathname === child.path;

                          if (!child.allowedRoles?.includes(user.role)) {
                            return null;
                          }

                          return (
                            <Link href={child.path} key={child.label}>
                              <ListItemButton
                                sx={{
                                  pl: 3,
                                  borderRadius: 1,
                                  mb: 0.5,
                                  "&:hover": {
                                    bgcolor: "transparent",
                                  },
                                }}
                              >
                                <ListItemText
                                  primary={`- ${child.label}`}
                                  sx={{
                                    "& .MuiTypography-root": {
                                      color: childActive
                                        ? "primary.main"
                                        : "text.primary",
                                      fontWeight: childActive
                                        ? "bold"
                                        : "normal",
                                    },
                                  }}
                                />
                              </ListItemButton>
                            </Link>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: `calc(100vw - ${drawerWidth}px)`,
          maxWidth: `calc(100vw - ${drawerWidth}px)`,
          overflow: "hidden",
        }}
      >
        {/* Header */}

        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left side */}

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ p: 0 }}
              aria-controls={Boolean(anchorEl) ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? "true" : undefined}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {user.email.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                mt: 1,
                "& .MuiPaper-root": {
                  minWidth: 200,
                },
              }}
            >
              <Stack direction="row" gap={1} sx={{ px: 2, py: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Stack>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2">Cerrar sesión</Typography>
                </ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pb: 4,
            color: "text.primary",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
