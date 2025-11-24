import { Container, Typography } from "@mui/material";
import Providers from "./providers";
import { BoxColumn, BoxRow } from "@/components";
import Fields from "./components/Fields";
import { IAuditsTypes, IClient } from "@/types";

export default function CreateClient({
  clients,
  auditTypes,
}: {
  clients: IClient[];
  auditTypes: IAuditsTypes[];
}) {
  return (
    <Providers>
      <Container maxWidth="xl">
        <BoxColumn gap={3}>
          <BoxRow justifyContent="space-between">
            <Typography variant="h2" component="h1">
              Nueva auditoria
            </Typography>
          </BoxRow>
          <Fields clients={clients} auditTypes={auditTypes} />
        </BoxColumn>
      </Container>
    </Providers>
  );
}
