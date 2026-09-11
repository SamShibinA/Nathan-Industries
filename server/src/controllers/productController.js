import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/responseHandler.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Helper to safely generate slug from name & model
 */
const generateSlug = (name, modelNumber) => {
  let base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  if (modelNumber) {
    const m = modelNumber.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!base.includes(m)) {
      base = `${base}-${m}`;
    }
  }
  return base;
};

/**
 * Helper to safely parse JSON or array strings from multipart/form-data
 */
const parseArrayOrJson = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    if (typeof val === 'string') {
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }
};

/**
 * @desc    Get All Products with Search, Filtering, Sorting & Pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res, next) => {
  const {
    search,
    category,
    isFeatured,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isActive: true };

  // 1. Search Query (matches name, description, modelNumber, category)
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { modelNumber: searchRegex },
      { category: searchRegex },
      { 'specifications.value': searchRegex },
    ];
  }

  // 2. Category Filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // 3. Featured Filter
  if (isFeatured !== undefined) {
    query.isFeatured = isFeatured === 'true';
  }

  // 4. Sorting Options
  let sortOption = { createdAt: -1 };
  if (sort === 'name-asc') sortOption = { name: 1 };
  if (sort === 'name-desc') sortOption = { name: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'featured') sortOption = { isFeatured: -1, order: 1, createdAt: -1 };

  // 5. Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;
  const skip = (pageNum - 1) * limitNum;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  const totalPages = Math.ceil(total / limitNum) || 1;

  return sendResponse(
    res,
    200,
    'Products fetched successfully',
    products,
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
 * @desc    Get Single Product Details by Slug or ID + Related Products
 * @route   GET /api/products/:slugOrId
 * @access  Public
 */
export const getProductBySlugOrId = asyncHandler(async (req, res, next) => {
  const { slugOrId } = req.params;

  let product = await Product.findOne({
    $or: [{ slug: slugOrId.toLowerCase() }, { _id: slugOrId.match(/^[0-9a-fA-F]{24}$/) ? slugOrId : null }],
  });

  if (!product) {
    return next(new AppError(`Product '${slugOrId}' not found`, 404));
  }

  // Fetch Related Products in same category
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(4)
    .select('name slug modelNumber category capacity power coverImage isFeatured');

  return sendResponse(res, 200, 'Product details fetched successfully', {
    product,
    relatedProducts,
  });
});

/**
 * @desc    Create New Product (Admin Only)
 * @route   POST /api/products
 * @access  Private (Admin)
 */
export const createProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    modelNumber,
    category,
    description,
    capacity,
    power,
    feedSize,
    outputSize,
    specifications,
    applications,
    features,
    isFeatured,
    isActive,
    order,
  } = req.body;

  // Process specifications JSON
  let parsedSpecs = [];
  if (specifications) {
    parsedSpecs = parseArrayOrJson(specifications);
  }

  // Parse arrays
  const parsedApplications = parseArrayOrJson(applications);
  const parsedFeatures = parseArrayOrJson(features);

  // Extract uploaded files from Sharp middleware
  let coverImage = req.processedFiles?.coverImage || '';
  let images = req.processedFiles?.images || [];
  let brochure = req.processedFiles?.brochure || '';

  // If cover image not provided but images array has files, use first image as cover
  if (!coverImage && images.length > 0) {
    coverImage = images[0];
  }

  const slug = generateSlug(name, modelNumber);

  const product = await Product.create({
    name,
    slug,
    modelNumber: modelNumber || '',
    category,
    description,
    capacity,
    power,
    feedSize: feedSize || 'N/A',
    outputSize: outputSize || 'N/A',
    specifications: parsedSpecs,
    applications: parsedApplications,
    features: parsedFeatures,
    coverImage,
    images,
    brochure,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isActive: isActive !== 'false' && isActive !== false,
    order: parseInt(order, 10) || 0,
  });

  return sendResponse(res, 201, 'Product created successfully', product);
});

