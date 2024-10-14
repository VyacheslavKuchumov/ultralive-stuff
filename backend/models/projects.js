const { sequelize } = require('../connection')
const { DataTypes, DATEONLY } = require('sequelize');



const project = sequelize.define(
    'shootings',
    {
        project_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        project_name:{
            type:DataTypes.TEXT,
            allowNull: false
        },
        shooting_date:{
            type:DataTypes.DATEONLY,
            allowNull: false
        },
        chief_engineer_id:{
            type:DataTypes.BIGINT,
            allowNull: false
        },
                
    },
    {
        tableName: 'shootings',
        timestamps: false
    }
)





module.exports = { project }