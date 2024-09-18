const { equipment } = require('./equipment');
const { shooting_equipment } = require('./shooting_equipment');
const { auth } = require('./auths');
const { user } = require('./users');

// Define associations after both models are imported
shooting_equipment.belongsTo(equipment, {
  foreignKey: 'equipment_id',
  as: 'equipment',
});

equipment.hasMany(shooting_equipment, {
  foreignKey: 'equipment_id',
  as: 'shooting_equipments',
});

user.belongsTo(auth, {
  targetKey: 'auth_uid',
  foreignKey: 'user_uid'
})