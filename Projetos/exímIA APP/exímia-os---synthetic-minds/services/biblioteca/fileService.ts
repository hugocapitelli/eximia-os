// File Service - File Upload & Management Operations
// Story 7.3.0 - File Upload Infrastructure

import { supabase } from '@/lib/supabase/client';
import type { ActionResult } from '../../types/biblioteca';

// =============================================================================
// CONSTANTS
// =============================================================================

// File size limits (in bytes)
const BOOK_FILE_MAX_SIZE = 50 * 1024 * 1024; // 50MB
const COVER_IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed file types
const ALLOWED_BOOK_MIMES = ['application/pdf', 'application/epub+zip'];
const ALLOWED_COVER_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

// Storage bucket names
const BOOK_FILES_BUCKET = 'book-files';
const BOOK_COVERS_BUCKET = 'book-covers';

// Signed URL expiration (7 days in seconds)
const SIGNED_URL_EXPIRATION = 7 * 24 * 60 * 60;

// =============================================================================
// TYPES
// =============================================================================

export interface FileUploadResponse {
  fileUrl: string;
  fileId: string;
  fileName: string;
  size: number;
}

export interface CoverUploadResponse {
  coverUrl: string;
  fileName: string;
  size: number;
}

export interface SignedUrlResponse {
  signedUrl: string;
  expiresIn: number;
}

export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percentage: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validate file type and size for book files
 * @param file - File to validate
 * @returns Error message if invalid, null if valid
 */
function validateBookFile(file: File): string | null {
  if (!file) {
    return 'Arquivo não fornecido';
  }

  // Check file type
  if (!ALLOWED_BOOK_MIMES.includes(file.type)) {
    return 'Tipo de arquivo não permitido. Use PDF ou EPUB';
  }

  // Check file size
  if (file.size > BOOK_FILE_MAX_SIZE) {
    return `Arquivo muito grande. Máximo: 50MB (arquivo atual: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
  }

  // Check file extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !['pdf', 'epub'].includes(ext)) {
    return 'Extensão de arquivo inválida. Use .pdf ou .epub';
  }

  return null;
}

/**
 * Validate file type and size for cover images
 * @param file - File to validate
 * @returns Error message if invalid, null if valid
 */
function validateCoverImage(file: File): string | null {
  if (!file) {
    return 'Arquivo não fornecido';
  }

  // Check file type
  if (!ALLOWED_COVER_MIMES.includes(file.type)) {
    return 'Tipo de imagem não permitido. Use JPG, PNG ou WebP';
  }

  // Check file size
  if (file.size > COVER_IMAGE_MAX_SIZE) {
    return `Imagem muito grande. Máximo: 5MB (imagem atual: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
  }

  // Check file extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return 'Extensão de imagem inválida. Use .jpg, .png ou .webp';
  }

  return null;
}

/**
 * Get file extension from file name
 * @param fileName - File name
 * @returns File extension
 */
function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

/**
 * Generate a unique file path for storage
 * @param catalogId - Book catalog ID
 * @param originalFileName - Original file name
 * @param type - File type (book or cover)
 * @returns Unique file path
 */
function generateFilePath(
  catalogId: string,
  originalFileName: string,
  type: 'book' | 'cover'
): string {
  const timestamp = Date.now();
  const ext = getFileExtension(originalFileName);
  const fileName = `${catalogId}-${timestamp}.${ext}`;

  if (type === 'cover') {
    return `covers/${catalogId}/${fileName}`;
  }

  return `books/${catalogId}/${fileName}`;
}

// =============================================================================
// PUBLIC FUNCTIONS
// =============================================================================

/**
 * Upload a book file (PDF or EPUB) to Supabase Storage
 * @param file - File to upload (PDF or EPUB)
 * @param catalogId - Book catalog ID
 * @param onProgress - Optional callback for progress tracking
 * @returns Upload response with file URL and ID, or error
 */
