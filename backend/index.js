const express = require('express')
const app = express()
require('dotenv').config()
let cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT

const auth_routes = require ('./routes/auth')
const users_routes = require ('./routes/users')
const user_stuffs_routes = require('./routes/user_stuffs')

app.use(cors({
    origin: ['http://localhost:8080']
}))

app.use('/api/auth', auth_routes)
app.use('/api/users', users_routes)
app.use('/api/stuff', user_stuffs_routes)

app.use((error, request, response, next) => {
    if (error instanceof SyntaxError)
        response.status(400).send({ message: 'not valid data' })
    else
        next()
})

const {get_auth_table} = require('./models/auths')
const {get_users_table} = require('./models/users')
const {get_stuffs_table} = require('./models/user_stuffs')

app.listen(port, () => {
    get_auth_table()
    get_users_table()
    get_stuffs_table()
    console.log(`server started on port ${port}`);
})