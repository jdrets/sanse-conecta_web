import { Box, Container } from "@mui/material";

export default function ContentLayout({
  headContent,
  children,
}: {
  headContent: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <Box sx={{ backgroundColor: "primary.main", pb: 4 }}>
        <Container sx={{ py: 2 }}>{headContent}</Container>
      </Box>

      <Box
        sx={{
          backgroundColor: "background.default",
          borderRadius: 1,
          position: "relative",
          top: -24,
        }}
      >
        <Container sx={{ py: 2 }}>{children}</Container>
      </Box>
    </>
  );
}
