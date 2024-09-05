const { sequelize } = require('../connection')
const { DataTypes, DATEONLY } = require('sequelize');
const { equipment } = require('./equipment');
const { shooting } = require('./shootings');



const shooting_equipment = sequelize.define(
    'shooting_equipment',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        shooting_id:{
            type:DataTypes.BIGINT,
            references: {
                model: equipment,
                key: 'id'
            },
            onDelete: 'CASCADE', 
        },
        equipment_id:{
            type:DataTypes.BIGINT,
            references: {
                model: shooting,
                key: 'id'
            },
            onDelete: 'CASCADE', 
        },
                
    },
    {
        tableName: 'shooting_equipment',
        timestamps: false
    }
)




async function get_shooting_equipment_table() {
    await shooting_equipment.sync()
    console.log('Синхрон shooting_equipment 👍');
}

module.exports = { shooting_equipment, get_shooting_equipment_table }