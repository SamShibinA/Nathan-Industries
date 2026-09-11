import sharp from 'sharp';
import cloudinary, { uploadStreamToCloudinary, extractPublicId, deleteFromCloudinary } from '../src/config/cloudinary.js';

async function testCloudinaryConnection() {
  console.log('Testing Cloudinary configuration...');
  try {
    // 1. Check Cloudinary ping
    const ping = await cloudinary.api.ping();
    console.log('✅ Cloudinary Ping Status:', ping.status);

    // 2. Create small 10x10 in-memory test image with sharp
    const testImageBuffer = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 4,
        background: { r: 230, g: 30, b: 30, alpha: 1 },
      },
    })
      .webp()
      .toBuffer();

    // 3. Upload test image buffer
    console.log('Uploading test image buffer to nathan_industries/test...');
    const uploadResult = await uploadStreamToCloudinary(testImageBuffer, {
      folder: 'nathan_industries/test',
      resource_type: 'image',
    });

    console.log('✅ Test Upload Succeeded!');
    console.log('   Public ID:', uploadResult.public_id);
    console.log('   Secure URL:', uploadResult.secure_url);

    // 4. Test extractPublicId
    const extractedId = extractPublicId(uploadResult.secure_url);
    console.log('   Extracted ID:', extractedId);

    // 5. Delete test image
    console.log('Deleting test image...');
    const deleteResult = await deleteFromCloudinary(uploadResult.secure_url);
    console.log('✅ Cloudinary Delete Status:', deleteResult?.result || 'ok');

    console.log('🎉 All Cloudinary tests passed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cloudinary Test Failed:', error);
    process.exit(1);
  }
}

testCloudinaryConnection();
