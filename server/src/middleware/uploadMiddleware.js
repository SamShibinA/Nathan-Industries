import multer from 'multer';
import sharp from 'sharp';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadStreamToCloudinary } from '../config/cloudinary.js';

// Memory storage for buffer processing
const storage = multer.memoryStorage();

// File filter for images and PDF documents
const fileFilter = (req, file, cb) => {
  const allowedImageMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
  ];
  const allowedDocMimes = ['application/pdf'];

  if (
    allowedImageMimes.includes(file.mimetype) ||
    allowedDocMimes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Unsupported file format: ${file.mimetype}. Allowed: JPG, PNG, WEBP, and PDF.`,
        400
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max per file
    files: 20,                  // Max 20 files per request
  },
});

// 1. Configure upload fields for Product forms
export const uploadProductImages = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'brochure', maxCount: 1 },
]);

// 2. Configure upload fields for Project forms
export const uploadProjectFiles = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'beforeImages', maxCount: 10 },
  { name: 'duringImages', maxCount: 10 },
  { name: 'afterImages', maxCount: 10 },
  { name: 'galleryImages', maxCount: 15 },
  { name: 'documents', maxCount: 5 },
]);

// 3. Configure upload fields for Gallery items
export const uploadGalleryImage = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);

/**
 * Middleware: Process uploaded Product images and upload to Cloudinary
 */
export const processProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  req.processedFiles = {
    coverImage: null,
    images: [],
    brochure: null,
  };

  // 1. Process Product Cover Image
  if (req.files.coverImage && req.files.coverImage[0]) {
    const file = req.files.coverImage[0];
    const optimizedBuffer = await sharp(file.buffer)
      .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toBuffer();

    const uploadResult = await uploadStreamToCloudinary(optimizedBuffer, {
      folder: 'nathan_industries/products',
      resource_type: 'image',
    });

    req.processedFiles.coverImage = uploadResult.secure_url;
  }

  // 2. Process Product Additional Images
  if (req.files.images && req.files.images.length > 0) {
    for (let i = 0; i < req.files.images.length; i++) {
      const file = req.files.images[i];
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();

      const uploadResult = await uploadStreamToCloudinary(optimizedBuffer, {
        folder: 'nathan_industries/products',
        resource_type: 'image',
      });

      req.processedFiles.images.push(uploadResult.secure_url);
    }
  }

  // 3. Process Product PDF Brochure
  if (req.files.brochure && req.files.brochure[0]) {
    const file = req.files.brochure[0];
    const uploadResult = await uploadStreamToCloudinary(file.buffer, {
      folder: 'nathan_industries/documents',
      resource_type: 'auto',
    });

    req.processedFiles.brochure = uploadResult.secure_url;
  }

  next();
});

/**
 * Middleware: Process uploaded Project images & documents and upload to Cloudinary
 */
export const processProjectFiles = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  req.processedProjectFiles = {
    coverImage: null,
    beforeImages: [],
    duringImages: [],
    afterImages: [],
    galleryImages: [],
    documents: [],
  };

  // Helper to optimize and upload a list of image files
  const processImageGroup = async (fileList, folder = 'nathan_industries/projects') => {
    const urls = [];
    if (!fileList || fileList.length === 0) return urls;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1800, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();

      const uploadResult = await uploadStreamToCloudinary(optimizedBuffer, {
        folder,
        resource_type: 'image',
      });
      urls.push(uploadResult.secure_url);
    }
    return urls;
  };

  // 1. Process Project Cover Image
  if (req.files.coverImage && req.files.coverImage[0]) {
    const [coverUrl] = await processImageGroup([req.files.coverImage[0]]);
    req.processedProjectFiles.coverImage = coverUrl || null;
  }

  // 2. Process Before, During, and After Stage Images
  if (req.files.beforeImages && req.files.beforeImages.length > 0) {
    req.processedProjectFiles.beforeImages = await processImageGroup(req.files.beforeImages);
  }
  if (req.files.duringImages && req.files.duringImages.length > 0) {
    req.processedProjectFiles.duringImages = await processImageGroup(req.files.duringImages);
  }
  if (req.files.afterImages && req.files.afterImages.length > 0) {
    req.processedProjectFiles.afterImages = await processImageGroup(req.files.afterImages);
  }

  // 3. Process Generic Project Gallery Images (backward compatibility)
  if (req.files.galleryImages && req.files.galleryImages.length > 0) {
    req.processedProjectFiles.galleryImages = await processImageGroup(req.files.galleryImages);
  }

  // 4. Process Project Documents / PDFs
  if (req.files.documents && req.files.documents.length > 0) {
    for (let i = 0; i < req.files.documents.length; i++) {
      const file = req.files.documents[i];
      const uploadResult = await uploadStreamToCloudinary(file.buffer, {
        folder: 'nathan_industries/documents',
        resource_type: 'auto',
      });

      req.processedProjectFiles.documents.push(uploadResult.secure_url);
    }
  }

  next();
});

/**
 * Middleware: Process uploaded Gallery images and upload to Cloudinary
 */
export const processGalleryImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  req.processedGalleryFiles = [];

  const rawFiles = [
    ...(req.files.image || []),
    ...(req.files.images || []),
  ];

  for (let i = 0; i < rawFiles.length; i++) {
    const file = rawFiles[i];
    const optimizedBuffer = await sharp(file.buffer)
      .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toBuffer();

    const uploadResult = await uploadStreamToCloudinary(optimizedBuffer, {
      folder: 'nathan_industries/gallery',
      resource_type: 'image',
    });

    req.processedGalleryFiles.push(uploadResult.secure_url);
  }

  next();
});
