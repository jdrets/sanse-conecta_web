import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Drawer, Dialog } from "@mui/material";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const Component = isMobile ? Drawer : Dialog;

  return (
    <Component
      open={open}
      onClose={onClose ?? undefined}
      {...(isMobile ? { anchor: "bottom" } : {})}
    >
      <Box px={2} py={4}>
        {children}
      </Box>
    </Component>
  );
}
