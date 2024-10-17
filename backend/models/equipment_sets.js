const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')



const equipment_set = sequelize.define(
    'equipment_set',
    {
        equipment_set_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        equipment_set_name:{
            type:DataTypes.TEXT,
            allowNull: false,
            unique: true
        }

    },
    {
        tableName: 'equipment_sets',
        timestamps: false
    },
    
)




module.exports = { equipment_set }