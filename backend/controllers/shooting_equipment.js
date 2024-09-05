const { where } = require('sequelize');
const { shooting_equipment } = require('../models/shooting_equipment');

// Function to get all equipment
const getAllEquipmentInShooting = async (req, res) => {
    try {
        const input_id = req.params.id; // Example equipment fields
        const data = await shooting_equipment.findAll({where: {shooting_id: input_id}})
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const addEquipmentToShooting = async (req, res) => {
    try {
        const { equipment_id,  shooting_id} = req.body; 
        const newStuff = await shooting_equipment.create({ shooting_id,  equipment_id });
        const data = await shooting_equipment.findAll({});
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}



// Function to delete equipment by ID
const deleteEquipmentFromShooting = async (req, res) => {
    try {
        const input_id = req.params.id
        const equipmentToDelete = await shooting_equipment.findByPk(input_id);
        
        if (!equipmentToDelete) return res.status(404).send({ message: 'Equipment not found' });

        await equipmentToDelete.destroy(input_id);
        const data = await shooting_equipment.findAll({});
        return res.status(200).send(data); 
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Exporting the functions
module.exports = {
    getAllEquipmentInShooting,
    addEquipmentToShooting,
    deleteEquipmentFromShooting
}
