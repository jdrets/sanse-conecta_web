import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

interface DropzoneProps {
  acceptedFiles?: string[];
  maxFiles?: number;
  maxSize?: number; // en bytes
  dropzoneText?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  value?: FileWithPreview[];
  error?: boolean;
  helperText?: string;
}

export default function Dropzone({
  acceptedFiles = ["image/*", "application/pdf"],
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB por defecto
  dropzoneText = "Arrastra y suelta archivos aquí o haz clic para seleccionar",
  onFilesChange,
  value = [],
  error = false,
  helperText,
}: DropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const prevValueRef = useRef<FileWithPreview[]>([]);

  // Sincronizar con el prop value solo cuando realmente cambie
  useEffect(() => {
    const currentValue = value || [];
    const prevValue = prevValueRef.current;

    // Comparar si realmente cambió el valor
    const hasChanged =
      currentValue.length !== prevValue.length ||
      currentValue.some((file, index) => {
        const prevFile = prevValue[index];
        return (
          !prevFile || file.id !== prevFile.id || file.name !== prevFile.name
        );
      });

    if (hasChanged) {
      const validFiles = currentValue.filter(
        file => file && file.name && file.id
      );
      setFiles(validFiles);
      prevValueRef.current = validFiles;
    }
  }, [value]);

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const validateFile = (file: File): string | null => {
    // Validar tipo de archivo
    const isAccepted = acceptedFiles.some(acceptedType => {
      if (acceptedType.endsWith("/*")) {
        const baseType = acceptedType.replace("/*", "");
        return file.type.startsWith(baseType);
      }
      return file.type === acceptedType;
    });

    if (!isAccepted) {
      return `Tipo de archivo no permitido. Tipos aceptados: ${acceptedFiles.join(", ")}`;
    }

    // Validar tamaño
    if (file.size > maxSize) {
      return `El archivo es demasiado grande. Tamaño máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }

    return null;
  };

  const processFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: FileWithPreview[] = [];
      const errors: string[] = [];

      Array.from(fileList).forEach(file => {
        const name = file.name;
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
          return;
        }

        if (files.length + newFiles.length >= maxFiles) {
          errors.push(`Máximo ${maxFiles} archivos permitidos`);
          return;
        }

        const fileWithPreview: FileWithPreview = {
          ...file,
          id: generateFileId(),
          name,
        };

        // Crear preview para imágenes
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = e => {
            fileWithPreview.preview = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }

        newFiles.push(fileWithPreview);
      });

      if (errors.length > 0) {
        console.error("Errores de validación:", errors);
        setValidationErrors(errors);
        // Limpiar errores después de 5 segundos
        setTimeout(() => setValidationErrors([]), 5000);
      } else {
        setValidationErrors([]);
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
      }
    },
    [files, maxFiles, maxSize, acceptedFiles, onFilesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        processFiles(e.target.files);
      }
      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
      e.target.value = "";
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      const updatedFiles = files.filter(file => file.id !== fileId);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    },
    [files, onFilesChange]
  );

  const getFileIcon = (file: FileWithPreview) => {
    if (!file || !file.type) {
      return <FileIcon />;
    }

    if (file.type.startsWith("image/")) {
      return <ImageIcon />;
    }
    if (file.type === "application/pdf") {
      return <PdfIcon />;
    }
    return <FileIcon />;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        variant="outlined"
        sx={{
          border: dragActive ? "2px dashed #1976d2" : "2px dashed #ccc",
          borderColor: error
            ? "error.main"
            : dragActive
              ? "primary.main"
              : "grey.400",
          backgroundColor: dragActive ? "action.hover" : "background.paper",
          transition: "all 0.2s ease",
          cursor: "pointer",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "action.hover",
          },
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            minHeight: 120,
          }}
        >
          <CloudUploadIcon
            sx={{
              fontSize: 48,
              color: dragActive ? "primary.main" : "grey.500",
              mb: 2,
            }}
          />
          <Typography
            variant="body1"
            color={dragActive ? "primary.main" : "text.secondary"}
            textAlign="center"
          >
            {dropzoneText}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 1 }}
          >
            Tipos aceptados: {acceptedFiles.join(", ")} | Máximo: {maxFiles}{" "}
            archivos
          </Typography>
        </Box>
      </Paper>

      <input
        id="file-input"
        type="file"
        multiple
        accept={acceptedFiles.join(",")}
        onChange={handleFileInput}
        style={{ display: "none" }}
      />

      {error && helperText && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {helperText}
        </Alert>
      )}

      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {validationErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Archivos seleccionados ({files.length}/{maxFiles})
          </Typography>
          <List dense>
            {files
              .filter(file => file && file.id)
              .map(file => (
                <ListItem
                  key={file.id}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    {file.preview ? (
                      <Box
                        component="img"
                        src={file.preview}
                        sx={{
                          width: 32,
                          maxWidth: "100%",
                          height: 32,
                          borderRadius: 1,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      getFileIcon(file)
                    )}
                  </Box>
                  <ListItemText
                    primary={file.name || "Archivo sin nombre"}
                    secondary={`${formatFileSize(file.size || 0)}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeFile(file.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
