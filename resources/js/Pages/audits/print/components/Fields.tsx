import {
  Card,
  Paper,
  TableContainer,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from "@mui/material";
import { BoxColumn, BoxRow } from "@/components";
import Stadistics from "../../components/Stadistics";
import { IAudit } from "@/types/audit.interface";
import logo from "@/assets/logo.png";
import { format } from "date-fns";
import { TERM_OPTIONS } from "@/Pages/audits/types/configuration/components/CreateItem";
import {
  CheckCircleOutlined,
  WarningAmberOutlined,
  CancelOutlined,
} from "@mui/icons-material";

export default function Fields({ audit }: { audit: IAudit }) {
  const items = audit.items;
  return (
    <Card>
      <BoxColumn gap={3}>
        <BoxRow justifyContent="space-between">
          <BoxRow gap={2}>
            <img src={logo} alt="logo" width={100} height={100} />
            <BoxColumn>
              <Typography variant="h2">{audit.client.name}</Typography>
              <Typography variant="body1">
                <strong>Tipo:</strong> {audit.audit_type.name}
              </Typography>
              <Typography variant="body1">
                <strong>Fecha de emisión:</strong>{" "}
                {format(audit.creation_date, "dd/MM/yyyy")}
              </Typography>
              <Typography variant="body1">
                <strong>Fecha de actualización:</strong>{" "}
                {format(audit.updated_at, "dd/MM/yyyy")}
              </Typography>
            </BoxColumn>
          </BoxRow>

          <Typography variant="body2" sx={{ alignSelf: "flex-start" }}>
            <strong>Fecha de impresión:</strong>{" "}
            {format(new Date(), "dd/MM/yyyy")}
          </Typography>
        </BoxRow>

        <TableContainer component={Paper}>
          <Table aria-label="tabla de items">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Marco legal</TableCell>
                <TableCell>Aplica</TableCell>
                <TableCell>Cumple</TableCell>
                <TableCell>Término</TableCell>
                <TableCell>Inicio</TableCell>
                <TableCell>Vencimiento</TableCell>
                <TableCell>Comentarios</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <StatusComponent status={item.status} />
                  </TableCell>
                  <TableCell>{item.audit_type_item.name}</TableCell>
                  <TableCell>{item.audit_type_item.laws}</TableCell>
                  <TableCell>{item.apply ? "Si" : "No"}</TableCell>
                  <TableCell>
                    {item.apply ? (item.complies ? "Si" : "No") : "-"}
                  </TableCell>
                  <TableCell>
                    {
                      TERM_OPTIONS.find(
                        option => option.value === item.audit_type_item.term
                      )?.label
                    }
                  </TableCell>
                  <TableCell>{format(item.date, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    {item.expiry_date
                      ? format(item.expiry_date, "dd/MM/yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{item.comments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <style>{`
        @media print {
          .MuiTableRow-root {
            height: 30px !important;
          }
          
          .MuiTableCell-root {
            padding: 8px !important;
            font-size: 12px !important;
          }
        }
      `}</style>

        {items.length > 0 && <Stadistics items={items} />}
      </BoxColumn>
    </Card>
  );
}

const StatusComponent = ({ status }: { status: string }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {status === "warning" && <WarningAmberOutlined color="warning" />}
      {status === "normal" && <CheckCircleOutlined color="success" />}
      {status === "error" && <CancelOutlined color="error" />}
    </Box>
  );
};
