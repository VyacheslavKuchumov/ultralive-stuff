const express = require('express')
const router = express.Router()
const { authJwt } = require('../middlewares/auths')

const { getUserInfo, postUserBioById } = require('../controllers/user_stuffs')

router.get('/:user_id', getUserInfo)
router.post('/:user_id', postUserBioById)


module.exports = router