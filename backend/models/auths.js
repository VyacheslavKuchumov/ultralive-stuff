const {sequelize} = require('../connection')
const {DataTypes} = require('sequelize')

const auth = sequelize.define(
    'auth',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        uid: {
            type: DataTypes.UUID
        },
        role: {
            type: DataTypes.TEXT
        },
        AccessToken:{
            type: DataTypes.TEXT
        },
        RefreshToken:{
            type: DataTypes.TEXT
        },
        password:{
            type: DataTypes.TEXT
        },
        email:{
            type: DataTypes.TEXT
        },
    },
    {
        tableName: 'auths',
        timestamps: true,
    }
)
async function get_auth_table(){
    await auth.sync()
    console.log('Синхрон auths');
}

module.exports = {auth, get_auth_table}

