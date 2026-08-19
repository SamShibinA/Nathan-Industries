import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    quoteNumber: {
      type: String,
      unique: true,
    },
    product: {
      type: String,
      required: [true, 'Please specify the product or equipment'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    quantity: {
      type: String,
      required: [true, 'Please specify the quantity'],
      trim: true,
    },
    requirement: {
      type: String,
      required: [true, 'Please describe your requirement'],
      maxlength: [2000, 'Requirement details cannot exceed 2000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the delivery/site location'],
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
      default: '',
    },
    timeline: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'quoted', 'closed'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate a readable quote number (RFQ-2026-001)
quoteSchema.pre('save', async function (next) {
  if (this.isNew && !this.quoteNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Quote').countDocuments();
    this.quoteNumber = `RFQ-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

export const Quote = mongoose.model('Quote', quoteSchema);
export default Quote;
