const express = require('express')
const router = express.Router()


const { getAllEquipmentSets, createEquipmentSet, deleteEquipmentSetById, editEquipmentSetById } = require('../controllers/equipment_sets')

router.get('/', getAllEquipmentSets)
router.post('/', createEquipmentSet)
router.delete('/:id', deleteEquipmentSetById)
router.put('/:id', editEquipmentSetById)

module.exports = router