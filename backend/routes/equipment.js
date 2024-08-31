const express = require('express')
const router = express.Router()


const { getAllEquipment, editEquipmentById, deleteEquipmentById, addOneEquipment } = require('../controllers/equipment')

router.get('/', getAllEquipment)
router.post('/', addOneEquipment)
router.delete('/', deleteEquipmentById)
router.put('/', editEquipmentById)

module.exports = router