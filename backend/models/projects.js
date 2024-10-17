const { sequelize } = require('../connection')
const { DataTypes, DATEONLY } = require('sequelize');



const project = sequelize.define(
    'projects',
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
        project_type_id:{
            type:DataTypes.BIGINT,
            allowNull: false
        },
        client_id:{
            type:DataTypes.BIGINT,
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
        tableName: 'projects',
        timestamps: false
    }
)





module.exports = { project }