// models/index.js
const { sequelize } = require('../connection');
const { equipment } = require('./equipment');
const { shooting_equipment } = require('./shooting_equipment');
const { shooting } = require('./shootings');
const { auth } = require('./auths');
const { user } = require('./users');
require('./associations');  // Import the associations after models are loaded


// Optionally sync the database (ensure tables are created)
async function initializeDatabase() {
    try {
      await sequelize.sync({force:true});  // Sync all models with the database
      console.log('Database synchronized');
    } catch (error) {
      console.error('Error syncing the database:', error);
    }
}

module.exports = { initializeDatabase };