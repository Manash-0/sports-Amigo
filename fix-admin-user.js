const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sportsamigo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Import schema directly to avoid any model issues
    const User = require('./models/schemas/userSchema');
    
    // Delete existing admin if any
    console.log('Removing any existing admin users...');
    await User.deleteMany({ email: 'admin@sportsapp.com' });
    
    // Create admin user with explicit role setting
    console.log('Creating fresh admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      email: 'admin@sportsapp.com',
      password: hashedPassword,
      role: 'admin', // Make sure role is set correctly
      first_name: 'Admin',
      last_name: 'User',
      phone: '1234567890'
    });
    
    await admin.save();
    
    // Verify the user was created with correct role
    const verifyAdmin = await User.findOne({ email: 'admin@sportsapp.com' });
    console.log('Admin user created/updated successfully:');
    console.log('- ID:', verifyAdmin._id);
    console.log('- Email:', verifyAdmin.email);
    console.log('- Role:', verifyAdmin.role);
    console.log('- Password: admin123');
    
    console.log('\nIMPORTANT: Use this URL to access admin login:');
    console.log('http://localhost:3004/admin/login');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 