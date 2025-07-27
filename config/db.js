const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const Team = require('../models/team');
const UserProfile = require('../models/profile');

// Connect to MongoDB (connection handled by config/mongodb.js)
const db = mongoose.connection;

// Check if we need to create sample data
async function checkAndCreateSampleData() {
    try {
        const userCount = await User.countDocuments();
        
        if (userCount === 0) {
            await createSampleData();
        }
    } catch (err) {
        console.error('Error checking user count:', err);
    }
}

// Add sample data for testing
async function createSampleData() {
    console.log('Creating sample data...');
    
    try {
        // Sample users (password: password123)
        const hashedPassword = bcrypt.hashSync('password123', 10);
        
        const sampleUsers = [
            { email: 'admin@example.com', password: hashedPassword, role: 'manager',
              first_name: 'Admin', last_name: 'User', phone: '1234567890' },
            { email: 'player@example.com', password: hashedPassword, role: 'player',
              first_name: 'John', last_name: 'Doe', phone: '9876543210' },
            { email: 'organizer@example.com', password: hashedPassword, role: 'organizer',
              first_name: 'Event', last_name: 'Planner', phone: '5551234567' }
        ];
        
        // Create users and related data
        for (const user of sampleUsers) {
            const newUser = await User.create(user);
            console.log(`Created sample user: ${user.email}`);
            
            // Create profile data
            if (user.role === 'player') {
                await UserProfile.create({
                    user: newUser._id,
                    preferred_sports: ['Basketball', 'Football', 'Tennis']
                });
            } else if (user.role === 'organizer') {
                await UserProfile.create({
                    user: newUser._id,
                    organization_name: 'Sports Events Inc.'
                });
            } else if (user.role === 'manager') {
                await UserProfile.create({
                    user: newUser._id,
                    team_name: 'Champions Team'
                });
                
                // Create a team for this manager
                await Team.create({
                    manager: newUser._id,
                    name: 'Champions Team',
                    sport_type: 'Basketball',
                    max_members: 10
                });
            }
        }
    } catch (err) {
        console.error('Error creating sample data:', err);
    }
}

// Run initial checks
checkAndCreateSampleData();

module.exports = db;