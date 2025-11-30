import React from "react";
import { Box } from "@mui/material";

import { useAuth } from "@/hooks/useAuth";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useAuth();
  return (
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
  );
};
