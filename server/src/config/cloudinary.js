import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a Buffer directly to Cloudinary using upload_stream
 * @param {Buffer} buffer - File buffer
 * @param {Object} options - Cloudinary upload options (folder, resource_type, etc.)
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadStreamToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Extract Cloudinary Public ID from a full Cloudinary URL
 * Example: https://res.cloudinary.com/fpbcpccp/image/upload/v1234567/nathan_industries/products/cover.webp
 * Returns: nathan_industries/products/cover
 * @param {String} url
 * @returns {String|null}
 */
export const extractPublicId = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return null;
  }

  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    // Everything after '/upload/'
    let afterUpload = url.substring(uploadIndex + '/upload/'.length);

    // Strip version prefix if present, e.g. 'v1726042456/'
    afterUpload = afterUpload.replace(/^v\d+\//, '');

    // Strip file extension at the end (e.g. .webp, .jpg, .png, .pdf)
    const lastDotIndex = afterUpload.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return afterUpload.substring(0, lastDotIndex);
    }
    return afterUpload;
  } catch (err) {
    return null;
  }
};

/**
 * Safely delete an asset from Cloudinary by its URL or Public ID
 * @param {String} urlOrPublicId
 * @param {Object} options - Optional options for cloudinary.uploader.destroy
 */
export const deleteFromCloudinary = async (urlOrPublicId, options = {}) => {
  if (!urlOrPublicId) return;

  try {
    let publicId = urlOrPublicId;
    if (urlOrPublicId.startsWith('http://') || urlOrPublicId.startsWith('https://')) {
      publicId = extractPublicId(urlOrPublicId);
    }

    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        ...options,
      });
      return result;
    }
  } catch (err) {
    console.warn(`[Cloudinary Cleanup] Failed to delete asset '${urlOrPublicId}':`, err.message);
  }
};

export default cloudinary;
