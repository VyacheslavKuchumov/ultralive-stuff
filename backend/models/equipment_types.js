const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')



const equipment_type = sequelize.define(
    'equipment_type',
    {
        equipment_type_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        equipment_type_name:{
            type:DataTypes.TEXT,
            allowNull: false
        }

    },
    {
        tableName: 'equipment_types',
        timestamps: false
    },
    
)




module.exports = { equipment_type }