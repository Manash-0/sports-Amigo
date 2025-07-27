// Simple script to create admin user
const mongoose = require('mongoose');
const User = require('./models/schemas/userSchema');
const bcrypt = require('bcrypt');

// Connect to MongoDB
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsamigo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@sportsapp.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists with email:', existingAdmin.email);
      console.log('Admin details:', {
        id: existingAdmin._id,
        name: `${existingAdmin.first_name} ${existingAdmin.last_name}`,
        role: existingAdmin.role
      });
      
      // Update password to 'admin123'
      const salt = await bcrypt.genSalt(10);
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(password, salt);
      
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      
      console.log('Admin password updated to: admin123');
    } else {
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const password = 'admin123';
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const admin = new User({
        email: 'admin@sportsapp.com',
        password: hashedPassword,
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        phone: '1234567890'
      });
      
      await admin.save();
      console.log('Admin user created with:');
      console.log('- Email: admin@sportsapp.com');
      console.log('- Password: admin123');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 