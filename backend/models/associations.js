const { equipment } = require('./equipment');
const { equipment_type } = require('./equipment_types');
const { warehouse } = require('./warehouses')
const { set_of_equipment } = require('./set_of_equipment')
const { auth } = require('./auths');
const { user } = require('./users');
const { shooting } = require('./shootings');



user.belongsTo(auth, {
  targetKey: 'auth_uid',
  foreignKey: 'user_uid'
})

equipment.belongsTo(equipment_type, {
  as: 'equipmentToEquipmentType',
  foreignKey: 'equipment_type'
})

equipment.belongsTo(warehouse, {
  as: 'equipmentToPlaceOfStorage',
  foreignKey: 'place_of_storage'
})

equipment.belongsToMany(shooting, {through: "equipment_in_shooting", timestamps: false})
shooting.belongsToMany(equipment, {through: "equipment_in_shooting", timestamps: false})

shooting.belongsTo(user, {
  as: 'shootingToUser',
  foreignKey: 'chief_engineer_id'
})

equipment.belongsToMany(set_of_equipment, {through: "equipment_set_contents", timestamps: false})
set_of_equipment.belongsToMany(equipment, {through: "equipment_set_contents", timestamps: false})

set_of_equipment.belongsTo(equipment_type, {
  as: 'setOfEquipmentToEquipmentType',
  foreignKey: 'set_of_equipment_type'
})