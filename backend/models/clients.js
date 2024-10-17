const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')



const client = sequelize.define(
    'client',
    {
        client_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        client_name:{
            type:DataTypes.TEXT,
            allowNull: false,
            unique: true
        }

    },
    {
        tableName: 'clients',
        timestamps: false
    },
    
)




module.exports = { client }