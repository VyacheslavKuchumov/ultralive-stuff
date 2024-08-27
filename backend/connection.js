const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/db1233');

async function connect() {
    try {
        await sequelize.authenticate();
        console.log('SUCCES');
    } catch (error) {
        console.error('NOT SUCCES DANIK NEGR')
    }
}
connect()
module.exports = { sequelize }