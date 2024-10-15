const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')



const equipment = sequelize.define(
    'equipment',
    {
        equipment_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        equipment_name:{
            type:DataTypes.TEXT,
            allowNull: false
        },
        serial_number:{
            type:DataTypes.TEXT,
            allowNull: false
        },
        equipment_type:{
            type:DataTypes.BIGINT,
            allowNull: false
        },
        place_of_storage:{
            type:DataTypes.BIGINT,
            allowNull: false
        },
        current_place_of_storage:{
            type:DataTypes.TEXT,
            allowNull: true
        },
        needs_maintenance:{
            type:DataTypes.BOOLEAN,
            defaultValue: false
        },
        date_of_purchase:{
            type:DataTypes.DATEONLY,
            allowNull: false
        },
        cost_of_purchase:{
            type:DataTypes.DECIMAL,
            allowNull: false
        }

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