import { BoxRow } from "@/components";
import { IAuditsTypes, IAuditTypeItems, IClient } from "@/types";
import { TextField, MenuItem, FormControlLabel, Switch } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import Skeletons from "./components/Skeletons";
import { IAudit } from "@/types/audit.interface";

export default function AuditBaseData({
  auditTypes,
  clients,
  staticData,
  editMode = true,
}: {
  auditTypes?: IAuditsTypes[];
  clients?: IClient[];
  staticData?: IAudit;
  editMode?: boolean;
}) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [specifyCreationDate, setSpecifyCreationDate] = useState(false);

  const handleCheckHasCreationDate = (enabled: boolean) => {
    setSpecifyCreationDate(enabled);

    if (!enabled) {
      setValue("creationDate", format(new Date(), "yyyy-MM-dd"));
    }
  };

  const auditTypeItemsMutation = useMutation({
    mutationFn: (data: any) => {
      return axios.get(`/audits/types/${data.auditTypeId}/items`);
    },
    onSuccess: data => {
      // Inicializacion de items
      const initialItems = data.data.map((item: IAuditTypeItems) => ({
        id: item.id,
        name: item.name,
        term: item.term,
        laws: item.laws,
        date: format(new Date(), "yyyy-MM-dd"),
        expiry_date: undefined,
        documents: undefined,
        comments: "",
        apply: false,
        complies: false,
      }));
      setValue("items", initialItems);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Error al obtener los items del tipo de auditoria"
      );
    },
  });

  return (
    <>
      <TextField
        {...register("auditTypeId", {
          valueAsNumber: true,
          onChange: e => {
            auditTypeItemsMutation.mutate({ auditTypeId: e.target.value });
          },
        })}
        label="Tipo de auditoria"
        placeholder="Seleccione un tipo de auditoria"
        fullWidth
        select
        disabled={!!staticData}
        defaultValue={staticData?.audit_type.id}
      >
        {/* Si hay datos estáticos, mostrar el nombre del tipo de auditoria */}
        {staticData && (
          <MenuItem value={staticData.audit_type.id}>
            {staticData.audit_type.name}
          </MenuItem>
        )}
        {auditTypes?.map(auditType => (
          <MenuItem key={auditType.id} value={auditType.id}>
            {auditType.name}
          </MenuItem>
        ))}
      </TextField>
      {/* Cliente */}
      <TextField
        {...register("clientId", { valueAsNumber: true })}
        label="Cliente"
        placeholder="Seleccione un cliente"
        fullWidth
        select
        error={!!errors.clientId}
        helperText={errors.clientId?.message as string}
        disabled={!!staticData}
        defaultValue={staticData?.client.id}
      >
        {clients?.map(client => (
          <MenuItem key={client.id} value={client.id}>
            {client.name}
          </MenuItem>
        ))}
        {/* Si hay datos estáticos, mostrar el nombre del cliente */}
        {staticData && (
          <MenuItem value={staticData.client.id}>
            {staticData.client.name}
          </MenuItem>
        )}
      </TextField>
      {/* Fecha de creación */}
      <BoxRow gap={4}>
        {specifyCreationDate && (
          <TextField
            {...register("creationDate")}
            label="Fecha de creación"
            type="date"
            defaultValue={format(new Date(), "yyyy-MM-dd")}
            fullWidth
            error={!!errors.creationDate}
            helperText={errors.creationDate?.message as string}
            disabled={!editMode}
          />
        )}
        <FormControlLabel
          control={
            <Switch
              checked={specifyCreationDate}
              onChange={e => handleCheckHasCreationDate(e.target.checked)}
              disabled={!editMode}
            />
          }
          sx={{
            width: "100%",
          }}
          label="Especificar fecha de creación"
        />
      </BoxRow>

      {auditTypeItemsMutation.isPending && <Skeletons />}
    </>
  );
}
