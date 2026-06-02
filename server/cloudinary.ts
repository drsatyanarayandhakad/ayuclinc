import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The name of the file
 * @param folder - The folder in Cloudinary to store the file
 * @returns Object with public_id and secure_url
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = "ayurveda-clinic"
) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: fileName.split(".")[0],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            public_id: result?.public_id,
            secure_url: result?.secure_url,
            url: result?.secure_url,
          });
        }
      }
    );

    stream.end(fileBuffer);
  });
}

/**
 * Delete a file from Cloudinary
 * @param publicId - The public ID of the file to delete
 */
export async function deleteFromCloudinary(publicId: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Get a signed URL for a Cloudinary resource
 * @param publicId - The public ID of the resource
 * @param options - Additional options for the URL
 */
export function getCloudinaryUrl(
  publicId: string,
  options: Record<string, unknown> = {}
) {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  });
}
