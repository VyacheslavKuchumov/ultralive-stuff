const { equipment } = require('./equipment');
const { equipment_type } = require('./equipment_types');
const { warehouse } = require('./warehouses');
const { set_of_equipment } = require('./set_of_equipment');
const { auth } = require('./auths');
const { user } = require('./users');
const { project } = require('./projects');

// User and Auth
user.belongsTo(auth, {
  targetKey: 'auth_uid',
  foreignKey: 'user_uid',
  as: 'auth'
});

// Equipment and EquipmentType
equipment.belongsTo(equipment_type, {
  as: 'type',
  foreignKey: 'equipment_type'
});

// Equipment and Warehouse
equipment.belongsTo(warehouse, {
  as: 'storage',
  foreignKey: 'place_of_storage'
});

// Equipment and Project (Many-to-Many)
equipment.belongsToMany(project, {
  through: "equipment_in_shooting",
  timestamps: false
});
project.belongsToMany(equipment, {
  through: "equipment_in_shooting",
  timestamps: false
});

// Shooting and User (Chief Engineer)
project.belongsTo(user, {
  as: 'chiefEngineer',
  foreignKey: 'chief_engineer_id'
});

// Equipment and SetOfEquipment (Many-to-Many)
equipment.belongsToMany(set_of_equipment, {
  through: "equipment_set_contents",
  timestamps: false
});
set_of_equipment.belongsToMany(equipment, {
  through: "equipment_set_contents",
  timestamps: false
});

// Uncomment and rename if needed for EquipmentType association with SetOfEquipment
// set_of_equipment.belongsTo(equipment_type, {
//   as: 'type',
//   foreignKey: 'set_of_equipment_type'
// });
