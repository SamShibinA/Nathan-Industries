import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Gallery } from '../models/Gallery.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/responseHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Get All Gallery Items with Category Filter & Search
 * @route   GET /api/gallery
 * @access  Public
 */
export const getGalleryItems = asyncHandler(async (req, res, next) => {
  const { category, search, page = 1, limit = 20 } = req.query;

  const query = { isActive: true };

  if (category && category !== 'all') {
    query.category = category;
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { caption: searchRegex },
      { location: searchRegex },
      { tags: searchRegex },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const total = await Gallery.countDocuments(query);
  const items = await Gallery.find(query)
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const totalPages = Math.ceil(total / limitNum) || 1;

  return sendResponse(
    res,
    200,
    'Gallery items fetched successfully',
    items,
    {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    }
  );
});

/**
 * @desc    Create Gallery Items (Single or Bulk)
 * @route   POST /api/gallery
 * @access  Private (Admin)
 */
export const createGalleryItem = asyncHandler(async (req, res, next) => {
  const { title, category, caption, location, tags, order } = req.body;

  const uploadedFiles = req.processedGalleryFiles || [];
  let parsedTags = [];
  if (tags) {
    parsedTags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim()).filter(Boolean);
  }

  if (uploadedFiles.length === 0 && !req.body.imageUrl) {
    return next(new AppError('Please upload at least one image file', 400));
  }

  // If multiple images uploaded in batch
  if (uploadedFiles.length > 1) {
    const itemsToCreate = uploadedFiles.map((fileUrl, idx) => ({
      title: `${title} - Part ${idx + 1}`,
      category: category || 'factory',
      imageUrl: fileUrl,
      caption: caption || '',
      location: location || '',
      tags: parsedTags,
      order: parseInt(order, 10) || 0,
      isActive: true,
    }));

    const createdItems = await Gallery.insertMany(itemsToCreate);
    return sendResponse(res, 201, `${createdItems.length} Gallery items created successfully`, createdItems);
  }

  // Single item
  const imageUrl = uploadedFiles.length === 1 ? uploadedFiles[0] : req.body.imageUrl;

  const item = await Gallery.create({
    title,
    category: category || 'factory',
    imageUrl,
    caption: caption || '',
    location: location || '',
    tags: parsedTags,
    order: parseInt(order, 10) || 0,
    isActive: true,
  });

  return sendResponse(res, 201, 'Gallery item created successfully', item);
});

/**
 * @desc    Update Gallery Item
 * @route   PUT /api/gallery/:id
 * @access  Private (Admin)
 */
export const updateGalleryItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let item = await Gallery.findById(id);
  if (!item) {
    return next(new AppError('Gallery item not found', 404));
  }

  const updates = { ...req.body };

  if (req.processedGalleryFiles && req.processedGalleryFiles.length > 0) {
    updates.imageUrl = req.processedGalleryFiles[0];
  }

  if (updates.tags && typeof updates.tags === 'string') {
    updates.tags = updates.tags.split(',').map((t) => t.trim()).filter(Boolean);
  }

  item = await Gallery.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  return sendResponse(res, 200, 'Gallery item updated successfully', item);
});

/**
 * @desc    Delete Gallery Item
 * @route   DELETE /api/gallery/:id
 * @access  Private (Admin)
 */
export const deleteGalleryItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const item = await Gallery.findById(id);
  if (!item) {
    return next(new AppError('Gallery item not found', 404));
  }

  if (item.imageUrl) {
    const fullPath = path.resolve(__dirname, '../../', item.imageUrl.replace(/^\//, ''));
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.warn(`Failed to delete gallery image: ${fullPath}`);
      }
    }
  }

  await Gallery.findByIdAndDelete(id);

  return sendResponse(res, 200, 'Gallery item deleted successfully');
});

/**
 * Auto-Seed Initial Visual Gallery
 */
