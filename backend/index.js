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
const warehouses_routes = require ('./routes/warehouses')
const equipment_types_routes = require ('./routes/equipment_types')
const set_of_equipment_routes = require ('./routes/set_of_equipment')


app.use(cors({
    origin: ['http://localhost:8080']
}))

app.use('/api/auth', auth_routes)
app.use('/api/users', users_routes)
app.use('/api/equipment', equipment_routes)
app.use('/api/warehouse', warehouses_routes)
app.use('/api/equipment_type', equipment_types_routes)
app.use('/api/set_of_equipment', set_of_equipment_routes)


app.use((error, request, response, next) => {
    if (error instanceof SyntaxError)
        response.status(400).send({ message: 'not valid data' })
    else
        next()
})


const {initializeDatabase} = require('./models/index')



app.listen(port, () => {
    //###############################
    // initializeDatabase()
    //###############################
    console.log(`server started on port ${port}`);
})