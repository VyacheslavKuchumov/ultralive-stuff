const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')



const set_of_equipment = sequelize.define(
    'set_of_equipment',
    {
        set_of_equipment_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        set_of_equipment_name:{
            type:DataTypes.TEXT,
            allowNull: false
        },
        // set_of_equipment_type:{
        //     type:DataTypes.BIGINT,
        //     allowNull: false
        // }

    },
    {
        tableName: 'set_of_equipment',
        timestamps: false
    },
    
)




module.exports = { set_of_equipment }