/**
 * @desc    Update Product (Admin Only)
 * @route   PUT /api/products/:id
 * @access  Private (Admin)
 */
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const updates = { ...req.body };

  if (updates.name || updates.modelNumber) {
    updates.slug = generateSlug(updates.name || product.name, updates.modelNumber || product.modelNumber);
  }

  // Parse arrays/JSON if provided
  if (updates.specifications !== undefined) {
    updates.specifications = parseArrayOrJson(updates.specifications);
  }
  if (updates.applications !== undefined) {
    updates.applications = parseArrayOrJson(updates.applications);
  }
  if (updates.features !== undefined) {
    updates.features = parseArrayOrJson(updates.features);
  }

  // Merge new files if uploaded
  if (req.processedFiles?.coverImage) {
    updates.coverImage = req.processedFiles.coverImage;
  }

  if (req.processedFiles?.images && req.processedFiles.images.length > 0) {
    updates.images = [...(product.images || []), ...req.processedFiles.images];
  }

  if (req.processedFiles?.brochure) {
    updates.brochure = req.processedFiles.brochure;
  }

  if (updates.isFeatured !== undefined) {
    updates.isFeatured = updates.isFeatured === 'true' || updates.isFeatured === true;
  }
  if (updates.isActive !== undefined) {
    updates.isActive = updates.isActive !== 'false' && updates.isActive !== false;
  }

  product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  return sendResponse(res, 200, 'Product updated successfully', product);
});

/**
 * @desc    Delete Product (Admin Only)
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Clean up media files (Cloudinary or local)
  const filesToDelete = [product.coverImage, ...(product.images || []), product.brochure].filter(Boolean);
  for (const fileUrl of filesToDelete) {
    if (fileUrl.includes('cloudinary.com')) {
      await deleteFromCloudinary(fileUrl);
    } else {
      const fullPath = path.resolve(__dirname, '../../', fileUrl.replace(/^\//, ''));
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.warn(`Failed to delete physical file: ${fullPath}`);
        }
      }
    }
  }

  await Product.findByIdAndDelete(id);

  return sendResponse(res, 200, 'Product and associated media deleted successfully');
});

/**
 * Auto-Seed Initial Comprehensive Machinery Catalog
 */
