import { Box, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { addMonths, format } from "date-fns";
import { TermEnum } from "@/Pages/audits/types/configuration/components/CreateItem";
import { useEffect } from "react";

export default function Expiry({ index }: { index: number }) {
  const { watch, register, setValue } = useFormContext();
  const dateValue = watch(`items.${index}.date`);
  const termValue = watch(`items.${index}.term`);
  const expiryDateValue = watch(`items.${index}.expiry_date`);

  if (termValue === "único")
    return (
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
        }}
      >
        -
      </Box>
    );

  const getExpiryDate = () => {
    if (expiryDateValue) return expiryDateValue;
    if (!dateValue) return "";
    if (termValue === TermEnum.MONTHLY)
      return format(addMonths(dateValue, 1), "yyyy-MM-dd");
    if (termValue === TermEnum.BIANNUAL)
      return format(addMonths(dateValue, 24), "yyyy-MM-dd");
    if (termValue === TermEnum.ANNUAL)
      return format(addMonths(dateValue, 12), "yyyy-MM-dd");
    if (termValue === TermEnum.QUADRIENNIAL)
      return format(addMonths(dateValue, 48), "yyyy-MM-dd");
    if (termValue === TermEnum.SEMESTERLY)
      return format(addMonths(dateValue, 6), "yyyy-MM-dd");
    if (termValue === TermEnum.ACCORDING_TO_DISPOSAL)
      return format(addMonths(dateValue, 1), "yyyy-MM-dd");
  };

  useEffect(() => {
    setValue(`items.${index}.expiry_date`, getExpiryDate());
  }, [dateValue, termValue]);

  return (
    <TextField
      {...register(`items.${index}.expiry_date`)}
      type="date"
      size="small"
      defaultValue={getExpiryDate()}
      fullWidth
    />
  );
}
