const { set_of_equipment } = require('../models/set_of_equipment');

// Function to get all sets of equipment
const getAllSetsOfEquipment = async (req, res) => {
    try {
        const data = await set_of_equipment.findAll({});
        if (!data) return res.status(404).send({ message: 'Sets of equipment not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to get a set of equipment by ID
const getSetOfEquipmentById = async (req, res) => {
    try {
        const data = await set_of_equipment.findOne({ where: { set_of_equipment_id: req.params.id } });
        if (!data) return res.status(404).send({ message: 'Set of equipment not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to add a new set of equipment
const addOneSetOfEquipment = async (req, res) => {
    try {
        const { set_of_equipment_name, set_of_equipment_type } = req.body;
        const newSetOfEquipment = await set_of_equipment.create({
            set_of_equipment_name,
            set_of_equipment_type: parseInt(set_of_equipment_type),
        });
        const data = await set_of_equipment.findAll({});
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to edit a set of equipment by ID
const editSetOfEquipmentById = async (req, res) => {
    try {
        const id = req.params.id;
        const { set_of_equipment_name, set_of_equipment_type } = req.body;
        const setToUpdate = await set_of_equipment.findByPk(id);

        if (!setToUpdate) return res.status(404).send({ message: 'Set of equipment not found' });

        await setToUpdate.update({
            set_of_equipment_name,
            set_of_equipment_type: parseInt(set_of_equipment_type),
        });
        const data = await set_of_equipment.findAll({});
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to delete a set of equipment by ID
const deleteSetOfEquipmentById = async (req, res) => {
    try {
        const id = req.params.id;
        const setToDelete = await set_of_equipment.findByPk(id);

        if (!setToDelete) return res.status(404).send({ message: 'Set of equipment not found' });

        await setToDelete.destroy();
        const data = await set_of_equipment.findAll({});
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Exporting the functions
module.exports = {
    getAllSetsOfEquipment,
    addOneSetOfEquipment,
    editSetOfEquipmentById,
    deleteSetOfEquipmentById,
    getSetOfEquipmentById
};
