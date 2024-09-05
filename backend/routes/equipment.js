const express = require('express')
const router = express.Router()


const { getAllEquipment, editEquipmentById, deleteEquipmentById, addOneEquipment, getEquipmentById } = require('../controllers/equipment')

router.get('/', getAllEquipment)
router.get('/search/:id', getEquipmentById)
router.post('/', addOneEquipment)
router.delete('/:id', deleteEquipmentById)
router.put('/:id', editEquipmentById)

module.exports = router