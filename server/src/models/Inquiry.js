import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    interest: {
      type: String,
      enum: [
        'general',
        'stone-crushers',
        'jaw-crushers',
        'cone-crushers',
        'sand-plants',
        'conveyors',
        'spare-parts',
        'rob-project',
        'crusher-install',
      ],
      default: 'general',
    },
    message: {
      type: String,
      required: [true, 'Please provide your inquiry details'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'responded', 'closed'],
      default: 'new',
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

// Auto-generate a readable inquiry number
inquirySchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Inquiry').countDocuments();
    this.inquiryNumber = `INQ-${String(count + 101).padStart(3, '0')}`;
  }
  next();
});

inquirySchema.add({
  inquiryNumber: {
    type: String,
    unique: true,
  },
});

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