export const seedInitialGallery = async () => {
  try {
    const count = await Gallery.countDocuments();
    if (count < 8) {
      console.log('🖼️ [Seed] Seeding Factory, Machine & Construction Gallery...');
      await Gallery.deleteMany({});

      const initialGallery = [
        {
          title: 'Heavy CNC Horizontal Boring Bay',
          category: 'factory',
          imageUrl: '',
          caption: 'Micron-tolerance bearing seat boring on NI-JC-1209 cast steel jaw crusher mainframe.',
          location: 'Heavy Machine Shop Bay 1, Plant HQ',
          tags: ['CNC Tooling', 'Precision Machining', 'Heavy Engineering'],
          order: 1,
        },
        {
          title: 'Induction Melting & Manganese Alloy Pouring',
          category: 'factory',
          imageUrl: '',
          caption: 'Liquid high-manganese steel (Mn18Cr2) tapped at 1,550°C for crusher jaw plate casting.',
          location: 'Induction Foundry Complex',
          tags: ['Foundry', 'Metallurgy', 'Casting'],
          order: 2,
        },
        {
          title: 'Primary Heavy Duty Jaw Crusher Assembly',
          category: 'machines',
          imageUrl: '',
          caption: 'Pre-dispatch dynamic flywheel balancing and hydraulic toggle mechanism alignment.',
          location: 'Machinery Assembly Bay 3',
          tags: ['Jaw Crusher', 'Crushing Machinery', 'Assembly'],
          order: 3,
        },
        {
          title: 'Hydraulic Multi-Cylinder Cone Crusher Testing',
          category: 'machines',
          imageUrl: '',
          caption: 'Hydrostatic pressure testing of multi-cylinder tramp release and eccentric rotation.',
          location: 'Testing & QA Division',
          tags: ['Cone Crusher', 'Hydraulics', 'Testing'],
          order: 4,
        },
        {
          title: 'VSI Manufactured Sand Maker (NI-VSI-950)',
          category: 'machines',
          imageUrl: '',
          caption: 'High-speed rock-on-rock centrifugal rotor assembly with tungsten carbide tips.',
          location: 'VSI Precision Shop',
          tags: ['M-Sand', 'VSI Sand Maker', 'Rotors'],
          order: 5,
        },
        {
          title: '600 TPH Turnkey Quarry Plant Commissioning',
          category: 'projects',
          imageUrl: '',
          caption: 'Multi-deck circular motion vibrating screens and aggregate stockpiling conveyor network.',
          location: 'Hosur Granite Complex, Tamil Nadu',
          tags: ['600 TPH Plant', 'Turnkey Quarry', 'Screens'],
          order: 6,
        },
        {
          title: 'Overland Lattice Truss Conveyor Belt Corridor',
          category: 'projects',
          imageUrl: '',
          caption: '2.4 km bulk transfer conveyor spanning across terrain from mine pit to raw mill.',
          location: 'Ariyalur Limestone Belt',
          tags: ['Overland Conveyor', 'Material Handling', 'Cement Plant'],
          order: 7,
        },
        {
          title: 'Railway Overbridge 35m Box Girder Launching',
          category: 'construction',
          imageUrl: '',
          caption: '300 MT hydraulic crane tandem girder erection across electrified rail tracks.',
          location: 'Salem Bypass ROB Site, NH-44',
          tags: ['Railway Overbridge', 'PSC Girders', 'Bridge Construction'],
          order: 8,
        },
        {
          title: 'Submerged Arc Welding on Structural Box Girders',
          category: 'construction',
          imageUrl: '',
          caption: 'Automated robotic welding gantries delivering full-penetration ultrasonic certified welds.',
          location: 'Heavy Structural Fabrication Shop',
          tags: ['SAW Welding', 'Bridge Girders', 'Fabrication'],
          order: 9,
        },
        {
          title: 'Marine Armor Rock Quarry Sorting',
          category: 'construction',
          imageUrl: '',
          caption: 'Heavy rock breakers and hydraulic grapples sorting 3 to 5 MT basalt breakwater boulders.',
          location: 'Tuticorin Port Breakwater Project',
          tags: ['Marine Infrastructure', 'Breakwater', 'Rock Armor'],
          order: 10,
        },
      ];

      await Gallery.insertMany(initialGallery);
      console.log(`✅ [Seed] Successfully seeded ${initialGallery.length} gallery records.`);
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed initial gallery:', error.message);
  }
};
