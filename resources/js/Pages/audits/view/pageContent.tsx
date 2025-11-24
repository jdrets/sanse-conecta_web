import { Button, Container, Typography } from "@mui/material";
import { BoxColumn, BoxRow } from "@/components";
import Fields from "./components/Fields";
import { IAudit } from "@/types/audit.interface";
import Metadata from "./components/Metadata";
import { EditOutlined, PrintOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDisclosure } from "@chakra-ui/hooks";
import CancelModal from "@/components/CancelModal";
import { router } from "@inertiajs/react";

export default function PageContent({ audit }: { audit: IAudit }) {
  const [editMode, setEditMode] = useState(false);
  const {
    formState: { isDirty },
  } = useFormContext();
  const cancelDisclosure = useDisclosure();

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  const handleCancel = () => {
    if (isDirty) {
      window.location.reload();
    }
  };

  const onCancelClick = () =>
    isDirty ? cancelDisclosure.onOpen() : toggleEditMode();

  const handlePrint = () => {
    router.visit(`/audits/${audit.id}/print`);
  };
  return (
    <Container maxWidth="xl">
      <BoxColumn gap={3}>
        <BoxColumn gap={2}>
          <Typography variant="h2" component="h1">
            {audit.client.name} - {audit.audit_type.name}
          </Typography>

          <BoxRow justifyContent="space-between">
            <Metadata audit={audit} />
            <BoxRow gap={1}>
              <Button
                size="small"
                startIcon={!editMode ? <EditOutlined /> : undefined}
                variant={editMode ? "text" : "contained"}
                onClick={onCancelClick}
              >
                {editMode ? "Cancelar" : "Modificar"}
              </Button>
              {!editMode && (
                <Button
                  size="small"
                  color="secondary"
                  startIcon={<PrintOutlined />}
                  variant="contained"
                  onClick={handlePrint}
                >
                  Imprimir
                </Button>
              )}
            </BoxRow>
          </BoxRow>
        </BoxColumn>
        <Fields
          audit={audit}
          editMode={editMode}
          toggleEditMode={toggleEditMode}
          onCancelClick={onCancelClick}
        />
        <CancelModal
          cancelDisclosure={cancelDisclosure}
          handleCancel={handleCancel}
        />
      </BoxColumn>
    </Container>
  );
}
