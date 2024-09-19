const express = require('express')
const router = express.Router()


const { getAllSetsOfEquipment, addOneSetOfEquipment, deleteSetOfEquipmentById, editSetOfEquipmentById } = require('../controllers/set_of_equipment')

router.get('/', getAllSetsOfEquipment)
router.post('/', addOneSetOfEquipment)
router.delete('/:id', deleteSetOfEquipmentById)
router.put('/:id', editSetOfEquipmentById)

module.exports = router