const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsamigo';

async function validateMongoDBStructure() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connection successful!');
    
    // Get all schema files
    const schemasPath = path.join(__dirname, 'models', 'schemas');
    console.log(`Looking for schema files in: ${schemasPath}`);
    
    // Check if schemas directory exists
    if (!fs.existsSync(schemasPath)) {
      console.error(`❌ Schemas directory not found: ${schemasPath}`);
      return;
    }
    
    const schemaFiles = fs.readdirSync(schemasPath)
      .filter(file => file.endsWith('Schema.js'));
    
    console.log(`Found ${schemaFiles.length} schema files:`);
    schemaFiles.forEach(file => console.log(`- ${file}`));
    
    // Get all model files
    const modelsPath = path.join(__dirname, 'models');
    console.log(`\nLooking for model files in: ${modelsPath}`);
    
    const modelFiles = fs.readdirSync(modelsPath)
      .filter(file => 
        file.endsWith('.js') && 
        !file.includes('index') && 
        !file.includes('schemas')
      );
    
    console.log(`Found ${modelFiles.length} model files:`);
    modelFiles.forEach(file => console.log(`- ${file}`));
    
    // Get collections from MongoDB
    console.log('\nChecking MongoDB collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections in MongoDB:`);
    collections.forEach(collection => console.log(`- ${collection.name}`));
    
    // Validate schema and model structure
    console.log('\nValidating schema structure:');
    
    // Expected schemas and their fields
    const expectedSchemas = [
      { 
        name: 'userSchema',
        fields: ['email', 'password', 'role', 'first_name', 'last_name'] 
      },
      { 
        name: 'teamSchema',
        fields: ['name', 'sport_type', 'manager_id', 'members'] 
      },
      { 
        name: 'eventSchema',
        fields: ['title', 'organizer_id', 'event_date', 'location', 'sport_type'] 
      },
      { 
        name: 'playerProfileSchema',
        fields: ['user_id', 'sport', 'skill_level'] 
      },
      { 
        name: 'profileSchema',
        fields: ['user_id', 'address', 'teams'] 
      },
      { 
        name: 'registrationSchema',
        fields: ['team_id', 'event_id', 'status', 'registration_date'] 
      }
    ];
    
    // Check each expected schema
    for (const schema of expectedSchemas) {
      const schemaFile = path.join(schemasPath, `${schema.name}.js`);
      
      if (fs.existsSync(schemaFile)) {
        console.log(`✅ Schema file exists: ${schema.name}.js`);
        
        // Check if this schema has a model and collection
        const modelName = schema.name.replace('Schema', '');
        const modelFile = modelFiles.find(file => file.toLowerCase() === `${modelName}.js`);
        
        if (modelFile) {
          console.log(`  ✅ Model file exists: ${modelFile}`);
        } else {
          console.log(`  ❌ Model file not found for schema: ${schema.name}`);
        }
        
        // Check for corresponding collection
        const collectionName = modelName + 's'; // Simple pluralization
        const collection = collections.find(c => c.name.toLowerCase() === collectionName.toLowerCase());
        
        if (collection) {
          console.log(`  ✅ Collection exists in MongoDB: ${collection.name}`);
        } else {
          console.log(`  ❓ Collection not found in MongoDB: ${collectionName} (This may be OK if no data yet)`);
        }
      } else {
        console.log(`❌ Schema file missing: ${schema.name}.js`);
      }
    }
    
    console.log('\nValidation completed!');
    
  } catch (err) {
    console.error('❌ MongoDB connection or validation error:', err);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the validation
validateMongoDBStructure(); 