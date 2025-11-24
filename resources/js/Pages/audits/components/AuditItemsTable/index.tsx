import { IAuditTypeItems } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Row from "./components/Row";

export default function AuditItemsTable({
  items,
  editMode = true,
  showExpiryAdvice = false,
}: {
  editMode?: boolean;
  items: IAuditTypeItems[];
  showExpiryAdvice?: boolean;
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Marco legal</TableCell>
            <TableCell>Aplica</TableCell>
            <TableCell>Cumple</TableCell>
            <TableCell>Término</TableCell>
            <TableCell>Fecha y vencimiento</TableCell>
            <TableCell>Documentos</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item: IAuditTypeItems, index: number) => (
            <Row
              key={item.id}
              item={item}
              index={index}
              showExpiryAdvice={showExpiryAdvice}
              editMode={editMode}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
