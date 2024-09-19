const { equipment_type } = require('../models/equipment_types');

// Function to get all equipment types
const getAllEquipmentTypes = async (req, res) => {
    try {
        const data = await equipment_type.findAll({});
        if (!data) return res.status(404).send({ message: 'Equipment types not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};



// Function to add a new equipment type
const addOneEquipmentType = async (req, res) => {
    try {
        const { equipment_type_name } = req.body;
        const newEquipmentType = await equipment_type.create({
            equipment_type_name
        });
        const data = await equipment_type.findAll({});
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to edit an equipment type by ID
const editEquipmentTypeById = async (req, res) => {
    try {
        const id = req.params.id;
        const { equipment_type_name } = req.body;
        const equipmentTypeToUpdate = await equipment_type.findByPk(id);

        if (!equipmentTypeToUpdate) return res.status(404).send({ message: 'Equipment type not found' });

        await equipmentTypeToUpdate.update({
            equipment_type_name
        });
        const data = await equipment_type.findAll({});
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to delete an equipment type by ID
const deleteEquipmentTypeById = async (req, res) => {
    try {
        const id = req.params.id;
        const equipmentTypeToDelete = await equipment_type.findByPk(id);

        if (!equipmentTypeToDelete) return res.status(404).send({ message: 'Equipment type not found' });

        await equipmentTypeToDelete.destroy();
        const data = await equipment_type.findAll({});
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Exporting the functions
module.exports = {
    getAllEquipmentTypes,
    addOneEquipmentType,
    editEquipmentTypeById,
    deleteEquipmentTypeById,
};
