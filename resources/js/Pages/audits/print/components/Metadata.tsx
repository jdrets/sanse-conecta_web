import { Typography, Box, Chip } from "@mui/material";
import { CalendarToday, Update } from "@mui/icons-material";
import { format } from "date-fns";
import { IAudit } from "@/types/audit.interface";
import { BoxRow } from "@/components";

export default function Metadata({ audit }: { audit: IAudit }) {
  return (
    <BoxRow gap={2}>
      <Chip
        icon={<CalendarToday />}
        label={
          <Box>
            <Typography
              variant="caption"
              component="span"
              sx={{ mr: 1, opacity: 0.7 }}
            >
              Creación:
            </Typography>
            <Typography variant="body2" component="span" fontWeight={600}>
              {format(audit.creation_date, "dd/MM/yyyy")}
            </Typography>
          </Box>
        }
        color="primary"
        variant="outlined"
        sx={{ py: 2.5, px: 1.5 }}
      />
      <Chip
        icon={<Update />}
        label={
          <Box>
            <Typography
              variant="caption"
              component="span"
              sx={{ mr: 1, opacity: 0.7 }}
            >
              Última actualización:
            </Typography>
            <Typography variant="body2" component="span" fontWeight={600}>
              {format(audit.updated_at, "dd/MM/yyyy HH:mm")}
            </Typography>
          </Box>
        }
        color="secondary"
        variant="outlined"
        sx={{ py: 2.5, px: 1.5 }}
      />
    </BoxRow>
  );
}
