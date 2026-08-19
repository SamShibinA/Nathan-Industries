import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    stage: {
      type: String,
      enum: ['before', 'during', 'after', 'general'],
      default: 'general',
    },
    caption: { type: String, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide the project title'],
      trim: true,
      maxlength: [150, 'Project title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    projectType: {
      type: String,
      required: [true, 'Please specify the project type'],
      enum: [
        'railway-overbridge',
        'crusher-plant',
        'm-sand',
        'p-sand',
        'industrial-construction',
        'infrastructure',
      ],
      index: true,
    },
    clientName: {
      type: String,
      required: [true, 'Please provide the client / authority name'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['completed', 'ongoing', 'upcoming'],
      default: 'completed',
      index: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    duration: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Please provide the project location / city & state'],
      trim: true,
    },
    fullAddress: {
      type: String,
      trim: true,
      default: '',
    },
    googleMapsLink: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please provide the project case study description'],
      trim: true,
    },
    scopeOfWork: {
      type: [String],
      default: [],
    },
    machineryUsed: {
      type: [String],
      default: [],
    },
    projectCapacity: {
      type: String,
      required: [true, 'Please specify the project output / scale capacity (e.g. 600 TPH or 720m 4-Lane ROB)'],
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    gallery: {
      type: [galleryItemSchema],
      default: [],
    },
    documents: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate unique slug & duration before save
projectSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  if (this.startDate && this.endDate && !this.duration) {
    const diffTime = Math.abs(new Date(this.endDate) - new Date(this.startDate));
    const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    this.duration = `${diffMonths} Months`;
  }

  next();
});

export const Project = mongoose.model('Project', projectSchema);
export default Project;
