const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['player', 'manager', 'organizer', 'admin'],
        default: 'player'
    },
    first_name: {
        type: String,
        trim: true
    },
    last_name: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    preferred_sports: {
        type: String,
        trim: true
    },
    organization_name: {
        type: String,
        trim: true
    },
    profile_image: {
        type: String,
        default: null
    },
    joined_date: {
        type: Date,
        default: Date.now
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    last_login: {
        type: Date
    },
    // Additional profile information
    profile: {
        age: {
            type: Number
        },
        address: {
            type: String
        },
        bio: {
            type: String
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', '']
        },
        dob: {
            type: Date
        },
        preferred_sports: {
            type: String
        },
        preferred_role: {
            type: String
        },
        social_links: {
            facebook: String,
            twitter: String,
            instagram: String,
            linkedin: String
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it's modified or new
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};

// Export just the schema
module.exports = userSchema;