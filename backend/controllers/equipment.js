const { equipment } = require('../models/equipment');

// Function to get all equipment
const getAllEquipment = async (req, res) => {
    try {
        const data = await equipment.findAll({});
        if (!data) return res.status(404).send({ message: 'Equipment not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Function to add one equipment
const addOneEquipment = async (req, res) => {
    try {
        const { equipment_name,  serial_number} = req.body; // Example equipment fields
        const newEquipment = await equipment.create({ equipment_name,  serial_number });
        return res.status(201).json(newEquipment);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Function to edit equipment by ID
const editEquipmentById = async (req, res) => {
    try {
        
        const { id, equipment_name,  serial_number } = req.body; // Example fields to update
        const equipmentToUpdate = await equipment.findByPk(id);

        if (!equipmentToUpdate) return res.status(404).send({ message: 'Equipment not found' });

        await equipmentToUpdate.update({ equipment_name,  serial_number });
        return res.json(equipmentToUpdate);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Function to delete equipment by ID
const deleteEquipmentById = async (req, res) => {
    try {
        const { id } = req.body;
        const equipmentToDelete = await equipment.findByPk(id);

        if (!equipmentToDelete) return res.status(404).send({ message: 'Equipment not found' });

        await equipmentToDelete.destroy();
        return res.status(204).send({message: "deleted succesfully"}); // No content
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Exporting the functions
module.exports = {
    getAllEquipment,
    addOneEquipment,
    editEquipmentById,
    deleteEquipmentById
}