export async function uploadBookFile(
  file: File,
  catalogId: string,
  onProgress?: (event: UploadProgressEvent) => void
): Promise<ActionResult<FileUploadResponse>> {
  // Validate authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  // Validate admin permission
  const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !adminData) {
    return { success: false, error: 'Acesso negado. Apenas administradores podem upload', code: 'FORBIDDEN' };
  }

  // Validate input
  if (!file || !catalogId) {
    return { success: false, error: 'Arquivo e ID do catálogo são obrigatórios', code: 'VALIDATION_ERROR' };
  }

  // Validate file
  const fileError = validateBookFile(file);
  if (fileError) {
    return { success: false, error: fileError, code: 'VALIDATION_ERROR' };
  }

  try {
    // Generate unique file path
    const filePath = generateFilePath(catalogId, file.name, 'book');

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(BOOK_FILES_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload book file error:', error);
      return { success: false, error: 'Falha ao fazer upload do arquivo', code: 'UPLOAD_ERROR' };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BOOK_FILES_BUCKET)
      .getPublicUrl(filePath);

    // Store file metadata in database
    const { error: dbError } = await supabase
      .from('book_files')
      .insert({
        catalog_id: catalogId,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        file_type: getFileExtension(file.name),
        storage_url: publicUrlData.publicUrl,
        uploaded_by: user.id,
        is_available: true,
      });

    if (dbError) {
      console.error('Store file metadata error:', dbError);
      // Clean up uploaded file if DB insert fails
      await supabase.storage.from(BOOK_FILES_BUCKET).remove([filePath]);
      return { success: false, error: 'Falha ao salvar metadados do arquivo', code: 'DB_ERROR' };
    }

    // Simulate progress events
    if (onProgress) {
      onProgress({ loaded: file.size, total: file.size, percentage: 100 });
    }

    return {
      success: true,
      data: {
        fileUrl: publicUrlData.publicUrl,
        fileId: filePath,
        fileName: file.name,
        size: file.size,
      },
    };
  } catch (err) {
    console.error('Upload book file exception:', err);
    return { success: false, error: 'Erro ao fazer upload do arquivo', code: 'EXCEPTION' };
  }
}

/**
 * Delete a book file from storage
 * @param fileId - File ID (file path)
 * @returns Success/failure result
 */
export async function deleteBookFile(fileId: string): Promise<ActionResult<void>> {
  // Validate authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  // Validate admin permission
  const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !adminData) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  // Validate input
  if (!fileId) {
    return { success: false, error: 'ID do arquivo é obrigatório', code: 'VALIDATION_ERROR' };
  }

  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BOOK_FILES_BUCKET)
      .remove([fileId]);

    if (storageError) {
      console.error('Delete file from storage error:', storageError);
      return { success: false, error: 'Falha ao deletar arquivo do storage', code: 'STORAGE_ERROR' };
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('book_files')
      .delete()
      .eq('file_path', fileId);

    if (dbError) {
      console.error('Delete file metadata error:', dbError);
      return { success: false, error: 'Falha ao deletar metadados do arquivo', code: 'DB_ERROR' };
    }

    return { success: true };
  } catch (err) {
    console.error('Delete book file exception:', err);
    return { success: false, error: 'Erro ao deletar arquivo', code: 'EXCEPTION' };
  }
}

/**
 * Get a signed URL for reading a book file
 * Signed URLs expire after 7 days
 * @param catalogId - Book catalog ID
 * @param fileType - File type to retrieve ('pdf' or 'epub')
 * @returns Signed URL for file access, or error
 */
