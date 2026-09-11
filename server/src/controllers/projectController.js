import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Project } from '../models/Project.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/responseHandler.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

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
 * @desc    Get All Projects with Search, Type Filter, Status Filter & Pagination
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = asyncHandler(async (req, res, next) => {
  const {
    search,
    projectType,
    status,
    isFeatured,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isActive: true };

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { clientName: searchRegex },
      { location: searchRegex },
      { description: searchRegex },
      { projectCapacity: searchRegex },
    ];
  }

  if (projectType && projectType !== 'all') {
    query.projectType = projectType;
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (isFeatured !== undefined) {
    query.isFeatured = isFeatured === 'true';
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'title-asc') sortOption = { title: 1 };
  if (sort === 'featured') sortOption = { isFeatured: -1, order: 1, createdAt: -1 };

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;
  const skip = (pageNum - 1) * limitNum;

  const total = await Project.countDocuments(query);
  const projects = await Project.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  const totalPages = Math.ceil(total / limitNum) || 1;

  return sendResponse(
    res,
    200,
    'Projects fetched successfully',
    projects,
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
 * @desc    Get Single Project Details by Slug or ID + Related Projects
 * @route   GET /api/projects/:slugOrId
 * @access  Public
 */
export const getProjectBySlugOrId = asyncHandler(async (req, res, next) => {
  const { slugOrId } = req.params;

  let project = await Project.findOne({
    $or: [{ slug: slugOrId.toLowerCase() }, { _id: slugOrId.match(/^[0-9a-fA-F]{24}$/) ? slugOrId : null }],
  });

  if (!project) {
    return next(new AppError(`Project '${slugOrId}' not found`, 404));
  }

  // Fetch Related Projects of same type
  const relatedProjects = await Project.find({
    projectType: project.projectType,
    _id: { $ne: project._id },
    isActive: true,
  })
    .limit(3)
    .select('title slug projectType clientName location projectCapacity coverImage status');

  return sendResponse(res, 200, 'Project details fetched successfully', {
    project,
    relatedProjects,
  });
});

/**
 * @desc    Create New Project (Admin Only)
 * @route   POST /api/projects
 * @access  Private (Admin)
 */
export const createProject = asyncHandler(async (req, res, next) => {
  const {
    title,
    projectType,
    clientName,
    status,
    startDate,
    endDate,
    duration,
    location,
    fullAddress,
    googleMapsLink,
    description,
    scopeOfWork,
    machineryUsed,
    projectCapacity,
    gallery,
    isFeatured,
    isActive,
    order,
  } = req.body;

  const parsedScope = parseArrayOrJson(scopeOfWork);
  const parsedMachinery = parseArrayOrJson(machineryUsed);
  let parsedGallery = parseArrayOrJson(gallery);

  // Files processed from Sharp middleware
  let coverImage = req.processedProjectFiles?.coverImage || '';
  const galleryImages = req.processedProjectFiles?.galleryImages || [];
  const documents = req.processedProjectFiles?.documents || [];

  if (galleryImages.length > 0) {
    const newItems = galleryImages.map((imgUrl) => ({
      url: imgUrl,
      stage: 'during',
      caption: '',
    }));
    parsedGallery = [...parsedGallery, ...newItems];
  }

  if (!coverImage && parsedGallery.length > 0) {
    coverImage = parsedGallery[0].url;
  }

  const slug = generateSlug(title);

  const project = await Project.create({
    title,
    slug,
    projectType,
    clientName,
    status: status || 'completed',
    startDate: startDate || null,
    endDate: endDate || null,
    duration: duration || '',
    location,
    fullAddress: fullAddress || '',
    googleMapsLink: googleMapsLink || '',
    description,
    scopeOfWork: parsedScope,
    machineryUsed: parsedMachinery,
    projectCapacity,
    coverImage,
    gallery: parsedGallery,
    documents,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isActive: isActive !== 'false' && isActive !== false,
    order: parseInt(order, 10) || 0,
  });

  return sendResponse(res, 201, 'Project created successfully', project);
});

/**
 * @desc    Update Project (Admin Only)
 * @route   PUT /api/projects/:id
 * @access  Private (Admin)
 */
export const updateProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let project = await Project.findById(id);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  const updates = { ...req.body };

  if (updates.title) {
    updates.slug = generateSlug(updates.title);
  }

  if (updates.scopeOfWork !== undefined) {
    updates.scopeOfWork = parseArrayOrJson(updates.scopeOfWork);
  }
  if (updates.machineryUsed !== undefined) {
    updates.machineryUsed = parseArrayOrJson(updates.machineryUsed);
  }
  if (updates.gallery !== undefined) {
    updates.gallery = parseArrayOrJson(updates.gallery);
  }

  if (req.processedProjectFiles?.coverImage) {
    updates.coverImage = req.processedProjectFiles.coverImage;
  }

  if (req.processedProjectFiles?.galleryImages && req.processedProjectFiles.galleryImages.length > 0) {
    const newItems = req.processedProjectFiles.galleryImages.map((imgUrl) => ({
      url: imgUrl,
      stage: 'during',
      caption: '',
    }));
    updates.gallery = [...(project.gallery || []), ...newItems];
  }

  if (req.processedProjectFiles?.documents && req.processedProjectFiles.documents.length > 0) {
    updates.documents = [...(project.documents || []), ...req.processedProjectFiles.documents];
  }

  if (updates.isFeatured !== undefined) {
    updates.isFeatured = updates.isFeatured === 'true' || updates.isFeatured === true;
  }
  if (updates.isActive !== undefined) {
    updates.isActive = updates.isActive !== 'false' && updates.isActive !== false;
  }

  project = await Project.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  return sendResponse(res, 200, 'Project updated successfully', project);
});

