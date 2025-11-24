import { useState, useRef, useEffect } from "react";
import { IconButton, Typography, Box, Tooltip } from "@mui/material";
import {
  UploadOutlined,
  DeleteOutline,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { BoxColumn, BoxRow } from "@/components";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";

export default function UploadButton({
  index,
  editMode = false,
}: {
  index: number;
  editMode?: boolean;
}) {
  const { setValue, watch } = useFormContext();
  const fieldName = `items.${index}.documents`;
  const files = watch(fieldName);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<
    Array<File | { original_name: string; name?: string; [key: string]: any }>
  >(Array.isArray(files) ? files : []);

  // Sincronizar con el formulario cuando cambia desde fuera
  useEffect(() => {
    if (Array.isArray(files)) {
      setSelectedFiles(files);
    } else if (!files) {
      setSelectedFiles([]);
    }
  }, [files]);

  const fileMutation = useMutation({
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files[]", file);
      });

      return axios.post("/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: data => {
      const uploadedFiles = data.data?.files;
      if (!uploadedFiles || !Array.isArray(uploadedFiles)) {
        toast.error("Error: No se recibieron archivos del servidor");
        return;
      }
      setSelectedFiles(uploadedFiles);
      setValue(`items[${index}].documents`, uploadedFiles[0]?.url, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.errors?.files?.[0] ||
        "Error al subir los archivos";
      toast.error(errorMessage);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles && newFiles.length > 0) {
      fileMutation.mutate(Array.from(newFiles));
    }
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setValue(fieldName, updatedFiles, { shouldValidate: true });
  };

  const truncateFileName = (
    fileName: string | undefined,
    maxLength: number = 20
  ) => {
    if (!fileName) {
      return "archivo sin nombre";
    }
    if (fileName.length <= maxLength) {
      return fileName;
    }
    return fileName.substring(0, maxLength) + "...";
  };

  const handlePreviewFile = () => {
    window.open(files, "_blank");
  };

  const removeFile = () => {
    setSelectedFiles([]);
    setValue(fieldName, null, { shouldValidate: true, shouldDirty: true });
  };

  const hasFiles = Array.isArray(selectedFiles) && selectedFiles.length > 0;

  if (files) {
    return (
      <BoxRow gap={1} sx={{ width: "100%", justifyContent: "center" }}>
        <IconButton size="medium" onClick={handlePreviewFile}>
          <VisibilityOutlined fontSize="small" />
        </IconButton>
        {editMode && (
          <IconButton size="medium" onClick={removeFile} color="error">
            <DeleteOutline fontSize="small" />
          </IconButton>
        )}
      </BoxRow>
    );
  }

  return (
    <BoxColumn gap={1}>
      {!hasFiles && (
        <LoadingButton
          loading={fileMutation.isPending}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<UploadOutlined />}
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          Cargar
        </LoadingButton>
      )}
      <input
        ref={fileInputRef}
        id={`file-input-${index}`}
        type="file"
        multiple
        accept="image/*, application/pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {hasFiles && (
        <BoxColumn gap={0.5}>
          {selectedFiles.map((file, index) => {
            // Manejar tanto objetos File como objetos de respuesta del servidor
            const fileName =
              (file instanceof File
                ? file.name
                : (file as any)?.original_name || (file as any)?.name) ||
              "archivo sin nombre";
            const displayName = truncateFileName(fileName, 10);
            const showTooltip = fileName.length > 10;

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,

                  borderRadius: 1,
                  backgroundColor: "action.hover",
                }}
              >
                {showTooltip ? (
                  <Tooltip title={fileName} arrow>
                    <Typography
                      variant="caption"
                      sx={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        cursor: "help",
                        pl: 1,
                      }}
                    >
                      {displayName}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography
                    variant="caption"
                    sx={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      pl: 1,
                    }}
                  >
                    {displayName}
                  </Typography>
                )}
                <BoxRow>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>

                  <IconButton size="small" onClick={handlePreviewFile}>
                    <VisibilityOutlined fontSize="small" />
                  </IconButton>
                </BoxRow>
              </Box>
            );
          })}
        </BoxColumn>
      )}
    </BoxColumn>
  );
}
