const Event = require('../models/event');
const EventTeamRegistration = require('../models/registration');

// Ensure indexes for better performance
async function ensureIndexes() {
    try {
        await Event.createIndexes();
        await EventTeamRegistration.createIndexes();
        console.log('MongoDB indexes verified');
    } catch (err) {
        console.error('Error ensuring MongoDB indexes:', err);
    }
}

// Run index creation
ensureIndexes();