const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')

const { shooting } = require('./shootings');
const { shooting_equipment } = require('./shooting_equipment');

const equipment = sequelize.define(
    'equipment',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        equipment_name:{
            type:DataTypes.TEXT
        },
        serial_number:{
            type:DataTypes.TEXT
        },

        
    },
    {
        tableName: 'equipment',
        timestamps: false
    },
    
)



async function get_equipment_table() {
    await equipment.sync()
    console.log('Синхрон equipment 👍');
}

module.exports = { equipment, get_equipment_table }