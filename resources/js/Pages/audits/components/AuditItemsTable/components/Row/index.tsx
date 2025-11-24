import {
  Box,
  IconButton,
  Tooltip,
  Switch,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { WarningAmberOutlined } from "@mui/icons-material";
import { IAuditTypeItems } from "@/types";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";
import UploadButton from "./components/UploadButton";
import Comments from "./components/Comments";
import Expiry from "./components/Expiry";
import { TERM_OPTIONS } from "@/Pages/audits/types/configuration/components/CreateItem";
import { BoxRow } from "@/components";

export default function Row({
  item,
  index,
  showExpiryAdvice = false,
  editMode = true,
}: {
  item: IAuditTypeItems;
  index: number;
  showExpiryAdvice?: boolean;
  editMode?: boolean;
}) {
  const { register, setValue } = useFormContext();
  const rowState = useWatch({ name: `items.${index}.status` });

  useEffect(() => {
    if (!(item?.apply ?? false)) {
      setValue(`items.${index}.complies`, false);
    }
  }, [item?.apply]);

  /**
   * Estado de la row, background color
   */
  useEffect(() => {
    if (rowState === RowStatesEnum.WARNING) return;
    if (item?.apply && !item?.complies) {
      setValue(`items.${index}.status`, RowStatesEnum.ERROR);
    } else {
      setValue(`items.${index}.status`, RowStatesEnum.NORMAL);
    }
  }, [item?.apply, item?.complies]);

  const changeWarningState = () => {
    const newStatus =
      rowState === RowStatesEnum.WARNING
        ? item?.apply && !item?.complies
          ? RowStatesEnum.ERROR
          : RowStatesEnum.NORMAL
        : RowStatesEnum.WARNING;
    setValue(`items.${index}.status`, newStatus, { shouldDirty: true });
  };

  const isExpired = useMemo(() => {
    if (!showExpiryAdvice) return false;
    return item.expiry_date && Date.parse(item.expiry_date) < Date.now();
  }, [item.expiry_date, showExpiryAdvice]);

  return (
    <Tooltip
      title={isExpired ? "Vencido" : ""}
      placement="left"
      arrow
      open
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: "error.main",
            color: "white",
          },
        },
        arrow: {
          sx: {
            color: "error.main",
          },
        },
      }}
    >
      <TableRow
        key={item.id}
        sx={{
          backgroundColor:
            rowBackgroundColor[rowState as keyof typeof rowBackgroundColor],
          boxShadow: isExpired
            ? "inset 0 0 12px 0 rgba(255, 0, 0, 0.5)"
            : "none",
          position: "relative",
        }}
      >
        {/* Icono de warning */}
        <TableCell sx={{ pointerEvents: editMode ? "auto" : "none" }}>
          <IconButton
            color={rowState === RowStatesEnum.WARNING ? "default" : "warning"}
            size="small"
            onClick={changeWarningState}
          >
            <WarningAmberOutlined />
          </IconButton>
        </TableCell>
        {/* Nombre del item */}
        <TableCell>{item.name}</TableCell>
        {/* Marco legal */}
        <TableCell>{item.laws}</TableCell>
        {/* Aplica */}
        <TableCell sx={{ pointerEvents: editMode ? "auto" : "none" }}>
          <Switch
            {...register(`items[${index}].apply`)}
            checked={item?.apply ?? false}
          />
        </TableCell>
        {/* Cumple */}
        <TableCell sx={{ pointerEvents: editMode ? "auto" : "none" }}>
          <Switch
            {...register(`items[${index}].complies`)}
            checked={item?.complies ?? false}
            disabled={!(item?.apply ?? false)}
          />
        </TableCell>
        {/* Término */}
        <TableCell>
          {TERM_OPTIONS.find(option => option.value === item.term)?.label}
        </TableCell>
        {/* Fecha */}
        <TableCell sx={{ pointerEvents: editMode ? "auto" : "none" }}>
          <BoxRow gap={1}>
            <TextField
              {...register(`items[${index}].date`)}
              type="date"
              size="small"
              fullWidth
            />
            <Expiry index={index} />
          </BoxRow>
        </TableCell>
        {/* Documentos */}
        <TableCell>
          <UploadButton index={index} editMode={editMode} />
        </TableCell>
        {/* Comentarios */}
        <TableCell sx={{ pointerEvents: editMode ? "auto" : "none" }}>
          <Comments index={index} />
        </TableCell>
      </TableRow>
    </Tooltip>
  );
}

const rowBackgroundColor = {
  normal: "default.main",
  warning: "warning.main",
  error: "error.main",
};

enum RowStatesEnum {
  NORMAL = "normal",
  WARNING = "warning",
  ERROR = "error",
}
