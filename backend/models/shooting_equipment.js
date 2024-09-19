const { sequelize } = require('../connection')
const { DataTypes, DATEONLY } = require('sequelize');




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
            
        },
        equipment_id:{
            type:DataTypes.BIGINT,
            
        },
        flag:{
            type:DataTypes.BOOLEAN,
            defaultValue: false
        }
                
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