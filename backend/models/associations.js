const { equipment } = require('./equipment');
const { shooting_equipment } = require('./shooting_equipment');

// Define associations after both models are imported
shooting_equipment.belongsTo(equipment, {
  foreignKey: 'equipment_id',
  as: 'equipment',
});

equipment.hasMany(shooting_equipment, {
  foreignKey: 'equipment_id',
  as: 'shooting_equipments',
});