export async function getBookFileUrl(
  catalogId: string,
  fileType: 'pdf' | 'epub'
): Promise<ActionResult<SignedUrlResponse>> {
  // Validate authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  // Validate input
  if (!catalogId || !fileType) {
    return { success: false, error: 'ID do catálogo e tipo de arquivo são obrigatórios', code: 'VALIDATION_ERROR' };
  }

  try {
    // Query file metadata
    const { data: fileData, error: queryError } = await supabase
      .from('book_files')
      .select('file_path')
      .eq('catalog_id', catalogId)
      .eq('file_type', fileType)
      .single();

    if (queryError || !fileData) {
      console.error('Query file error:', queryError);
      return { success: false, error: 'Arquivo não encontrado', code: 'NOT_FOUND' };
    }

    // Generate signed URL
    const { data: signedData, error: signError } = await supabase.storage
      .from(BOOK_FILES_BUCKET)
      .createSignedUrl(fileData.file_path, SIGNED_URL_EXPIRATION);

    if (signError || !signedData) {
      console.error('Create signed URL error:', signError);
      return { success: false, error: 'Falha ao gerar URL de acesso', code: 'SIGN_ERROR' };
    }

    return {
      success: true,
      data: {
        signedUrl: signedData.signedUrl,
        expiresIn: SIGNED_URL_EXPIRATION,
      },
    };
  } catch (err) {
    console.error('Get book file URL exception:', err);
    return { success: false, error: 'Erro ao obter URL do arquivo', code: 'EXCEPTION' };
  }
}

/**
 * Upload a cover image for a book
 * Supports JPG, PNG, and WebP formats
 * @param file - Image file to upload
 * @param catalogId - Book catalog ID
 * @param onProgress - Optional callback for progress tracking
 * @returns Upload response with cover URL, or error
 */
export async function uploadCover(
  file: File,
  catalogId: string,
  onProgress?: (event: UploadProgressEvent) => void
): Promise<ActionResult<CoverUploadResponse>> {
  // Validate authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  // Validate admin permission
  const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !adminData) {
    return { success: false, error: 'Acesso negado. Apenas administradores podem upload', code: 'FORBIDDEN' };
  }

  // Validate input
  if (!file || !catalogId) {
    return { success: false, error: 'Arquivo e ID do catálogo são obrigatórios', code: 'VALIDATION_ERROR' };
  }

  // Validate file
  const fileError = validateCoverImage(file);
  if (fileError) {
    return { success: false, error: fileError, code: 'VALIDATION_ERROR' };
  }

  try {
    // Generate unique file path
    const filePath = generateFilePath(catalogId, file.name, 'cover');

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(BOOK_COVERS_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload cover image error:', error);
      return { success: false, error: 'Falha ao fazer upload da capa', code: 'UPLOAD_ERROR' };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BOOK_COVERS_BUCKET)
      .getPublicUrl(filePath);

    // Update book catalog with cover URL
    const { error: updateError } = await supabase
      .from('book_catalog')
      .update({
        cover_url: publicUrlData.publicUrl,
      })
      .eq('id', catalogId);

    if (updateError) {
      console.error('Update cover URL error:', updateError);
      // Clean up uploaded file if update fails
      await supabase.storage.from(BOOK_COVERS_BUCKET).remove([filePath]);
      return { success: false, error: 'Falha ao atualizar capa do livro', code: 'UPDATE_ERROR' };
    }

    // Simulate progress events
    if (onProgress) {
      onProgress({ loaded: file.size, total: file.size, percentage: 100 });
    }

    return {
      success: true,
      data: {
        coverUrl: publicUrlData.publicUrl,
        fileName: file.name,
        size: file.size,
      },
    };
  } catch (err) {
    console.error('Upload cover exception:', err);
    return { success: false, error: 'Erro ao fazer upload da capa', code: 'EXCEPTION' };
  }
}

/**
 * Check storage quota and validate before upload
 * @param fileSize - File size in bytes
 * @param fileType - Type of file ('book' or 'cover')
 * @returns Success if quota available, error otherwise
 */
export async function validateStorageQuota(
  fileSize: number,
  fileType: 'book' | 'cover'
): Promise<ActionResult<void>> {
  const maxSize = fileType === 'book' ? BOOK_FILE_MAX_SIZE : COVER_IMAGE_MAX_SIZE;

  if (fileSize > maxSize) {
    const maxMB = maxSize / 1024 / 1024;
    const fileMB = fileSize / 1024 / 1024;
    return {
      success: false,
      error: `Arquivo excede limite de ${maxMB}MB (tamanho atual: ${fileMB.toFixed(2)}MB)`,
      code: 'QUOTA_EXCEEDED',
    };
  }

  return { success: true };
}
