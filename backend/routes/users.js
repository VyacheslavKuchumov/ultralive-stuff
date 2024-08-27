const express = require('express')
const router = express.Router()
const { authJwt } = require('../middlewares/auths')

const { getUserByUid, updateLike, getUserByName } = require('../controllers/users')

router.get('/:uid', [authJwt.verifyToken], getUserByUid)
router.put('/likes', [authJwt.verifyToken], updateLike)
router.get('/search/:name', getUserByName)

module.exports = router