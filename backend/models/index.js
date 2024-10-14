// models/index.js
const { sequelize } = require('../connection');
const { equipment } = require('./equipment');
const { shooting } = require('./projects');
const { auth } = require('./auths');
const { user } = require('./users');
const { warehouse } = require('./warehouses');
const { equipment_type } = require('./equipment_types');
const { set_of_equipment } = require('./set_of_equipment')

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