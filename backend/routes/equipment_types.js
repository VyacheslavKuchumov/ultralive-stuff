const express = require('express')
const router = express.Router()


const { getAllEquipmentTypes, addOneEquipmentType, deleteEquipmentTypeById, editEquipmentTypeById } = require('../controllers/equipment_types')

router.get('/', getAllEquipmentTypes)
router.post('/', addOneEquipmentType)
router.delete('/:id', deleteEquipmentTypeById)
router.put('/:id', editEquipmentTypeById)

module.exports = router