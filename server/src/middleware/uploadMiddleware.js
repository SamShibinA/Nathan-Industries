import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Memory storage for Sharp buffer processing
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
  { name: 'galleryImages', maxCount: 15 },
  { name: 'documents', maxCount: 5 },
]);

// 3. Configure upload fields for Gallery items
export const uploadGalleryImage = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);

/**
 * Middleware: Process uploaded Product images with Sharp
 */
export const processProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  const uploadDir = path.resolve(__dirname, '../../uploads/products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  req.processedFiles = {
    coverImage: null,
    images: [],
    brochure: null,
  };

  if (req.files.coverImage && req.files.coverImage[0]) {
    const file = req.files.coverImage[0];
    const filename = `product-cover-${Date.now()}-${Math.random().toString(36).substr(2, 6)}.webp`;
    const outputPath = path.join(uploadDir, filename);

    await sharp(file.buffer)
      .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    req.processedFiles.coverImage = `/${env.UPLOAD_PATH}/products/${filename}`;
  }

  if (req.files.images && req.files.images.length > 0) {
    for (let i = 0; i < req.files.images.length; i++) {
      const file = req.files.images[i];
      const filename = `product-gallery-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 6)}.webp`;
      const outputPath = path.join(uploadDir, filename);

      await sharp(file.buffer)
        .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toFile(outputPath);

      req.processedFiles.images.push(`/${env.UPLOAD_PATH}/products/${filename}`);
    }
  }

  if (req.files.brochure && req.files.brochure[0]) {
    const file = req.files.brochure[0];
    const filename = `brochure-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const outputPath = path.join(uploadDir, filename);

    fs.writeFileSync(outputPath, file.buffer);
    req.processedFiles.brochure = `/${env.UPLOAD_PATH}/products/${filename}`;
  }

  next();
});

/**
 * Middleware: Process uploaded Project images & documents with Sharp
 */
export const processProjectFiles = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  const uploadDir = path.resolve(__dirname, '../../uploads/projects');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  req.processedProjectFiles = {
    coverImage: null,
    galleryImages: [],
    documents: [],
  };

  if (req.files.coverImage && req.files.coverImage[0]) {
    const file = req.files.coverImage[0];
    const filename = `project-cover-${Date.now()}-${Math.random().toString(36).substr(2, 6)}.webp`;
    const outputPath = path.join(uploadDir, filename);

    await sharp(file.buffer)
      .resize(1800, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    req.processedProjectFiles.coverImage = `/${env.UPLOAD_PATH}/projects/${filename}`;
  }

  if (req.files.galleryImages && req.files.galleryImages.length > 0) {
    for (let i = 0; i < req.files.galleryImages.length; i++) {
      const file = req.files.galleryImages[i];
      const filename = `project-gallery-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 6)}.webp`;
      const outputPath = path.join(uploadDir, filename);

      await sharp(file.buffer)
        .resize(1800, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toFile(outputPath);

      req.processedProjectFiles.galleryImages.push(
        `/${env.UPLOAD_PATH}/projects/${filename}`
      );
    }
  }

  if (req.files.documents && req.files.documents.length > 0) {
    for (let i = 0; i < req.files.documents.length; i++) {
      const file = req.files.documents[i];
      const filename = `project-doc-${Date.now()}-${i}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const outputPath = path.join(uploadDir, filename);

      fs.writeFileSync(outputPath, file.buffer);
      req.processedProjectFiles.documents.push(
        `/${env.UPLOAD_PATH}/projects/${filename}`
      );
    }
  }

  next();
});

/**
 * Middleware: Process uploaded Gallery images with Sharp
 */
export const processGalleryImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  const uploadDir = path.resolve(__dirname, '../../uploads/gallery');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  req.processedGalleryFiles = [];

  const rawFiles = [
    ...(req.files.image || []),
    ...(req.files.images || []),
  ];

  for (let i = 0; i < rawFiles.length; i++) {
    const file = rawFiles[i];
    const filename = `gallery-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 6)}.webp`;
    const outputPath = path.join(uploadDir, filename);

    await sharp(file.buffer)
      .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    req.processedGalleryFiles.push(`/${env.UPLOAD_PATH}/gallery/${filename}`);
  }

  next();
});
