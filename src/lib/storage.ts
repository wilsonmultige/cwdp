import { supabase } from "@/integrations/supabase/client";

export type StorageBucket = 'projects' | 'gallery' | 'logos';

/**
 * Upload an image to Supabase Storage
 */
export const uploadImage = async (
  bucket: StorageBucket,
  file: File,
  folder?: string
): Promise<{ url: string; path: string } | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
};

/**
 * Delete an image from Supabase Storage
 */
export const deleteImage = async (
  bucket: StorageBucket,
  path: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

/**
 * List all images in a bucket
 */
export const listImages = async (
  bucket: StorageBucket,
  folder?: string
): Promise<any[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('List error:', error);
    return [];
  }
};

/**
 * Get public URL for an image
 */
export const getPublicUrl = (bucket: StorageBucket, path: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return publicUrl;
};

/**
 * Update image metadata (move/rename)
 */
export const updateImagePath = async (
  bucket: StorageBucket,
  fromPath: string,
  toPath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .move(fromPath, toPath);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Update error:', error);
    return false;
  }
};