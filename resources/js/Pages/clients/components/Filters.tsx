import { BoxRow } from "@/components";
import { InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Clear } from "@mui/icons-material";

export default function Filters({
  search,
  setSearch,
  cuit,
  setCuit,
}: {
  search: string;
  setSearch: (value: string) => void;
  cuit: string;
  setCuit: (value: string) => void;
}) {
  return (
    <BoxRow gap={2}>
      <TextField
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar cliente"
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch("")}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />
      <TextField
        value={cuit}
        onChange={e => setCuit(e.target.value)}
        placeholder="Buscar por CUIT"
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: cuit ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setCuit("")}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />
    </BoxRow>
  );
}
