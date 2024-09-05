const { sequelize } = require('../connection')
const { DataTypes } = require('sequelize')
const { auth } = require('./auths')

const user = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        //uid: {
        //      type: DataTypes.UUID
        //  },
        name: {
            type: DataTypes.TEXT
        },
        likes: {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: 'users',
        timestamps: true
    }
)

// user.belongsTo(auth, {
//     as: 'Uid',
//     foreignKey: 'uid'
// })

async function get_users_table() {
    await user.sync()
    console.log('Синхрон users 👍');
}

module.exports = { user, get_users_table }