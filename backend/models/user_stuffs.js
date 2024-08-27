const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')


const user_stuffs = sequelize.define(
    'user_stuff',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        
        user_id: {
            type: DataTypes.BIGINT
        },

        bio:{
            type:DataTypes.TEXT
        },
        links:{
            type:DataTypes.ARRAY(DataTypes.TEXT)
        },
        avatar_pic:{
            type:DataTypes.TEXT
        }
    },
    {
        tableName: 'user_stuffs',
        timestamps: false
    }
)



async function get_stuffs_table() {
    await user_stuffs.sync()
    console.log('Синхрон');
}

module.exports = { user_stuffs, get_stuffs_table }