export const seedInitialProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count < 6) {
      console.log('📦 [Seed] Seeding Comprehensive Machinery Catalog for NathanIndustries...');
      await Product.deleteMany({}); // Refresh initial seed

      const initialProducts = [
        {
          name: 'Integrated Three-Stage Stone Crusher Complex',
          slug: 'integrated-three-stage-stone-crusher-complex-ni-cp-600',
          modelNumber: 'NI-CP-600',
          category: 'stone-crushers',
          description:
            'Complete turnkey 200 - 600 TPH crushing and screening plant engineered for severe hard rock quarrying (Granite, Basalt, Quartzite). Incorporates heavy primary jaw, secondary cone, tertiary shaping VSI, dual multi-deck vibrating screens, and automated MCC SCADA control.',
          capacity: '200 - 600 TPH',
          power: '450 - 750 kW Total Connected',
          feedSize: 'Max 850 mm',
          outputSize: '0-5mm (M-Sand), 10mm, 20mm, 40mm Cubical',
          specifications: [
            { key: 'Primary Stage', value: 'NI-JC-1209 Heavy Jaw Crusher' },
            { key: 'Secondary Stage', value: 'NI-CC-400 Hydraulic Multi-Cylinder Cone' },
            { key: 'Tertiary Stage', value: 'NI-VSI-950 Rock-on-Rock Sand Maker' },
            { key: 'Vibrating Screens', value: '4-Deck 2.4m x 6.0m Inclined Circular Motion' },
            { key: 'Automation', value: 'SCADA Telemetry with Auto-Feeder Regulation' },
            { key: 'Dust Control', value: 'High-Pressure Hydraulic Spray Manifolds' },
          ],
          applications: [
            'Heavy Commercial Quarrying',
            'National Highway Concrete Aggregates',
            'Railway Ballast 65mm Production',
            'Ready-Mix Concrete (RMC) Supply',
          ],
          features: [
            'Heavy-duty reinforced structural chassis and walkways',
            'Automatic tramp iron release protection',
            'Integrated oil lubrication cooling circuit',
            'Low operational cost-per-ton throughput',
          ],
          isFeatured: true,
          isActive: true,
          order: 1,
        },
        {
          name: 'Heavy-Duty Primary Jaw Crusher',
          slug: 'heavy-duty-primary-jaw-crusher-ni-jc-1209',
          modelNumber: 'NI-JC-1209',
          category: 'jaw-crushers',
          description:
            'Engineered for maximum primary rock reduction. Features a single-piece cast steel base frame, forged alloy eccentric shaft, spherical roller bearings with labyrinth seals, and hydraulic wedge discharge opening adjustment.',
          capacity: '180 - 480 TPH',
          power: '132 - 160 kW (180 - 215 HP)',
          feedSize: 'Max 1020 mm (40 inches)',
          outputSize: '100 - 250 mm Closed Side Setting',
          specifications: [
            { key: 'Feed Opening (WxD)', value: '1200 mm x 900 mm' },
            { key: 'Eccentric Shaft Speed', value: '250 RPM' },
            { key: 'Jaw Plate Alloy', value: 'High Manganese (Mn18Cr2)' },
            { key: 'Bearing Type', value: 'Heavy Duty Spherical Double Roller' },
            { key: 'Total Weight', value: '38,500 kg' },
          ],
          applications: [
            'Primary Quarry Fragmentation',
            'Hard Basalt & Granite Boulders',
            'Iron Ore & Limestone Mines',
            'River Boulder Crushing',
          ],
          features: [
            'Deep symmetrical crushing cavity for high reduction ratio',
            'Flywheels dynamically balanced for low vibration',
            'Hydraulic toggle assist for rapid CSS adjustment',
            'Reversible manganese jaw plates for double service life',
          ],
          isFeatured: true,
          isActive: true,
          order: 2,
        },
        {
          name: 'Hydraulic Multi-Cylinder Cone Crusher',
          slug: 'hydraulic-multi-cylinder-cone-crusher-ni-cc-400',
          modelNumber: 'NI-CC-400',
          category: 'cone-crushers',
          description:
            'High-efficiency secondary and tertiary cone crusher engineered for precise aggregate shaping and high yield. Features automated hydraulic clearing, variable eccentric throw, and heavy-duty manganese mantles.',
          capacity: '150 - 380 TPH',
          power: '220 - 315 kW (300 - 425 HP)',
          feedSize: 'Max 250 mm',
          outputSize: '10mm, 20mm, 26mm Highly Cubical',
          specifications: [
            { key: 'Cone Head Diameter', value: '1400 mm' },
            { key: 'Operating Speed', value: '750 - 850 RPM' },
            { key: 'Adjustment Mechanism', value: 'Hydraulic Multi-Cylinder Motor' },
            { key: 'Lubrication', value: 'Forced Oil Circulation with Water Heat Exchanger' },
            { key: 'Weight', value: '24,800 kg' },
          ],
          applications: [
            'Secondary Crushing Stages',
            'Asphalt Concrete Aggregate Production',
            'Railway Track Ballast',
            'High-Strength Precast Concrete Chips',
          ],
          features: [
            'Hydraulic tramp iron release with automatic reset',
            'Inter-particle crushing for superior cubical shaping',
            'Continuous electronic load sensing and auto-choke feed',
            'Quick-change concave ring and mantle liners',
          ],
          isFeatured: true,
          isActive: true,
          order: 3,
        },
        {
          name: 'VSI Manufactured Sand (M-Sand) Plant',
          slug: 'vsi-manufactured-sand-m-sand-plant-ni-vsi-950',
          modelNumber: 'NI-VSI-950',
          category: 'sand-plants',
          description:
            'Vertical Shaft Impactor (VSI) sand maker combined with patented dry air classifier. Produces premium manufactured concrete sand and plaster sand conforming to IS 383 Zone-II standard grading specifications without requiring water washing.',
          capacity: '100 - 250 TPH',
          power: '2x132 kW Dual Electric Drive (360 HP)',
          feedSize: 'Max 45 mm',
          outputSize: '0 - 4.75mm (M-Sand) & 0 - 2.36mm (P-Sand)',
          specifications: [
            { key: 'Rotor Diameter', value: '950 mm 5-Port High Flow' },
            { key: 'Rotor Tip Speed', value: '65 - 85 m/s' },
            { key: 'Crushing Mode', value: 'Rock-on-Rock (Anvil ring optional)' },
            { key: 'Air Classifier', value: 'Dry Centrifugal Silt Extractor (<75 Micron Control)' },
            { key: 'Bearings', value: 'SKF/Timken Heavy Oil-Lubricated Cartridge' },
          ],
          applications: [
            'IS 383 Zone-II Concrete Sand',
            'Super-Fine Plastering Sand (P-Sand)',
            'Aggregate Cubical Shaping',
            'Silica Sand & Quartz Processing',
          ],
          features: [
            'Eliminates water wastage and slurry disposal pond costs',
            'Accurate control over silt content (below 3% guaranteed)',
            'Tungsten carbide tipped wear parts for maximum durability',
            'Hydraulic lid lifter for easy 15-minute maintenance access',
          ],
          isFeatured: true,
          isActive: true,
          order: 4,
        },
        {
          name: 'Heavy Industrial Overland Conveyor System',
          slug: 'heavy-industrial-overland-conveyor-system-ni-cv-1200',
          modelNumber: 'NI-CV-1200',
          category: 'conveyors',
          description:
            'Heavy structural lattice truss overland material handling conveyor systems. Built with vulcanized multi-ply EP belting, precision balanced impact idlers, dust containment skirting, and automated emergency safety pull-cords.',
          capacity: 'Up to 1,200 TPH',
          power: '30 - 110 kW Drive Units',
          feedSize: 'Bulk Aggregates up to 300 mm',
          outputSize: 'Continuous Bulk Transfer',
          specifications: [
            { key: 'Belt Width', value: '800 mm, 1000 mm, 1200 mm' },
            { key: 'Belting Type', value: 'EP 400/3 High-Tensile Flame Resistant Rubber' },
            { key: 'Idler Rollers', value: '127 mm Steel Rollers with Labyrinth Seals' },
            { key: 'Drive System', value: 'Helical Bevel Gearmotor with Backstop' },
            { key: 'Structure', value: 'Galvanized Triangular Lattice Girder' },
          ],
          applications: [
            'Quarry Overland Stockpiling',
            'Crushing Circuit Inter-Equipment Transfer',
            'Cement Plant Raw Mill Feeding',
            'Bulk Marine Port Loading',
          ],
          features: [
            'Heavy-duty primary & secondary polyurethane belt scrapers',
            'Self-aligning carry and return tracking idlers',
            'Integrated emergency stop pull-cord and zero-speed sensors',
            'Modular bolted sections for rapid field erection',
          ],
          isFeatured: false,
          isActive: true,
          order: 5,
        },
        {
          name: 'High-Manganese OEM Crusher Spares & Liners',
          slug: 'high-manganese-oem-crusher-spares-liners-mn18cr2',
          modelNumber: 'Mn18Cr2 / Mn22',
          category: 'spare-parts',
          description:
            'OEM certified replacement wear castings manufactured in our in-house induction foundry. Formulated with high-manganese steel (18% - 22% Mn) and chrome additives for extreme work-hardening capabilities in abrasive granite quarries.',
          capacity: 'Universal Fit / Custom Foundry Castings',
          power: 'N/A',
          feedSize: 'Universal',
          outputSize: 'Up to 40% Longer Wear Life',
          specifications: [
            { key: 'Material Grades', value: 'Mn18Cr2, Mn22, High Chrome White Iron' },
            { key: 'Hardness', value: 'Work hardens from 220 HB up to 550 HB' },
            { key: 'Casting Process', value: 'Medium-Frequency Induction Sand Casting' },
            { key: 'Testing Method', value: '100% Optical Emission Spectroscopy & Ultrasonic NDT' },
            { key: 'Products Available', value: 'Jaw Plates, Mantles, Concaves, Blow Bars, Screens' },
          ],
          applications: [
            'Jaw Crusher Stationary & Swing Plates',
            'Cone Crusher Mantles & Bowl Liners',
            'VSI Rotor Tips & Cavity Wear Plates',
            'Polyurethane & Spring Steel Screen Meshes',
          ],
          features: [
            'Precision machined mounting faces for vibration-free seating',
            'Optimized corrugation profiles for maximum grip and reduction',
            'Guaranteed chemical alloy composition certificate with every batch',
            'Immediate dispatch from central warehouse inventory',
          ],
          isFeatured: false,
          isActive: true,
          order: 6,
        },
      ];

      await Product.insertMany(initialProducts);
      console.log(`✅ [Seed] Successfully seeded ${initialProducts.length} initial machinery products with slugs.`);
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed initial products:', error.message);
  }
};
