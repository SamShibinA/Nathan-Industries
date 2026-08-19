import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const createOrUpdateAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nathan_industries';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);

    const email = 'admin@gmail.com';
    const password = 'admin@123';

    let user = await User.findOne({ email });

    if (user) {
      user.password = password;
      user.role = 'admin';
      user.isActive = true;
      user.name = user.name || 'Sam Shibin';
      user.companyName = user.companyName || 'NathanIndustries Executive';
      user.phone = user.phone || '+91 98765 43210';
      await user.save();
      console.log(`✅ User ${email} successfully updated to role 'admin' with new password.`);
    } else {
      user = await User.create({
        name: 'Sam Shibin',
        companyName: 'NathanIndustries Executive',
        email: email,
        phone: '+91 98765 43210',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        gst: '33AAACN1234F1Z5',
        interestedProduct: 'stone-crushers',
        password: password,
        role: 'admin',
        isActive: true,
      });
      console.log(`✅ Admin account for ${email} created successfully.`);
    }

    console.log('----------------------------------------------------');
    console.log('🔑 Credentials:');
    console.log('📧 Email:', email);
    console.log('🔒 Password:', password);
    console.log('👑 Role: admin');
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create/update admin user:', error);
    process.exit(1);
  }
};

createOrUpdateAdmin();
