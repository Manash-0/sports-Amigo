const net = require('net');

// Function to check if MongoDB is running
function checkMongoDBStatus() {
  const mongoPort = 27017;
  const mongoHost = 'localhost';
  
  console.log(`Checking MongoDB status at ${mongoHost}:${mongoPort}...`);
  
  const client = new net.Socket();
  
  // Set a connection timeout of 2 seconds
  client.setTimeout(2000);
  
  client.on('connect', () => {
    console.log('✅ MongoDB is running!');
    client.end();
  });
  
  client.on('timeout', () => {
    console.error('❌ Connection to MongoDB timed out. MongoDB may not be running.');
    console.log('\nTo start MongoDB, try one of these commands:');
    console.log('- Windows: Start-Service MongoDB (PowerShell, run as admin)');
    console.log('- Windows: net start MongoDB (Command Prompt, run as admin)');
    console.log('- macOS/Linux: sudo systemctl start mongod');
    console.log('\nIf MongoDB is not installed, please install it from https://www.mongodb.com/try/download/community');
    client.end();
  });
  
  client.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\nTo start MongoDB, try one of these commands:');
    console.log('- Windows: Start-Service MongoDB (PowerShell, run as admin)');
    console.log('- Windows: net start MongoDB (Command Prompt, run as admin)');
    console.log('- macOS/Linux: sudo systemctl start mongod');
    console.log('\nIf MongoDB is not installed, please install it from https://www.mongodb.com/try/download/community');
    client.end();
  });
  
  client.connect(mongoPort, mongoHost);
}

// Execute the check
checkMongoDBStatus(); 