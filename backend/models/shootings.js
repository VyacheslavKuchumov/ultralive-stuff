const { sequelize } = require('../connection')
const { DataTypes, DATEONLY } = require('sequelize');
const { equipment } = require('./equipment');


const shooting = sequelize.define(
    'shootings',
    {
        shooting_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        shooting_date:{
            type:DataTypes.DATEONLY,
            allowNull: false
        },
        shooting_name:{
            type:DataTypes.TEXT,
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



async function get_shootings_table() {
    await shooting.sync()
    console.log('Синхрон shootings 👍');
}

module.exports = { shooting, get_shootings_table }