/**
 * @desc    Delete Project (Admin Only)
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin)
 */
export const deleteProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const project = await Project.findById(id);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Clean up media files (Cloudinary or local)
  const galleryUrls = (project.gallery || []).map((g) => g.url);
  const filesToDelete = [project.coverImage, ...galleryUrls, ...(project.documents || [])].filter(Boolean);

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

  await Project.findByIdAndDelete(id);

  return sendResponse(res, 200, 'Project and associated assets deleted successfully');
});

/**
 * Auto-Seed Initial Landmark Infrastructure & Plant Projects
 */
export const seedInitialProjects = async () => {
  try {
    const count = await Project.countDocuments();
    if (count < 6) {
      console.log('🏗️ [Seed] Seeding Landmark Projects Portfolio for NathanIndustries...');
      await Project.deleteMany({});

      const initialProjects = [
        {
          title: '4-Lane Railway Overbridge (ROB) EPC Erection',
          slug: '4-lane-railway-overbridge-rob-epc-erection-salem-bypass',
          projectType: 'railway-overbridge',
          clientName: 'National Highways & State Bridges Division',
          status: 'completed',
          startDate: new Date('2023-01-10'),
          endDate: new Date('2024-03-15'),
          duration: '14 Months',
          location: 'Salem Bypass, Tamil Nadu',
          fullAddress: 'Chainage 142+200 NH-44 Railway Crossing Corridor, Tamil Nadu',
          googleMapsLink: 'https://maps.google.com/?q=11.6643,78.1460',
          description:
            'Turnkey design, heavy steel girder fabrication, and tandem hydraulic launching of a 720-meter 4-lane Railway Overbridge. Executed across active electrified double railway tracks with zero train schedule disruptions during 3-hour midnight block windows.',
          scopeOfWork: [
            'Fabrication of 48 Nos. 35-meter Prestressed Concrete (PSC) Box Girders',
            'Heavy tandem 300 MT hydraulic crane launching across active rail corridors',
            'Substructure reinforced concrete pier construction with 1.2m dia bored cast-in-situ piles',
            'Installation of elastomeric bridge bearings and seismic expansion joint systems',
          ],
          machineryUsed: [
            '300 MT & 150 MT Telescopic Hydraulic Cranes',
            'Automated Submerged Arc Welding (SAW) Gantries',
            'Hydraulic Girder Launching Truss',
            'Digital Stress Monitoring Telemetry Sensors',
          ],
          projectCapacity: '720m 4-Lane Span • 48 Girders',
          coverImage: '',
          gallery: [
            { url: '', stage: 'before', caption: 'Initial site survey & pile cap foundation excavation' },
            { url: '', stage: 'during', caption: 'Night-time tandem hydraulic crane girder launching' },
            { url: '', stage: 'after', caption: 'Completed 4-lane corridor with crash barriers & bituminous deck' },
          ],
          isFeatured: true,
          isActive: true,
          order: 1,
        },
        {
          title: '600 TPH Mega Turnkey Granite Crushing Complex',
          slug: '600-tph-mega-turnkey-granite-crushing-complex-hosur',
          projectType: 'crusher-plant',
          clientName: 'Kongu Blue Metals & Mining Corp',
          status: 'completed',
          startDate: new Date('2023-06-01'),
          endDate: new Date('2024-01-20'),
          duration: '8 Months',
          location: 'Hosur Industrial Corridor, Tamil Nadu',
          fullAddress: 'Plot 45-48 Heavy Mineral Extraction Zone, Hosur',
          googleMapsLink: 'https://maps.google.com/?q=12.7409,77.8253',
          description:
            'Comprehensive EPC installation of an ultra-heavy 600 TPH 3-stage granite crushing and screening plant. Integrated primary jaw, dual secondary hydraulic cone crushers, tertiary VSI shaping, and central SCADA automation room.',
          scopeOfWork: [
            'Topographical layout & heavy machine concrete foundation civil execution',
            'Installation of NI-JC-1209 Primary Jaw and dual NI-CC-400 Cone Crushers',
            'Erection of 12 heavy overland conveyors totaling 1.4 km length',
            'Full SCADA motor control center (MCC) commissioning with remote telemetry',
          ],
          machineryUsed: [
            'NI-JC-1209 Primary Jaw Crusher',
            'Dual NI-CC-400 Hydraulic Multi-Cylinder Cones',
            'NI-VSI-950 Rock-on-Rock Shaping Unit',
            '4-Deck 2.4m x 6.0m Vibrating Screens',
          ],
          projectCapacity: '600 TPH Continuous Output',
          coverImage: '',
          gallery: [
            { url: '', stage: 'before', caption: 'Greenfield quarry site contour grading and soil testing' },
            { url: '', stage: 'during', caption: 'Structural steel chute erection and cone crusher placement' },
            { url: '', stage: 'after', caption: 'Fully commissioned 600 TPH plant feeding aggregate stockpiles' },
          ],
          isFeatured: true,
          isActive: true,
          order: 2,
        },
        {
          title: '250 TPH Dry VSI Manufactured Sand (M-Sand) Facility',
          slug: '250-tph-dry-vsi-manufactured-sand-m-sand-facility-coimbatore',
          projectType: 'm-sand',
          clientName: 'Apex Aggregates & RMC Infrastructure',
          status: 'completed',
          startDate: new Date('2023-09-15'),
          endDate: new Date('2024-02-28'),
          duration: '5 Months',
          location: 'Coimbatore, Tamil Nadu',
          fullAddress: 'Madukkarai Quarry Hub, Coimbatore',
          googleMapsLink: 'https://maps.google.com/?q=10.9038,76.9638',
          description:
            'Installation of an eco-friendly zero-water-wash dry air-classified M-Sand and P-Sand plant producing 100% IS 383 Zone-II compliant manufactured sand with silt content maintained strictly below 2.8%.',
          scopeOfWork: [
            'Installation of NI-VSI-950 twin-drive sand making unit',
            'Centrifugal dry air classifier and cyclone bag filter integration',
            'Dust containment acoustic enclosure and automated sampling port',
            'Laboratory calibration with RMC batching plant concrete trial mix designs',
          ],
          machineryUsed: [
            'NI-VSI-950 Twin-Drive Sand Maker (2x132 kW)',
            'Dynamic Air Silt Extractor Unit',
            'High-Frequency De-dusting Screen',
          ],
          projectCapacity: '250 TPH M-Sand / P-Sand',
          coverImage: '',
          gallery: [
            { url: '', stage: 'before', caption: 'Civil pedestal casting for VSI foundation' },
            { url: '', stage: 'during', caption: 'Air classifier ducting and cyclone installation' },
            { url: '', stage: 'after', caption: 'Operational plant discharging Zone-II cubical sand' },
          ],
          isFeatured: true,
          isActive: true,
          order: 3,
        },
        {
          title: '2.4 km Heavy Overland Bulk Conveyor Corridor',
          slug: '2-4-km-heavy-overland-bulk-conveyor-corridor-ariyalur',
          projectType: 'industrial-construction',
          clientName: 'Southern Cement & Mineral Corporation',
          status: 'completed',
          startDate: new Date('2022-11-01'),
          endDate: new Date('2023-09-30'),
          duration: '11 Months',
          location: 'Ariyalur Limestone Belt, Tamil Nadu',
          fullAddress: 'Limestone Mine Pit 3 to Raw Mill Plant, Ariyalur',
          googleMapsLink: 'https://maps.google.com/?q=11.1399,79.0763',
          description:
            'Long-distance overland bulk conveyor spanning undulating terrain, ravines, and highway crossings to transfer crushed limestone directly from mine pit to cement plant raw mill silos.',
          scopeOfWork: [
            '2.4 km structural lattice triangular steel gallery erection',
            'Installation of 1000mm EP-500 flame retardant steel cord belting',
            'Emergency rip-detection and acoustic bearing temperature sensors',
            'Variable Frequency Drive (VFD) soft-start synchronization',
          ],
          machineryUsed: [
            'NI-CV-1000 Overland Conveyor System',
            '3x90 kW Dual-Drive Head Stations',
            'Automated Gravity Take-Up Tower',
          ],
          projectCapacity: '1,000 TPH Bulk Mineral Transfer',
          coverImage: '',
          gallery: [
            { url: '', stage: 'before', caption: 'Right-of-way corridor surveying & trestle pier layout' },
            { url: '', stage: 'during', caption: 'Lattice truss spans hoisted across state highway' },
            { url: '', stage: 'after', caption: 'Continuous limestone transport across 2.4 km' },
          ],
          isFeatured: false,
          isActive: true,
          order: 4,
        },
        {
          title: 'National Expressway 400 TPH Mobile Crushing Unit',
          slug: 'national-expressway-400-tph-mobile-crushing-unit-bengaluru-highway',
          projectType: 'infrastructure',
          clientName: 'NHAI EPC Concessionaire Group',
          status: 'ongoing',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-12-30'),
          duration: '12 Months',
          location: 'Bengaluru-Chennai Expressway Corridor',
          fullAddress: 'Package 3 Highway Construction Basecamp',
          googleMapsLink: 'https://maps.google.com/?q=12.9716,77.5946',
          description:
            'Deployment of high-mobility modular crushing plants supplying sub-base (GSB), wet mix macadam (WMM), and bituminous concrete cubical aggregates directly along the expressway right-of-way.',
          scopeOfWork: [
            'Continuous crushing of road excavation blasted rock into certified GSB & WMM',
            'Field laboratory daily flakiness and elongation index verification (<15%)',
            'Rapid modular relocation as road paving advances along highway packages',
          ],
          machineryUsed: [
            'Modular Primary Jaw & Cone Crushing Stations',
            'Heavy Mobile Scalping Screens',
            'Radial Stockpiling Stackers',
          ],
          projectCapacity: '400 TPH Highway Sub-Base Aggregates',
          coverImage: '',
          gallery: [
            { url: '', stage: 'during', caption: 'Modular crushing plant active at expressway basecamp' },
          ],
          isFeatured: false,
          isActive: true,
          order: 5,
        },
        {
          title: 'Marine Port Breakwater Heavy Rock Armor Processing',
          slug: 'marine-port-breakwater-heavy-rock-armor-processing-tuticorin',
          projectType: 'infrastructure',
          clientName: 'Maritime Port Development Authority',
          status: 'completed',
          startDate: new Date('2022-04-01'),
          endDate: new Date('2023-03-31'),
          duration: '12 Months',
          location: 'Tuticorin Deepwater Port, Tamil Nadu',
          fullAddress: 'Outer Harbour Expansion Basin, Tuticorin',
          googleMapsLink: 'https://maps.google.com/?q=8.7642,78.1348',
          description:
            'Quarrying, precision size sorting, and haulage of high-density basalt armor rock (1 to 5 metric tons individual boulder weight) for marine sea wall breakwater construction.',
          scopeOfWork: [
            'Controlled primary quarry blasting for large rock yield',
            'Heavy hydraulic rock scalping and sorting grid',
            'Specialized low-bed haulage and coastal barge loading',
          ],
          machineryUsed: [
            'Heavy Duty Hydraulic Rock Breakers',
            'Extra Heavy Scalping Grizzlies',
            'Tandem Heavy Haulage Tractors',
          ],
          projectCapacity: '500,000 MT Marine Armor Rock',
          coverImage: '',
          gallery: [
            { url: '', stage: 'before', caption: 'Quarry face geology test boring' },
            { url: '', stage: 'during', caption: 'Heavy boulder sorting with hydraulic grapples' },
            { url: '', stage: 'after', caption: 'Constructed breakwater protecting harbour basin' },
          ],
          isFeatured: false,
          isActive: true,
          order: 6,
        },
      ];

      await Project.insertMany(initialProjects);
      console.log(`✅ [Seed] Successfully seeded ${initialProjects.length} landmark projects.`);
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed initial projects:', error.message);
  }
};
