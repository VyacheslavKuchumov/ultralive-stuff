const { auth } = require('../models/auths')
const { user } = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.secret
const { v4: uuidv4 } = require('uuid')
const ACCESS_LIFETIME = 60 * 15;
const REFRESH_LIFETIME = 60 * 60 * 24 * 60;

createToken = (uid, lifetime) => jwt.sign({ uid }, secret, { expiresIn: lifetime })
createAccess = (uid) => createToken(uid, ACCESS_LIFETIME)
createRefresh = (uid) => createToken(uid, REFRESH_LIFETIME)

exports.signup = async (req, res) => {
    try {
        const authed = await auth.create({
            email: req.body.email.toLowerCase(),
            role: 'user',
            password: bcrypt.hashSync(req.body.password, 8),
            uid: uuidv4(),

        })
        const cur_user = await user.create({
            uid: authed.uid,
            name: req.body.name,
            likes: 0
        })
        return res.status(201).send({ message: 'registered', uid: cur_user.uid })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ message: error.message })
    }

}
exports.signin = async (req, res) => {
    try {
        const user = await auth.findOne({
            where: {
                email: req.body.email.toLowerCase()
            }
        })
        if (!user) return res.status(404).send({ message: 'User not found' })
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
        if (!passwordIsValid) return res.status(414).send({ message: 'Pass is not valid' })
        const token = createAccess(user.uid)
        const token_refresh = createRefresh(user.uid)
        await auth.update({ AccessToken: token, RefreshToken: token_refresh }, { where: { uid: user.uid } })
        return res.status(200).send({
            uid: user.uid,
            accessToken: token,
            refreshToken: token_refresh
        })
    } catch (error) {
        return res.status(400).send({ message: error.message })
    }
}

exports.changeAccess = async (req, res) => {
    let token_refresh = req.body.headers['x-refresh-token']
    try {
        const { uid } = jwt.verify(token_refresh, secret)
        const user = await auth.findOne({where: { uid: uid }})
        if (!user) return res.status(404).send({ message: 'User not found' })
        // if (token_refresh != user['RefreshToken']) return res.status(403).send({ message: 'Unauthorized' })
        let token = createAccess(user.uid)
        token_refresh = createRefresh(user.uid)
        await auth.update({ AccessToken: token, RefreshToken: token_refresh },
            { where: { uid: user.uid } })
        return res.status(200).send({
            accessToken: token,
            refreshToken: token_refresh,
            uid: user.uid
        })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}
