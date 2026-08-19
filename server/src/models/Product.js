import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the machinery / product name'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    modelNumber: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please select a product category'],
      enum: [
        'stone-crushers',
        'jaw-crushers',
        'cone-crushers',
        'sand-plants',
        'conveyors',
        'spare-parts',
      ],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      trim: true,
    },
    capacity: {
      type: String,
      required: [true, 'Please provide the crushing / production capacity (e.g. 200 - 500 TPH)'],
      trim: true,
    },
    power: {
      type: String,
      required: [true, 'Please provide the electric power rating (e.g. 160 kW / 215 HP)'],
      trim: true,
    },
    feedSize: {
      type: String,
      trim: true,
      default: 'N/A',
    },
    outputSize: {
      type: String,
      trim: true,
      default: 'N/A',
    },
    specifications: {
      type: [specificationSchema],
      default: [],
    },
    applications: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    brochure: {
      type: String,
      default: '',
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

// Auto-generate unique slug before save
productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // If modelNumber exists, append for clarity (e.g. 'heavy-jaw-crusher-ni-jc-1209')
    if (this.modelNumber) {
      const modelSlug = this.modelNumber.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!baseSlug.includes(modelSlug)) {
        baseSlug = `${baseSlug}-${modelSlug}`;
      }
    }
    this.slug = baseSlug;
  }
  next();
});

export const Product = mongoose.model('Product', productSchema);
export default Product;
