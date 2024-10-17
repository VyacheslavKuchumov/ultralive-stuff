const { equipment_set } = require('../models/equipment_sets');

// Function to get all equipment sets
const getAllEquipmentSets = async (req, res) => {
    try {
        const data = await equipment_set.findAll({});
        if (!data) return res.status(404).send({ message: 'Equipment sets not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to get an equipment set by ID
const getEquipmentSetById = async (req, res) => {
    try {
        const data = await equipment_set.findOne({ where: { equipment_set_id: req.params.id } });
        if (!data) return res.status(404).send({ message: 'Equipment set not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to add a new equipment set
const createEquipmentSet = async (req, res) => {
    try {
        const { equipment_set_name } = req.body;
        const newEquipmentSet = await equipment_set.create({
            equipment_set_name
        });
        const data = await equipment_set.findAll({});
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to edit an equipment set by ID
const editEquipmentSetById = async (req, res) => {
    try {
        const id = req.params.id;
        const { equipment_set_name } = req.body;
        const equipmentSetToUpdate = await equipment_set.findByPk(id);

        if (!equipmentSetToUpdate) return res.status(404).send({ message: 'Equipment set not found' });

        await equipmentSetToUpdate.update({
            equipment_set_name
        });
        const data = await equipment_set.findAll({});
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to delete an equipment set by ID
const deleteEquipmentSetById = async (req, res) => {
    try {
        const id = req.params.id;
        const equipmentSetToDelete = await equipment_set.findByPk(id);

        if (!equipmentSetToDelete) return res.status(404).send({ message: 'Equipment set not found' });

        await equipmentSetToDelete.destroy();
        const data = await equipment_set.findAll({});
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Exporting the functions
module.exports = {
    getAllEquipmentSets,
    createEquipmentSet,
    editEquipmentSetById,
    deleteEquipmentSetById,
    getEquipmentSetById
};
