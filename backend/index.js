const express = require('express')
const app = express()
require('dotenv').config()
let cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT

const auth_routes = require ('./routes/auth')
const users_routes = require ('./routes/users')
const equipment_routes = require ('./routes/equipment')
const shooting_equipment_routes = require ('./routes/shooting_equipment')



app.use(cors({
    origin: ['http://localhost:8080']
}))

app.use('/api/auth', auth_routes)
app.use('/api/users', users_routes)
app.use('/api/equipment', equipment_routes)
app.use('/api/shooting_equipment', shooting_equipment_routes)



app.use((error, request, response, next) => {
    if (error instanceof SyntaxError)
        response.status(400).send({ message: 'not valid data' })
    else
        next()
})

const {get_auth_table} = require('./models/auths')
const {get_users_table} = require('./models/users')
const {get_equipment_table} = require('./models/equipment')
const {get_shootings_table} = require('./models/shootings')
const {get_shooting_equipment_table} = require('./models/shooting_equipment')
const {initializeDatabase} = require('./models/index')



app.listen(port, () => {
    // initializeDatabase()
    // get_auth_table()
    // get_users_table()
    // get_equipment_table()
    // get_shootings_table()
    // get_shooting_equipment_table()
    console.log(`server started on port ${port}`);
})