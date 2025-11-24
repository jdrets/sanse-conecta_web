import { IconButton, Badge, Tooltip } from "@mui/material";
import { CommentOutlined } from "@mui/icons-material";
import { Dialog, Button, TextField, Typography } from "@mui/material";
import { useDisclosure } from "@chakra-ui/hooks";
import { BoxColumn, BoxRow } from "@/components";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export default function Comments({ index }: { index: number }) {
  const [comments, setComments] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setValue } = useFormContext();
  const commentsValue = useWatch({ name: `items[${index}].comments` });
  const hasComments = !!commentsValue && commentsValue.trim() !== "";

  useEffect(() => {
    setComments(commentsValue || "");
  }, [commentsValue]);

  const handleSave = () => {
    setValue(`items[${index}].comments`, comments, {
      shouldValidate: true,
      shouldDirty: true,
    });
    onClose();
  };

  return (
    <>
      <Badge color="primary" variant="dot" invisible={!hasComments}>
        <Tooltip title="Comentarios" placement="top" arrow>
          <IconButton onClick={onOpen}>
            <CommentOutlined />
          </IconButton>
        </Tooltip>
      </Badge>

      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
        <BoxColumn gap={3}>
          <Typography variant="h3" component="h3">
            Comentarios
          </Typography>

          <TextField
            label="Comentario"
            fullWidth
            multiline
            rows={4}
            value={comments}
            onChange={e => setComments(e.target.value)}
            autoFocus
          />

          <BoxRow justifyContent="flex-end" gap={2}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar
            </Button>
          </BoxRow>
        </BoxColumn>
      </Dialog>
    </>
  );
}
