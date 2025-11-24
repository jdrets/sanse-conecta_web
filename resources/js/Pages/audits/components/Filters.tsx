import { BoxColumn, BoxRow } from "@/components";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ClearAllOutlined, FilterAltOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useDisclosure } from "@chakra-ui/hooks";
import { IClient } from "@/types/client.interface";
import { IAuditsTypes } from "@/types/auditsTypes.interface";
import { useAuth } from "@/hooks/useAuth";
import { router } from "@inertiajs/react";

export default function Filters({
  children,
  clients,
  auditTypes,
}: {
  children: React.ReactNode;
  clients: IClient[];
  auditTypes: IAuditsTypes[];
}) {
  const user = useAuth();

  // Leer query params de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialClientId = urlParams.get("client_id") || "all";
  const initialAuditTypeId = urlParams.get("audit_type_id") || "all";
  const initialStartDate = urlParams.get("start_date");
  const initialEndDate = urlParams.get("end_date");

  // filters
  const [selectedClientId, setSelectedClientId] =
    useState<string>(initialClientId);
  const [selectedAuditTypeId, setSelectedAuditTypeId] =
    useState<string>(initialAuditTypeId);
  const [startDate, setStartDate] = useState<Dayjs | null>(
    initialStartDate ? dayjs(initialStartDate) : null
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    initialEndDate ? dayjs(initialEndDate) : null
  );

  // disclousures
  const advancedFiltersDisclosure = useDisclosure();
  const hasFiltersApplied =
    selectedClientId !== "all" ||
    selectedAuditTypeId !== "all" ||
    startDate !== null ||
    endDate !== null;

  // Función para actualizar los query params
  const updateQueryParams = (params: Record<string, string | null>) => {
    const currentUrl = new URL(window.location.href);

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        currentUrl.searchParams.set(key, value);
      } else {
        currentUrl.searchParams.delete(key);
      }
    });

    router.get(
      currentUrl.pathname + currentUrl.search,
      {},
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    );
  };

  // Manejar cambio de cliente
  const handleClientChange = (value: string) => {
    setSelectedClientId(value);
    updateQueryParams({
      client_id: value,
      audit_type_id: selectedAuditTypeId,
      start_date: startDate?.format("YYYY-MM-DD") || null,
      end_date: endDate?.format("YYYY-MM-DD") || null,
    });
  };

  // Manejar cambio de tipo de auditoría
  const handleAuditTypeChange = (value: string) => {
    setSelectedAuditTypeId(value);
    updateQueryParams({
      client_id: selectedClientId,
      audit_type_id: value,
      start_date: startDate?.format("YYYY-MM-DD") || null,
      end_date: endDate?.format("YYYY-MM-DD") || null,
    });
  };

  // Manejar aplicación de filtros de fecha
  const handleDateFilter = () => {
    updateQueryParams({
      client_id: selectedClientId,
      audit_type_id: selectedAuditTypeId,
      start_date: startDate?.format("YYYY-MM-DD") || null,
      end_date: endDate?.format("YYYY-MM-DD") || null,
    });
  };

  const handleClearFilters = () => {
    setSelectedClientId("all");
    setSelectedAuditTypeId("all");
    setStartDate(null);
    setEndDate(null);
    updateQueryParams({
      client_id: "all",
      audit_type_id: "all",
      start_date: null,
      end_date: null,
    });
  };

  return (
    <BoxColumn gap={2}>
      <BoxRow justifyContent="space-between">
        <BoxRow gap={2}>
          {user.client_id === null && (
            <FormControl size="small" sx={{ width: "232px" }}>
              <InputLabel>Filtrar por cliente</InputLabel>
              <Select
                value={selectedClientId}
                label="Filtrar por cliente"
                onChange={e => handleClientChange(e.target.value)}
                startAdornment={
                  <FilterAltOutlined fontSize="small" sx={{ marginRight: 1 }} />
                }
              >
                <MenuItem value="all">Todos los clientes</MenuItem>
                {clients.map(client => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl size="small" sx={{ width: "232px" }}>
            <InputLabel>Filtrar por tipo</InputLabel>
            <Select
              value={selectedAuditTypeId}
              label="Filtrar por tipo"
              onChange={e => handleAuditTypeChange(e.target.value)}
              startAdornment={
                <FilterAltOutlined fontSize="small" sx={{ marginRight: 1 }} />
              }
            >
              <MenuItem value="all">Todos los tipos</MenuItem>
              {auditTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </BoxRow>

        <BoxRow gap={2}>
          {hasFiltersApplied && (
            <Button
              color="primary"
              onClick={handleClearFilters}
              size="small"
              startIcon={<ClearAllOutlined />}
            >
              Limpiar filtros
            </Button>
          )}
          <Button
            color="primary"
            onClick={advancedFiltersDisclosure.onToggle}
            size="small"
            startIcon={<FilterAltOutlined />}
          >
            Filtros avanzados
          </Button>
          {children}
        </BoxRow>
      </BoxRow>

      {advancedFiltersDisclosure.isOpen && (
        <BoxColumn gap={1}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="body1">
              Filtrar vencimientos entre fechas
            </Typography>
            <BoxRow gap={3}>
              <BoxRow gap={1} sx={{ width: "100%" }}>
                <DatePicker
                  label="Fecha de inicio"
                  value={startDate}
                  onChange={newValue => setStartDate(newValue)}
                  maxDate={endDate || undefined} // evita que start sea mayor a end
                  slotProps={{
                    textField: { fullWidth: true, size: "small" },
                  }}
                />
                <DatePicker
                  label="Fecha de fin"
                  value={endDate}
                  onChange={newValue => setEndDate(newValue)}
                  minDate={startDate || undefined} // evita que end sea menor a start
                  slotProps={{
                    textField: { fullWidth: true, size: "small" },
                  }}
                />
              </BoxRow>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FilterAltOutlined />}
                onClick={handleDateFilter}
              >
                Filtrar
              </Button>
            </BoxRow>
          </LocalizationProvider>
        </BoxColumn>
      )}
    </BoxColumn>
  );
}
