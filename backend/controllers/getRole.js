const { connectDB } = require('../mongodb_connector');

async function getRole() {
  let client;
  try {
    client = await connectDB();
    const admin = client.db().admin();
    
    const currentUser = await admin.command({ connectionStatus: 1 });
    
    return currentUser.authInfo;
    
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw new Error('Error fetching roles');
  }
}

module.exports = getRole;
