const mongoose = require('./mongodb');
const User = require('../models/user');
const Team = require('../models/team');
const Event = require('../models/event');

// Initialize database schema validation
async function setupDatabase() {
    try {
        // Sync indexes for all models
        await User.syncIndexes();
        await Team.syncIndexes();
        await Event.syncIndexes();
        
        console.log('MongoDB schema validation setup complete');
    } catch (err) {
        console.error('Error setting up MongoDB schema validation:', err);
    }
}

// Run the setup
setupDatabase();

module.exports = { setupDatabase };