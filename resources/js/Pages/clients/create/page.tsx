import { Container, Typography } from "@mui/material";
import Fields from "./components/Fields";
import Providers from "./providers";
import { BoxColumn, BoxRow } from "@/components";
import { ClientCategory } from "@/types";

export default function Page({ categories }: { categories: ClientCategory[] }) {
  return (
    <Providers>
      <Container maxWidth="xl">
        <BoxColumn gap={3}>
          <BoxRow justifyContent="space-between">
            <Typography variant="h2" component="h1">
              Nuevo cliente
            </Typography>
          </BoxRow>

          <Fields categories={categories} />
        </BoxColumn>
      </Container>
    </Providers>
  );
}
