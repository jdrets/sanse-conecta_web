<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class FilesController extends Controller
{
    /**
     * Tipos MIME permitidos
     */
    private const ALLOWED_MIME_TYPES = [
        // Imágenes
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        // PDFs
        'application/pdf',
    ];

    /**
     * Extensiones permitidas
     */
    private const ALLOWED_EXTENSIONS = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'bmp',
        'pdf',
    ];

    /**
     * Tamaño máximo del archivo (50MB)
     */
    private const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en bytes

    /**
     * Subir imagen de publicación
     * Método específico para imágenes de publicaciones con validaciones de seguridad
     */
    public function uploadPublicationImage(Request $request)
    {
        try {
            // Validar que se haya enviado una imagen
            $validator = Validator::make($request->all(), [
                'image' => [
                    'required',
                    'image',
                    'mimes:jpeg,jpg,png,gif,webp',
                    'max:2048', // 2MB
                ],
            ], [
                'image.required' => 'Debe seleccionar una imagen',
                'image.image' => 'El archivo debe ser una imagen',
                'image.mimes' => 'Solo se permiten imágenes (JPG, PNG, GIF, WEBP)',
                'image.max' => 'El tamaño máximo permitido es 2MB',
            ]);

            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            }

            $image = $request->file('image');

            // Validar que el archivo sea válido
            if (!$image->isValid()) {
                throw new \Exception('El archivo no se subió correctamente');
            }

            // Validar MIME type real
            $mimeType = $image->getMimeType();
            $allowedImageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            
            if (!in_array($mimeType, $allowedImageMimes)) {
                throw new \Exception("El archivo no es una imagen válida. Tipo detectado: {$mimeType}");
            }

            // Validar contenido real del archivo usando finfo (doble verificación)
            $realPath = $image->getRealPath();
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $detectedMimeType = finfo_file($finfo, $realPath);
            finfo_close($finfo);

            if (!in_array($detectedMimeType, $allowedImageMimes)) {
                throw new \Exception("El contenido del archivo no es una imagen válida");
            }

            // Crear directorio si no existe
            $publicationsPath = storage_path('app/public/publications');
            if (!file_exists($publicationsPath)) {
                mkdir($publicationsPath, 0755, true);
            }

            // Guardar en storage/app/public/publications
            $path = $image->store('publications', 'public');

            // Verificar que el archivo se guardó correctamente
            if (!Storage::disk('public')->exists($path)) {
                throw new \Exception('No se pudo guardar el archivo en el servidor');
            }

            return [
                'success' => true,
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
                'size' => $image->getSize(),
                'mime_type' => $detectedMimeType,
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Eliminar imagen de publicación
     */
    public function deletePublicationImage(string $path)
    {
        try {
            // Validar que el path esté en la carpeta de publicaciones
            if (!str_starts_with($path, 'publications/')) {
                throw new \Exception('Ruta de archivo inválida');
            }

            // Verificar que el archivo existe
            if (!Storage::disk('public')->exists($path)) {
                return [
                    'success' => true,
                    'message' => 'El archivo ya no existe',
                ];
            }

            // Eliminar el archivo
            Storage::disk('public')->delete($path);

            return [
                'success' => true,
                'message' => 'Imagen eliminada correctamente',
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Subir archivos (método original para auditorías)
     */
    public function upload(Request $request)
    {
        try {
            // Verificar que se estén enviando archivos
            if (! $request->hasFile('files')) {
                return response()->json([
                    'message' => 'Error de validación',
                    'error' => 'No se recibieron archivos. Asegúrate de enviar los archivos en el campo "files"',
                ], 422);
            }

            // Validar que se haya enviado al menos un archivo
            $validator = Validator::make($request->all(), [
                'files.*' => [
                    'required',
                    'file',
                    'mimes:'.implode(',', self::ALLOWED_EXTENSIONS),
                    'max:'.(self::MAX_FILE_SIZE / 1024), // Laravel espera KB
                ],
            ], [
                'files.*.required' => 'Debe seleccionar al menos un archivo',
                'files.*.file' => 'El archivo no es válido',
                'files.*.mimes' => 'Solo se permiten archivos PDF o imágenes (JPG, PNG, GIF, WEBP, BMP, JPEG)',
                'files.*.max' => 'El tamaño máximo permitido es 50MB',
            ]);

            if ($validator->fails()) {
                $errors = $validator->errors();
                $firstError = $errors->first();

                return response()->json([
                    'message' => 'Error de validación',
                    'error' => $firstError,
                    'errors' => $errors,
                ], 422);
            }

            $uploadedFiles = [];
            $files = $request->file('files');

            // Si solo se envía un archivo, convertirlo a array
            if (! is_array($files)) {
                $files = [$files];
            }

            // Verificar que hay archivos después de la conversión
            if (empty($files) || ($files[0] === null)) {
                return response()->json([
                    'message' => 'Error de validación',
                    'error' => 'No se recibieron archivos válidos',
                ], 422);
            }

            foreach ($files as $file) {
                // Verificar que el archivo no sea null
                if ($file === null) {
                    continue;
                }

                // Verificar que el archivo se haya subido correctamente
                if (! $file->isValid()) {
                    return response()->json([
                        'message' => 'Error al subir el archivo',
                        'error' => "El archivo '{$file->getClientOriginalName()}' no se subió correctamente. Error: ".$file->getError(),
                    ], 422);
                }

                // Validar tamaño del archivo primero
                if ($file->getSize() > self::MAX_FILE_SIZE) {
                    return response()->json([
                        'message' => 'Archivo demasiado grande',
                        'error' => "El archivo '{$file->getClientOriginalName()}' excede el tamaño máximo de 50MB",
                    ], 422);
                }

                // Validar que el archivo no esté vacío
                if ($file->getSize() === 0) {
                    return response()->json([
                        'message' => 'Archivo vacío',
                        'error' => "El archivo '{$file->getClientOriginalName()}' está vacío",
                    ], 422);
                }

                // Sanitizar el nombre del archivo
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();

                // Validar que la extensión esté permitida
                if (! in_array(strtolower($extension), self::ALLOWED_EXTENSIONS)) {
                    return response()->json([
                        'message' => 'Extensión no permitida',
                        'error' => "La extensión '{$extension}' no está permitida",
                    ], 422);
                }

                // Validar MIME type real usando fileinfo (más seguro)
                $mimeType = $file->getMimeType();
                if (! in_array($mimeType, self::ALLOWED_MIME_TYPES)) {
                    return response()->json([
                        'message' => 'Tipo de archivo no permitido',
                        'error' => "El archivo '{$file->getClientOriginalName()}' no es un PDF o imagen válida. Tipo detectado: {$mimeType}",
                        'detected_mime_type' => $mimeType,
                        'allowed_types' => self::ALLOWED_MIME_TYPES,
                    ], 422);
                }

                // Validar contenido real del archivo usando finfo (doble verificación)
                $realPath = $file->getRealPath();
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $detectedMimeType = finfo_file($finfo, $realPath);
                finfo_close($finfo);

                if (! in_array($detectedMimeType, self::ALLOWED_MIME_TYPES)) {
                    return response()->json([
                        'message' => 'Tipo de archivo no permitido',
                        'error' => "El contenido del archivo '{$file->getClientOriginalName()}' no coincide con su extensión. Tipo detectado: {$detectedMimeType}",
                        'detected_mime_type' => $detectedMimeType,
                        'extension' => $extension,
                        'allowed_types' => self::ALLOWED_MIME_TYPES,
                    ], 422);
                }

                // Verificar que el MIME type detectado coincida con la extensión
                if (! $this->isMimeTypeValidForExtension($detectedMimeType, $extension)) {
                    return response()->json([
                        'message' => 'Archivo sospechoso detectado',
                        'error' => "El archivo '{$file->getClientOriginalName()}' tiene una extensión ({$extension}) que no coincide con su contenido real ({$detectedMimeType})",
                        'extension' => $extension,
                        'detected_mime_type' => $detectedMimeType,
                    ], 422);
                }

                // Usar el MIME type detectado (más seguro que el del cliente)
                $finalMimeType = $detectedMimeType;

                // Limpiar el nombre del archivo (remover caracteres peligrosos)
                $safeName = $this->sanitizeFileName(pathinfo($originalName, PATHINFO_FILENAME));

                // Generar nombre único
                $uniqueName = $safeName.'_'.Str::random(8).'_'.time().'.'.$extension;

                // Guardar en storage/app/public/audits/documents
                $path = $file->storeAs('audits/documents', $uniqueName, 'public');

                // Verificar que el archivo se guardó correctamente
                if (! Storage::disk('public')->exists($path)) {
                    return response()->json([
                        'message' => 'Error al guardar el archivo',
                        'error' => 'No se pudo guardar el archivo en el servidor',
                    ], 500);
                }

                $uploadedFiles[] = [
                    'original_name' => $originalName,
                    'stored_name' => $uniqueName,
                    'path' => $path,
                    'url' => route('files.download', ['path' => base64_encode($path)]),
                    'size' => $file->getSize(),
                    'mime_type' => $finalMimeType,
                ];
            }

            return response()->json([
                'message' => 'Archivos subidos exitosamente',
                'files' => $uploadedFiles,
            ], 201);

        } catch (\Exception $e) {
            // Log del error para debugging
            \Log::error('Error al subir archivos: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => 'Ha ocurrido un error inesperado al subir los archivos',
                'debug' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Sanitizar el nombre del archivo
     * Remueve caracteres peligrosos y limita la longitud
     */
    private function sanitizeFileName(string $fileName): string
    {
        // Remover caracteres peligrosos
        $fileName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $fileName);

        // Remover espacios múltiples
        $fileName = preg_replace('/_+/', '_', $fileName);

        // Remover guiones bajos al inicio y final
        $fileName = trim($fileName, '_');

        // Limitar longitud (máximo 100 caracteres)
        $fileName = substr($fileName, 0, 100);

        // Si quedó vacío, usar un nombre por defecto
        if (empty($fileName)) {
            $fileName = 'archivo';
        }

        return $fileName;
    }

    /**
     * Verificar que el MIME type detectado coincida con la extensión
     * Esto previene archivos maliciosos que se disfrazan con extensiones falsas
     */
    private function isMimeTypeValidForExtension(string $mimeType, string $extension): bool
    {
        $extension = strtolower($extension);

        $mimeTypeMap = [
            'jpg' => ['image/jpeg', 'image/jpg'],
            'jpeg' => ['image/jpeg', 'image/jpg'],
            'png' => ['image/png'],
            'gif' => ['image/gif'],
            'webp' => ['image/webp'],
            'bmp' => ['image/bmp', 'image/x-ms-bmp'],
            'pdf' => ['application/pdf'],
        ];

        if (! isset($mimeTypeMap[$extension])) {
            return false;
        }

        return in_array($mimeType, $mimeTypeMap[$extension]);
    }

    /**
     * Descargar o ver un archivo
     */
    public function download(Request $request, string $path)
    {
        try {
            // Decodificar el path
            $decodedPath = base64_decode($path);

            // Verificar que el path sea válido y no contenga path traversal
            if (! $decodedPath || strpos($decodedPath, '..') !== false) {
                abort(404, 'Archivo no encontrado');
            }

            // Verificar que el archivo existe en el disco public
            if (! Storage::disk('public')->exists($decodedPath)) {
                abort(404, 'Archivo no encontrado');
            }

            // Obtener el archivo
            $file = Storage::disk('public')->get($decodedPath);
            $mimeType = Storage::disk('public')->mimeType($decodedPath);
            $fileName = basename($decodedPath);

            // Retornar el archivo con los headers apropiados
            return response($file, 200)
                ->header('Content-Type', $mimeType)
                ->header('Content-Disposition', 'inline; filename="'.$fileName.'"');
        } catch (\Exception $e) {
            abort(404, 'Archivo no encontrado');
        }
    }
}

